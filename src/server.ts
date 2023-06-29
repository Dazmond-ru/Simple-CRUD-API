import * as dotenv from 'dotenv'
import http from 'http'
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  UserResponse,
  User,
} from './data/users'

dotenv.config()

const port = Number(process.env.PORT)
const USERS_URL = '/api/users/'
const USERS_URL_SHORT = '/api/users'

enum method {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
  delete = 'DELETE',
}

const server = http.createServer()

server.on('request', async (req, res) => {
  console.log(`Connecting: ${req.method} ${req.url}`)

  res.setHeader('Content-Type', 'application/json')
  const { method: reqMethod, url: reqUrl } = req

  if (
    reqMethod === method.get &&
    (reqUrl === USERS_URL || reqUrl === USERS_URL_SHORT)
  ) {
    const resData = getAllUsers()

    return writeToResponse(res, resData)
  } else if (reqMethod === method.get && reqUrl?.startsWith(USERS_URL)) {
    const id = reqUrl.substring(USERS_URL.length)
    const resData = getUser(id)

    return writeToResponse(res, resData)
  } else if (reqMethod === method.post && reqUrl?.startsWith(USERS_URL)) {
    const user = await readRequestBody<User>(req)
    const resData = addUser(user)

    return writeToResponse(res, resData)
  } else if (reqMethod === method.put && reqUrl?.startsWith(USERS_URL)) {
    const id = reqUrl.substring(USERS_URL.length)
    const user = await readRequestBody<Partial<User>>(req)
    const resData = updateUser({ ...user, id })

    return writeToResponse(res, resData)
  } else if (reqMethod === method.delete && reqUrl?.startsWith(USERS_URL)) {
    const id = reqUrl.substring(USERS_URL.length)
    const resData = deleteUser(id)
    
    return writeToResponse(res, resData)
  } else {
    return writeErrorResponse(
      res,
      'Failed to load resource: Not Found! :(',
      404
    )
  }
})

async function readRequestBody<T>(req: http.IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => {
      try {
        const parsedData = JSON.parse(body) as T
        resolve(parsedData)
      } catch (error) {
        reject(error)
      }
    })
  })
}

function writeErrorResponse(
  res: http.ServerResponse<http.IncomingMessage>,
  message: string,
  code: number
) {
  res.statusCode = code
  res.setHeader('Content-Type', 'text/plain')
  res.write(message)
  res.end()
}

function writeToResponse(
  res: http.ServerResponse<http.IncomingMessage>,
  data: UserResponse
) {
  res.statusCode = data.code
  if (data.code.toString()[0] === '2') {
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify(data.data))
  } else {
    res.setHeader('Content-Type', 'text/plain')
    res.write(data.data)
  }
  res.end()
}

server.listen(port, () => {
  console.log(`Listening port ${port}`)
})
