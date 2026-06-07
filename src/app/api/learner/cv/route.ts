import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const {
    fullName, email, phone, location,
    personalStatement,
    workExperience,
    skills,
    completedCourses,
  } = await request.json()

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const coursesText = completedCourses.length > 0
    ? completedCourses.map((c: { title: string; level: string; completedAt: string }) =>
        `- ${c.title} (Level ${c.level} Apprenticeship) — completed ${c.completedAt}`
      ).join('\n')
    : 'Currently enrolled in apprenticeship programme'

  const workText = workExperience.map((w: { role: string; company: string; duration: string; description: string }) =>
    `Role: ${w.role} at ${w.company} (${w.duration})\n${w.description}`
  ).join('\n\n')

  const prompt = `You are an expert UK CV writer. Create a professional, ATS-optimised CV in UK format.

Candidate details:
Name: ${fullName}
Email: ${email}
Phone: ${phone || 'Not provided'}
Location: ${location || 'United Kingdom'}

Personal statement from candidate:
${personalStatement}

Work experience:
${workText || 'No work experience provided'}

Apprenticeship qualifications:
${coursesText}

Skills:
${skills}

Instructions:
- Write in UK English (not American English)
- Format: Personal Profile → Key Skills → Work Experience → Education & Qualifications → Interests (optional)
- Personal profile: 3-4 sentences, punchy, tailored to the apprenticeship sector
- Key skills: 6-8 bullet points, use action words
- Work experience: use STAR-style bullet points under each role
- Education: include the apprenticeship qualifications prominently
- Keep to 2 pages maximum
- Do NOT include a photo, date of birth, or marital status (UK best practice)
- Output clean markdown with ## headings and bullet points
- Make it high quality — this person is competing in the UK job market`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const cv = (message.content[0] as { text: string }).text
    return NextResponse.json({ cv })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Claude API error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
