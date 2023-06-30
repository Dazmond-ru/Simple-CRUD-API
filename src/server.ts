import http from 'http'
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from './data/users'
import { Methods, StatusCodes, User, UserResponse } from './types'

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

export const webServer = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  try {
    console.log(`Method: ${req.method} Url: ${req.url}`)

    res.setHeader('Content-Type', 'application/json')
    const { method: reqMethod, url: reqUrl } = req

    if (reqMethod === Methods.get && reqUrl === USERS_URL) {
      //* Get All Users
      const resData = getAllUsers()

      writeToResponse(res, resData)
    } else if (
      reqMethod === Methods.get &&
      reqUrl?.startsWith(USER_DETAILS_URL)
    ) {
      //* Get One User
      const id = reqUrl.substring(USER_DETAILS_URL.length)
      const resData = getUser(id)

      writeToResponse(res, resData)
    } else if (reqMethod === Methods.post && reqUrl === USERS_URL) {
      //* Create New User
      let body: string = ''
      req.on('data', (chunk) => (body += chunk))
      req.on('end', () => {
        const resData = addUser(JSON.parse(body))
        writeToResponse(res, resData)
      })
    } else if (
      reqMethod === Methods.put &&
      reqUrl?.startsWith(USER_DETAILS_URL)
    ) {
      //* Update User
      let body: string = ''
      req.on('data', (chunk) => (body += chunk))
      req.on('end', () => {
        const id = req.url?.substring(USER_DETAILS_URL.length)
        const user = JSON.parse(body) as Partial<User>
        user.id = id
        const resData = updateUser(user)
        writeToResponse(res, resData)
      })
    } else if (
      reqMethod === Methods.delete &&
      reqUrl?.startsWith(USER_DETAILS_URL)
    ) {
      //* Delete User
      const id = reqUrl.substring(USER_DETAILS_URL.length)
      const resData = deleteUser(id)

      writeToResponse(res, resData)
    } else {
      //* Error Request
      const msg = 'Oops! The resource you are looking for could not be found.'
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
}
