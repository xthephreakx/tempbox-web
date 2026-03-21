import express from 'express'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const DATA_DIR = join(__dirname, 'data')
const DATA_FILE = join(DATA_DIR, 'users.json')

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

app.use(express.json())
app.use(express.static(join(__dirname, 'dist')))

app.get('/api/users', (_req, res) => {
  try {
    if (!existsSync(DATA_FILE)) return res.json({ users: [] })
    res.json(JSON.parse(readFileSync(DATA_FILE, 'utf8')))
  } catch {
    res.json({ users: [] })
  }
})

app.put('/api/users', (req, res) => {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2))
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// SPA fallback
app.get('*path', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`TempBox running on port ${PORT}`))
