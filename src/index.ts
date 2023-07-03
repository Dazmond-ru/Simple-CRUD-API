import http from 'http'
import { webServer } from './server'

const mainPort = Number(process.env.PORT) || 5000
const host = process.env.HOST || 'localhost'

export const server = http.createServer(webServer)

server.listen(mainPort, host, () => {
  console.log(`Server is started! Listening on port ${mainPort}`)
})
server.on('connection', (socket) =>
  console.log(`Connecting in port: ${socket.localPort}`)
)
