import http from 'http'
import { Methods, StatusCodes, User, UserResponse } from './types'
import cluster from 'cluster'
import { MessageData, messageHandler } from './data/handler'

const USERS_URL = '/api/users'
const USER_DETAILS_URL = '/api/users/'

const writeToResponse = (res: http.ServerResponse, data: UserResponse) => {
    res.statusCode = data.code

    if (data.code.toString()[0] === '2') {
        res.setHeader('Content-type', 'application/json')
        res.write(JSON.stringify(data.data))
    } else {
        res.setHeader('Content-type', 'text/plain')
        res.write(data.data)
    }
    res.end()
}

const writeErrorResponse = (
    res: http.ServerResponse,
    message: string,
    code: number
) => {
    res.statusCode = code
    res.setHeader('Content-Type', 'text/plain')
    res.write(message)
    res.end()
}

const responseData = (res: http.ServerResponse, msgData: MessageData) => {
    const data = messageHandler(msgData)
    writeToResponse(res, data)
}

export const webServer = async (
    req: http.IncomingMessage,
    res: http.ServerResponse
) => {
    try {
        const { method: reqMethod, url: reqUrl } = req

        console.log(`Method: ${req.method} Url: ${req.url}`)

        res.setHeader('Content-Type', 'application/json')

        if (reqMethod === Methods.get && reqUrl === USERS_URL) {
            //* Get All Users
            const resData: MessageData = { method: 'getAllUsers', param: null }
            if (cluster.isWorker) {
                process.send(resData)
            } else {
                responseData(res, resData)
            }
        } else if (
            reqMethod === Methods.get &&
            reqUrl?.startsWith(USER_DETAILS_URL)
        ) {
            //* Get One User
            const id = reqUrl.substring(USER_DETAILS_URL.length)
            const resData: MessageData = { method: 'getUser', param: id }
            if (cluster.isWorker) {
                process.send(resData)
            } else {
                responseData(res, resData)
            }
        } else if (reqMethod === Methods.post && reqUrl === USERS_URL) {
            //* Create New User
            let body: string = ''
            req.on('data', (chunk) => (body += chunk))
            req.on('end', () => {
                try {
                    const resData: MessageData = {
                        method: 'addUser',
                        param: JSON.parse(body),
                    }
                    if (cluster.isWorker) {
                        process.send(resData)
                    } else {
                        responseData(res, resData)
                    }
                } catch (error) {
                    writeErrorResponse(
                        res,
                        'Invalid JSON format',
                        StatusCodes.BadRequest
                    )
                }
            })
        } else if (
            reqMethod === Methods.put &&
            reqUrl?.startsWith(USER_DETAILS_URL)
        ) {
            //* Update User
            let body: string = ''
            req.on('data', (chunk) => (body += chunk))
            req.on('end', () => {
                try {
                    const id = req.url?.substring(USER_DETAILS_URL.length)
                    const user = JSON.parse(body) as Partial<User>
                    user.id = id
                    const resData: MessageData = {
                        method: 'updateUser',
                        param: user,
                    }
                    if (cluster.isWorker) {
                        process.send(resData)
                    } else {
                        responseData(res, resData)
                    }
                } catch (error) {
                    writeErrorResponse(
                        res,
                        'Invalid JSON format',
                        StatusCodes.BadRequest
                    )
                }
            })
        } else if (
            reqMethod === Methods.delete &&
            reqUrl?.startsWith(USER_DETAILS_URL)
        ) {
            //* Delete User
            const id = reqUrl.substring(USER_DETAILS_URL.length)
            const resData: MessageData = { method: 'deleteUser', param: id }
            if (cluster.isWorker) {
                process.send(resData)
            } else {
                responseData(res, resData)
            }
        } else {
            //* Error Request
            const msg =
                'Oops! The resource you are looking for could not be found.'
            writeErrorResponse(res, msg, StatusCodes.NotFound)
        }
    } catch (error) {
        res.write(
            JSON.stringify({
                code: StatusCodes.InternalServerError,
                message:
                    'Sorry, an internal server error has occurred. Please try again later',
            })
        )
        res.end()
    }

    if (cluster.isWorker) {
        const data: UserResponse = await new Promise((resolve) => {
            process.on('message', (data: UserResponse) => {
                resolve(data)
            })
        })
        writeToResponse(res, data)
    }
}
