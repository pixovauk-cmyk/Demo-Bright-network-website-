import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

interface CourseYaml {
  modules: Array<{
    slug: string
    videoUrl?: string
    duration?: string
    description?: string
    resources?: string[]
    [key: string]: unknown
  }>
  [key: string]: unknown
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { slug } = await params
  const { moduleSlug, videoUrl, duration, description, resources } = await request.json()

  const filePath = path.join(process.cwd(), 'content', 'courses', `${slug}.yaml`)

  let doc: CourseYaml
  try {
    doc = yaml.load(fs.readFileSync(filePath, 'utf-8')) as CourseYaml
  } catch {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  const modIndex = doc.modules.findIndex(m => m.slug === moduleSlug)
  if (modIndex === -1) return NextResponse.json({ error: 'Module not found' }, { status: 404 })

  doc.modules[modIndex] = {
    ...doc.modules[modIndex],
    ...(videoUrl !== undefined && { videoUrl }),
    ...(duration !== undefined && { duration }),
    ...(description !== undefined && { description }),
    ...(resources !== undefined && { resources }),
  }

  fs.writeFileSync(filePath, yaml.dump(doc, { lineWidth: 120 }), 'utf-8')

  return NextResponse.json({ ok: true })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { slug } = await params
  const { title, slug: moduleSlug, duration } = await request.json()

  const filePath = path.join(process.cwd(), 'content', 'courses', `${slug}.yaml`)
  let doc: CourseYaml
  try {
    doc = yaml.load(fs.readFileSync(filePath, 'utf-8')) as CourseYaml
  } catch {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  if (doc.modules.some(m => m.slug === moduleSlug)) {
    return NextResponse.json({ error: 'Module slug already exists' }, { status: 409 })
  }

  doc.modules.push({
    title,
    slug: moduleSlug,
    duration: duration || '45 min',
    videoUrl: '',
    description: '',
    resources: [],
  })

  fs.writeFileSync(filePath, yaml.dump(doc, { lineWidth: 120 }), 'utf-8')
  return NextResponse.json({ ok: true })
}
