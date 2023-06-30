import { v4 as uuidV4, validate as uuidValidate } from 'uuid'
import { User, UserResponse, StatusCodes } from '../types'

const users: User[] = []

export function getAllUsers(): UserResponse {
  return {
    code: StatusCodes.OK,
    data: users,
  }
}

export function getUser(id: string): UserResponse {
  if (!uuidValidate(id)) {
    return {
      code: StatusCodes.BadRequest,
      data: 'Invalid ID! Please check the input value and try again.',
    }
  }
  const user = users.find((user) => user.id == id)
  if (!user)
    return {
      code: StatusCodes.NotFound,
      data: 'User not found! Please make sure you have entered a valid ID.',
    }
  return {
    code: StatusCodes.OK,
    data: user,
  }
}

export function addUser(user: Partial<User>): UserResponse {
  user.id = uuidV4()
  if (!user.username || !user.username.trim() || !user.age) {
    return {
      code: StatusCodes.BadRequest,
      data: 'Invalid input! Please make sure you have provided a valid username and age.',
    }
  }
  if (!user.hobbies) user.hobbies = []
  users.push(user as User)
  return { code: StatusCodes.Created, data: user as User }
}

export function updateUser(user: Partial<User>): UserResponse {
  if (!user.id || !uuidValidate(user.id)) {
    return {
      code: StatusCodes.BadRequest,
      data: 'Invalid ID! Please check the input value and try again.',
    }
  }
  const i = users.findIndex((_user) => _user.id == user.id)
  if (i < 0)
    return {
      code: StatusCodes.NotFound,
      data: 'User not found! Please make sure you have entered a valid ID.',
    }
  if (user.username) users[i].username = user.username
  if (user.age) users[i].age = user.age
  if (user.hobbies) users[i].hobbies = user.hobbies
  return { code: StatusCodes.OK, data: users[i] }
}

export function deleteUser(id: string): UserResponse {
  if (!uuidValidate(id)) {
    return {
      code: StatusCodes.BadRequest,
      data: 'Invalid ID! Please check the input value and try again.',
    }
  }
  const i = users.findIndex((user) => user.id == id)
  if (i < 0)
    return {
      code: StatusCodes.NotFound,
      data: 'User not found! Please make sure you have entered a valid ID.',
    }
  const user = users[i]
  users.splice(i, 1)
  return { code: StatusCodes.NoContent, data: user }
}
