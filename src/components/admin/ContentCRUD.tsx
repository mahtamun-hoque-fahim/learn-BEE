'use client'

import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/design/icons'

export type FieldType =
  | { type: 'text'; label: string; key: string; placeholder?: string; required?: boolean }
  | { type: 'textarea'; label: string; key: string; placeholder?: string }
  | { type: 'number'; label: string; key: string; placeholder?: string }
  | { type: 'select'; label: string; key: string; options: readonly string[] }
  | { type: 'boolean'; label: string; key: string }
  | { type: 'file'; label: string; key: string; folder: string; accept?: string }
  | { type: 'color'; label: string; key: string }

export interface ContentCRUDProps {
  collection: 'lectures' | 'labs' | 'papers' | 'books'
  title: string
  description: string
  fields: FieldType[]
  /** Columns shown in the list view */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listColumns: Array<{ key: string; label: string; render?: (item: any) => React.ReactNode }>
  initial?: Record<string, unknown>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Item = Record<string, any> & { id: string }

export default function ContentCRUD({ collection, title, description, fields, listColumns, initial }: ContentCRUDProps) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Item | null>(null)
  const [creating, setCreating] = useState(false)

  // Fetch list
  const refresh = async () => {
    setLoading(true)
    setError(null)
    try {
      const r = await fetch(`/api/admin/${collection}`)
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const data = await r.json()
      setItems(data[collection] ?? [])
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [collection]) // eslint-disable-line react-hooks/exhaustive-deps

  const startCreate = () => {
    setEditing({ id: '', ...(initial ?? {}) } as Item)
    setCreating(true)
  }

  const startEdit = (item: Item) => {
    setEditing({ ...item })
    setCreating(false)
  }

  const cancelEdit = () => {
    setEditing(null)
    setCreating(false)
  }

  const onSave = async () => {
    if (!editing) return
    try {
      const method = creating ? 'POST' : 'PATCH'
      // For PATCH we include `id`; for POST we don't (the server creates one).
      // Splitting these avoids the TS 'id specified twice' warning.
      const body = creating ? editing : { ...editing, id: editing.id }
      const r = await fetch(`/api/admin/${collection}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!r.ok) {
        const j = await r.json().catch(() => null)
        throw new Error(j?.error ?? `HTTP ${r.status}`)
      }
      cancelEdit()
      await refresh()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const onDelete = async (id: string) => {
    if (!confirm('Delete this item? This cannot be undone.')) return
    try {
      const r = await fetch(`/api/admin/${collection}?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      await refresh()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 30, letterSpacing: '-0.02em', marginBottom: 6 }}>
            {title}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 600 }}>{description}</p>
        </div>
        <button onClick={startCreate} className="btn-primary" style={{ padding: '10px 16px', fontSize: 13 }}>
          <Icon name="spark" size={13} /> Add new
        </button>
      </header>

