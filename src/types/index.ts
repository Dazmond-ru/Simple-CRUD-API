export enum Methods {
    get = 'GET',
    post = 'POST',
    put = 'PUT',
    delete = 'DELETE',
}

export const enum StatusCodes {
    OK = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    NotFound = 404,
    InternalServerError = 500,
}

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
