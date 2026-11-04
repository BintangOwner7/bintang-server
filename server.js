const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000

const devices = {}

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.post('/api/track', (req, res) => {
  const { id, device, ip, lat, lon } = req.body
  devices[id] = {
    id,
    device: device || 'Unknown Device',
    ip: ip || req.ip,
    lat: lat || null,
    lon: lon || null,
    lastSeen: Date.now()
  }
  res.json({ ok: true })
})

app.get('/api/devices', (req, res) => {
  const now = Date.now()
  const activeDevices = Object.values(devices).filter(d => now - d.lastSeen < 120000)
  const formatted = activeDevices.map(d => ({
    name: d.device,
    ip: d.ip,
    status: 'ONLINE',
    lat: d.lat,
    lon: d.lon
  }))
  res.json(formatted)
})

app.listen(PORT, () => console.log(`[+] BintangProject Server jalan di port ${PORT}`))