      {error && (
        <div style={{
          padding: 12, borderRadius: 10,
          background: 'color-mix(in oklab, var(--danger) 10%, transparent)',
          border: '1px solid color-mix(in oklab, var(--danger) 30%, transparent)',
          color: 'var(--danger)', fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {/* Editor form (modal-ish inline) */}
      {editing && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14,
          padding: 20, display: 'grid', gap: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 18 }}>
              {creating ? 'New item' : 'Edit item'}
            </h2>
            <button
              onClick={cancelEdit}
              style={{ background: 'transparent', border: 0, color: 'var(--muted)' }}
              aria-label="Close"
            >
              <Icon name="close" size={16} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
          }}>
            {fields.map(f => (
              <FieldEditor
                key={f.key}
                field={f}
                value={editing[f.key]}
                onChange={v => setEditing({ ...editing, [f.key]: v })}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <button onClick={cancelEdit} className="btn-ghost" style={{ padding: '9px 14px', fontSize: 13 }}>
              Cancel
            </button>
            <button onClick={onSave} className="btn-primary" style={{ padding: '9px 14px', fontSize: 13 }}>
              {creating ? 'Create' : 'Save changes'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', border: '1px dashed var(--line)', borderRadius: 14 }}>
          No items yet. Click <span className="mono">Add new</span> above to create one.
        </div>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `${listColumns.map(() => '1fr').join(' ')} auto`,
            gap: 12,
            padding: '12px 16px',
            background: 'var(--bg)',
            borderBottom: '1px solid var(--line)',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--muted)',
            fontFamily: 'var(--mono)',
          }}>
            {listColumns.map(c => <div key={c.key}>{c.label}</div>)}
            <div style={{ width: 80 }}>Actions</div>
          </div>
          {items.map((item, i) => (
            <div key={item.id} style={{
              display: 'grid',
              gridTemplateColumns: `${listColumns.map(() => '1fr').join(' ')} auto`,
              gap: 12, padding: '12px 16px', alignItems: 'center',
              borderBottom: i === items.length - 1 ? 'none' : '1px solid var(--line)',
              fontSize: 14,
            }}>
              {listColumns.map(c => (
                <div key={c.key} style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.render ? c.render(item) : String(item[c.key] ?? '')}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => startEdit(item)}
                  style={{
                    padding: '6px 10px', fontSize: 12, borderRadius: 8,
                    border: '1px solid var(--line)', background: 'var(--bg)', color: 'var(--ink-2)',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  style={{
                    padding: '6px 10px', fontSize: 12, borderRadius: 8,
                    border: '1px solid color-mix(in oklab, var(--danger) 30%, transparent)',
                    background: 'var(--bg)',
                    color: 'var(--danger)',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FieldEditor({
  field, value, onChange,
}: {
  field: FieldType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (v: any) => void
}) {
  const baseLabel = (
    <label style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'block' }}>
      {field.label}
    </label>
  )

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 10px',
    background: 'var(--bg)', border: '1px solid var(--line)',
    borderRadius: 8, fontSize: 14, color: 'var(--ink)',
    outline: 'none',
  }

  if (field.type === 'text') {
    return (
      <div>
        {baseLabel}
        <input
          type="text"
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          style={inputStyle}
        />
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <div style={{ gridColumn: '1 / -1' }}>
        {baseLabel}
        <textarea
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          style={{ ...inputStyle, fontFamily: 'inherit' }}
        />
      </div>
    )
  }

  if (field.type === 'number') {
    return (
      <div>
        {baseLabel}
        <input
          type="number"
          value={value ?? ''}
          onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
          placeholder={field.placeholder}
          style={inputStyle}
        />
      </div>
    )
  }

  if (field.type === 'select') {
    return (
      <div>
        {baseLabel}
        <select value={value ?? field.options[0]} onChange={e => onChange(e.target.value)} style={inputStyle}>
          {field.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    )
  }

  if (field.type === 'boolean') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 20 }}>
        <input
          type="checkbox"
          checked={!!value}
          onChange={e => onChange(e.target.checked)}
          style={{ accentColor: 'var(--accent)', width: 18, height: 18 }}
        />
        <span style={{ fontSize: 14 }}>{field.label}</span>
      </div>
    )
  }

  if (field.type === 'color') {
    return (
      <div>
        {baseLabel}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="color"
            value={value ?? '#1F3A5F'}
            onChange={e => onChange(e.target.value)}
            style={{ width: 44, height: 36, border: '1px solid var(--line)', borderRadius: 8, padding: 2, background: 'var(--bg)' }}
          />
          <input
            type="text"
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            placeholder="var(--on-mint)"
            style={{ ...inputStyle, fontFamily: 'var(--mono)' }}
          />
        </div>
      </div>
    )
  }

  if (field.type === 'file') {
    return <FileField field={field} value={value} onChange={onChange} />
  }

  return null
}

function FileField({
  field, value, onChange,
}: {
  field: Extract<FieldType, { type: 'file' }>
  value: string | null
  onChange: (v: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const onPick = async (file: File) => {
    setUploading(true)
    setUploadError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', field.folder)
      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const j = await r.json()
      if (!r.ok) {
        // 503 = Vercel Blob not configured — let user paste URL manually
        setUploadError(j.hint ?? j.error ?? `HTTP ${r.status}`)
        return
      }
      onChange(j.url)
    } catch (e) {
      setUploadError((e as Error).message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={{
        fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)',
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'block',
      }}>
        {field.label}
      </label>

      <div style={{
        display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center',
        padding: 10, background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 10,
      }}>
        <input
          ref={inputRef}
          type="file"
          accept={field.accept}
          onChange={e => {
            const f = e.target.files?.[0]
            if (f) onPick(f)
          }}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-ghost"
          style={{ padding: '8px 12px', fontSize: 12 }}
        >
          <Icon name="download" size={12} />
          {uploading ? 'Uploading…' : 'Upload file'}
        </button>
        <input
          type="text"
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder="…or paste a public URL"
          style={{
            flex: 1, minWidth: 200, padding: '8px 10px',
            background: 'transparent', border: '1px solid var(--line)', borderRadius: 8,
            fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--ink)', outline: 'none',
          }}
        />
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 12px', borderRadius: 8, fontSize: 12,
              background: 'var(--surface)', color: 'var(--ink-2)', border: '1px solid var(--line)',
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}
          >
            <Icon name="external" size={11} /> Open
          </a>
        )}
      </div>
      {uploadError && (
        <div style={{ fontSize: 12, color: 'var(--warn)', marginTop: 6 }}>
          {uploadError}
        </div>
      )}
    </div>
  )
}
