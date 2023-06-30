import http from 'http'
import { webServer } from './server'

const mainPort = Number(process.env.PORT) || 5000

export const server = http.createServer(webServer)

server.listen(mainPort, 'localhost', () => {
  console.log(`Server is started! Listening on port ${mainPort}`)
})
server.on('connection', (socket) =>
  console.log(`Connecting in port: ${socket.localPort}`)
)
