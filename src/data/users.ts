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

    if (!user) {
        return {
            code: StatusCodes.NotFound,
            data: 'User not found! Please make sure you have entered a valid ID.',
        }
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

export function updateUser(newUser: Partial<User>): UserResponse {
    if (!newUser.id || !uuidValidate(newUser.id)) {
        return {
            code: StatusCodes.BadRequest,
            data: 'Invalid ID! Please check the input value and try again.',
        }
    }
    const idx = users.findIndex((user) => user.id == newUser.id)
    if (idx < 0) {
        return {
            code: StatusCodes.NotFound,
            data: 'User not found! Please make sure you have entered a valid ID.',
        }
    }

    if (Object.keys(newUser).some(key => !['id', 'username', 'age', 'hobbies'].includes(key))) {
        return {
            code: StatusCodes.BadRequest,
            data: 'Invalid field! Only username, age, and hobbies are allowed for update.',
        }
    }

    if (newUser.username){
        if (typeof newUser.username === 'string') {
            users[idx].username = newUser.username
        } else {
            return {
                code: StatusCodes.BadRequest,
                data: 'Invalid username! Please provide a valid string value for username.'
            }
        }
    }

    if (newUser.age){
        if (typeof newUser.age === 'number') {
            users[idx].age = newUser.age
        } else {
            return {
                code: StatusCodes.BadRequest,
                data: 'Invalid age! Please provide a valid number value for age.',
            }
        }
    }

    if (newUser.hobbies){
        if (newUser.hobbies instanceof Array && newUser.hobbies.every((hobby) => typeof hobby === 'string')) {
            if (newUser.hobbies.length) users[idx].hobbies = newUser.hobbies
        } else {
            return {
                code: StatusCodes.BadRequest,
                data: 'Invalid hobbies! Please provide a valid array of strings for hobbies.',
            }
        }
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

    if (idx < 0) {
        return {
            code: StatusCodes.NotFound,
            data: 'User not found! Please make sure you have entered a valid ID.',
        }
    }

    const user = users[idx]
    users.splice(idx, 1)
    return { code: StatusCodes.NoContent, data: user }
}
