import { v4, validate } from 'uuid'

export interface User {
  id: string
  username: string
  age: number
  hobbies: string[]
}

export interface UserResponse {
  code: number
  data: User | User[] | string
}

const users: User[] = []

export function getAllUsers(): UserResponse {
  return {
    code: 200,
    data: users,
  }
}

export function getUser(id: string): UserResponse {
  if (!validate(id)) {
    return { code: 400, data: 'Invalid ID! Please check input value.' }
  }
  const user = users.find((user) => user.id == id)
  if (!user) return { code: 404, data: 'Error: User not found!' }
  return { code: 200, data: user }
}

export function addUser(user: Partial<User>): UserResponse {
  user.id = v4()
  if (!user.username || !user.username.trim() || !user.age) {
    return { code: 400, data: 'Invalid input! Please check input value.' }
  }
  if (!user.hobbies) user.hobbies = []
  users.push(user as User)
  return { code: 201, data: user as User }
}

export function updateUser(user: Partial<User>): UserResponse {
  if (!user.id || !validate(user.id)) {
    return { code: 400, data: 'Invalid ID! Please check input value.' }
  }
  const i = users.findIndex((_user) => _user.id == user.id)
  if (i < 0) return { code: 404, data: 'Error: User not found!' }
  if (user.username) users[i].username = user.username
  if (user.age) users[i].age = user.age
  if (user.hobbies) users[i].hobbies = user.hobbies
  return { code: 200, data: users[i] }
}

export function deleteUser(id: string): UserResponse {
  if (!validate(id)) {
    return { code: 400, data: 'Invalid ID! Please check input value.' }
  }
  const i = users.findIndex((user) => user.id == id)
  if (i < 0) return { code: 404, data: 'Error: User not found!' }
  const user = users[i]
  users.splice(i, 1)
  return { code: 200, data: user }
}
