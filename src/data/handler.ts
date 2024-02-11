import { addUser, deleteUser, getAllUsers, getUser, updateUser } from './users'
import { User, UserResponse } from '../types'

export interface MessageData {
    method: 'getAllUsers' | 'getUser' | 'addUser' | 'updateUser' | 'deleteUser'
    param: string | Array<User> | Partial<User>
}

export const messageHandler = (message: MessageData): UserResponse => {
    switch (message.method) {
        case 'getAllUsers':
            return getAllUsers()
        case 'getUser':
            return getUser(message.param as string)
        case 'addUser':
            return addUser(message.param as Partial<User>)
        case 'updateUser':
            return updateUser(message.param as Partial<User>)
        case 'deleteUser':
            return deleteUser(message.param as string)
    }
}
