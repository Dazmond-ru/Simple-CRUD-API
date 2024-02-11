import * as dotenv from 'dotenv'
import cluster, { Worker } from 'cluster'
import http from 'http'
import { cpus } from 'os'
import { webServer } from './server'
import {messageHandler} from "./data/handler";

dotenv.config()

const mainPort = Number(process.env.PORT) || 5000
const host = process.env.HOST || 'localhost'
const numCPUs = cpus().length

if (cluster.isPrimary) {
    console.log(`Master process is started! Number of CPU cores: ${numCPUs}`)

    const workers: Worker[] = []

    for (let i = 0; i < cpus().length; i++) {
        const workerEnv = { port: (mainPort + i + 1).toString() }
        const newWorker = () => {
            const worker = cluster.fork(workerEnv);
            worker.on('message', message => {
                worker.send(messageHandler(message));
            });
            worker.on('exit', (code) => {
                if (code !== 0) {
                    workers[i] = newWorker();
                }
            });
            return worker;
        }
        const worker = newWorker();
        workers.push(worker);
    }

    let activeWorkerPort = mainPort + 1

    const mainServer = http.createServer(
        async (
            request: http.IncomingMessage,
            response: http.ServerResponse
        ) => {
            const httpRequest = http.request(
                {
                    hostname: 'localhost',
                    port: activeWorkerPort,
                    path: request.url,
                    method: request.method,
                    headers: request.headers,
                },
                (res) => {
                    const data: Array<Buffer> = []
                    res.on('data', (chunk) => {
                        data.push(chunk)
                    })
                    res.on('end', () => {
                        if (response.statusCode === 200 || response.statusCode === 201) {
                            response.setHeader('Content-type', 'application/json');
                        }
                        response.write(data.join().toString())
                        response.end()
                    })
                }
            )

            const data: Array<Buffer> = []
            request.on('data', (chunk: Buffer) => {
                data.push(chunk)
            })

            request.on('end', () => {
                if (response.statusCode === 200 || response.statusCode === 201) {
                    response.setHeader('Content-type', 'application/json');
                }
                httpRequest.write(data.join().toString())
                httpRequest.end()
            })

            activeWorkerPort =
                activeWorkerPort < mainPort + cpus().length
                    ? activeWorkerPort + 1
                    : mainPort + 1
        }
    )

    mainServer.listen(mainPort, host, () => {
        console.log(`Main server listening on port ${mainPort}`)
    })
}

if (cluster.isWorker) {
    const workerPort = parseInt(process.env.PORT || '5000') + cluster.worker!.id
    const server = http.createServer(webServer)
    server.listen(workerPort, host, () => {
        console.log(
            `Worker process is started! Listening on port ${workerPort}`
        )
    })
    server.on('connection', (socket) =>
        console.log(`Connecting in port: ${socket.localPort}`)
    )
}
