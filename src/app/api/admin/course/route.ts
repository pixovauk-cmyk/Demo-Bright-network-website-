import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const { title, level, sector, duration, tagline, description, heroImage, featured, whatYouLearn, employerBenefits } = body

  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 })

  const slug = slugify(title)
  const filePath = path.join(process.cwd(), 'content', 'courses', `${slug}.yaml`)

  if (fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'A course with this title already exists' }, { status: 409 })
  }

  const courseData = {
    title,
    level: String(level),
    sector: sector || 'business',
    duration: duration || '18 months',
    tagline: tagline || '',
    description: description || '',
    heroImage: heroImage || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
    featured: Boolean(featured),
    whatYouLearn: (whatYouLearn ?? []).filter(Boolean),
    employerBenefits: (employerBenefits ?? []).filter(Boolean),
    modules: [
      {
        title: 'Module 1',
        slug: 'module-1',
        duration: '45 min',
        videoUrl: '',
        description: 'Add your module description here.',
        resources: [],
      },
    ],
  }

  fs.writeFileSync(filePath, yaml.dump(courseData, { lineWidth: 120 }), 'utf-8')

  return NextResponse.json({ ok: true, slug })
}
