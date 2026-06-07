import { createAdminClient } from '@/lib/supabase/admin-client'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

// RSS sources per sector
const RSS_SOURCES: Record<string, { url: string; name: string }[]> = {
  business: [
    { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', name: 'BBC Business' },
    { url: 'https://www.theguardian.com/business/rss', name: 'Guardian Business' },
  ],
  technology: [
    { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', name: 'BBC Technology' },
    { url: 'https://techcrunch.com/feed/', name: 'TechCrunch' },
  ],
  finance: [
    { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', name: 'BBC Business' },
    { url: 'https://www.ftadviser.com/feed/', name: 'FT Adviser' },
  ],
  hr: [
    { url: 'https://www.personneltoday.com/feed/', name: 'Personnel Today' },
    { url: 'https://www.hrmagazine.co.uk/feed/', name: 'HR Magazine' },
  ],
  'customer-service': [
    { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', name: 'BBC Business' },
  ],
  management: [
    { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', name: 'BBC Business' },
    { url: 'https://www.managementtoday.co.uk/rss/', name: 'Management Today' },
  ],
  other: [
    { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', name: 'BBC Business' },
  ],
}

function parseRSS(xml: string, limit = 5) {
  const items: { title: string; link: string; description: string }[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
    const block = match[1]
    const title = block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1]
      ?? block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ''
    const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]
      ?? block.match(/<guid>([\s\S]*?)<\/guid>/)?.[1] ?? ''
    const desc = block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1]
      ?? block.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? ''
    const cleanDesc = desc.replace(/<[^>]+>/g, '').trim().slice(0, 400)
    if (title.trim()) items.push({ title: title.trim(), link: link.trim(), description: cleanDesc })
  }
  return items
}

export async function GET(request: Request) {
  // Verify Vercel cron secret
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const results: Record<string, number> = {}
  const errors: string[] = []

  for (const [sector, sources] of Object.entries(RSS_SOURCES)) {
    let articlesIndexed = 0

    for (const source of sources) {
      try {
        const res = await fetch(source.url, {
          headers: { 'User-Agent': 'Mozilla/5.0 BrightPeak/1.0' },
          signal: AbortSignal.timeout(10000),
        })
        if (!res.ok) {
          errors.push(`${source.name}: HTTP ${res.status}`)
          continue
        }

        const xml = await res.text()
        const items = parseRSS(xml, 3)

        if (items.length === 0) {
          errors.push(`${source.name}: parsed 0 items`)
          continue
        }

        for (const item of items) {
          if (!item.title || !item.description) continue

          // Ask Claude to summarise for an apprentice
          const message = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 400,
            messages: [{
              role: 'user',
              content: `You are helping UK apprentices stay up to date with industry news.

Article title: ${item.title}
Article excerpt: ${item.description}
Sector: ${sector}

Write a JSON response with:
- "summary": one sentence summary in plain English for an apprentice (max 120 chars)
- "bullets": array of exactly 3 short bullet points (each max 80 chars) explaining why this matters to someone studying ${sector}

Respond ONLY with valid JSON, no markdown.`,
            }],
          })

          const raw = (message.content[0] as { text: string }).text.trim()
          let parsed: { summary: string; bullets: string[] }
          try {
            parsed = JSON.parse(raw)
          } catch {
            continue
          }

          // Deduplicate by title
          const { data: existing } = await supabase
            .from('articles')
            .select('id')
            .eq('title', item.title)
            .maybeSingle()

          if (existing) continue

          await supabase.from('articles').insert({
            title: item.title,
            summary: parsed.summary,
            bullet_points: parsed.bullets,
            url: item.link,
            source: source.name,
            sector,
          })

          articlesIndexed++
        }
      } catch (e) {
        errors.push(`${source.name}: ${e instanceof Error ? e.message : 'unknown error'}`)
      }
    }

    results[sector] = articlesIndexed
  }

  return NextResponse.json({ ok: true, indexed: results, errors })
}
