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

  const isCorrectHobbies =
    user.hobbies instanceof Array &&
    (user.hobbies.length === 0 ||
      user.hobbies.every((hobby) => typeof hobby === 'string'))

  if (
    !(typeof user.username === 'string') ||
    !user.username.trim() ||
    !(typeof user.age === 'number') ||
    !isCorrectHobbies
  ) {
    return {
      code: StatusCodes.BadRequest,
      data: 'Invalid input! Please make sure you have provided a valid username, age and hobbies.',
    }
  }
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
  const idx = users.findIndex((_user) => _user.id == user.id)
  if (idx < 0)
    return {
      code: StatusCodes.NotFound,
      data: 'User not found! Please make sure you have entered a valid ID.',
    }
  if (typeof user.username == 'string') users[idx].username = user.username
  if (typeof user.age == 'number') users[idx].age = user.age
  if (user.hobbies instanceof Array) {
    user.hobbies.forEach((hobby) => {
      if (!user.hobbies.includes(hobby)) users[idx].hobbies.push(hobby)
    })
  }
  return { code: StatusCodes.OK, data: users[idx] }
}

export function deleteUser(id: string): UserResponse {
  if (!uuidValidate(id)) {
    return {
      code: StatusCodes.BadRequest,
      data: 'Invalid ID! Please check the input value and try again.',
    }
  }
  const idx = users.findIndex((user) => user.id == id)
  if (idx < 0)
    return {
      code: StatusCodes.NotFound,
      data: 'User not found! Please make sure you have entered a valid ID.',
    }
  const user = users[idx]
  users.splice(idx, 1)
  return { code: StatusCodes.NoContent, data: user }
}
