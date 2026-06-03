import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { requireMod } from '@/lib/auth-helpers'

/**
 * POST /api/admin/upload
 * Body: multipart/form-data with fields:
 *   - file: the file binary
 *   - folder: optional folder prefix (e.g. 'lectures', 'labs')
 *
 * Returns: { url } — public URL the client should store in fileUrl/manualUrl/etc.
 *
 * Setup required (one-time):
 *   1. In Vercel dashboard → Storage → create a Blob store.
 *   2. Set BLOB_READ_WRITE_TOKEN in project env vars.
 *   3. Redeploy.
 *
 * If the env var is missing this endpoint returns 503 — the admin form will then
 * fall back to letting the staff paste a URL manually into the same field.
 */
export async function POST(req: NextRequest) {
  try {
    await requireMod()

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error: 'Vercel Blob not configured',
          hint: 'Set BLOB_READ_WRITE_TOKEN in your environment. For now you can paste a public URL into the form instead.',
        },
        { status: 503 },
      )
    }

    const form = await req.formData()
    const file = form.get('file')
    const folder = (form.get('folder') as string | null) ?? 'misc'
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file field is required' }, { status: 400 })
    }

    // Path: <folder>/<unix-ts>-<sanitised-name>
    const ts = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const blobPath = `${folder}/${ts}-${safeName}`

    const blob = await put(blobPath, file, {
      access: 'public',
      contentType: file.type || undefined,
    })

    return NextResponse.json({ url: blob.url, size: file.size, name: file.name })
  } catch (e) {
    if (e instanceof Response) return e
    console.error('Upload error:', e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
