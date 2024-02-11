import { server } from '../index'
import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import { StatusCodes } from '../types'

const BASE_URL = '/api/users'

const mockUser = {
    username: 'Peter Parker',
    age: 16,
    hobbies: ['wallcrawling', 'web-spinning'],
}

describe('Scenario 1 - Getting endpoint data', () => {
    it('Get all users', async () => {
        const res = await request(server).get(BASE_URL)

        expect(res.status).toBe(200)
        expect(res.body).toEqual([])
    })

    it('Get user by id', async () => {
        const res = await request(server).post(BASE_URL).send(mockUser)

        const targetId = res.body.id
        const responseWithTargetUser = await request(server).get(
            `${BASE_URL}/${targetId}`
        )

        expect(responseWithTargetUser.status).toBe(200)
        expect(responseWithTargetUser.body).toEqual({
            id: targetId,
            ...mockUser,
        })
    })

    it('Create new user', async () => {
        const response = await request(server).post(BASE_URL).send(mockUser)

        expect(response.status).toBe(201)
        expect(response.body).toEqual({
            id: response.body.id,
            ...mockUser,
        })
    })

    it('Update new user', async () => {
        const res = await request(server).post(BASE_URL).send(mockUser)
        const postedUser = res.body
        const newUserData = {
            username: 'Tony Stark',
            age: 38,
            hobbies: ['engineering', 'inventing', 'flying in suit'],
        }

        const responseWithUpdatedUser = await request(server)
            .put(`${BASE_URL}/${postedUser.id}`)
            .send(newUserData)

        expect(responseWithUpdatedUser.status).toBe(200)
        expect(responseWithUpdatedUser.body).toEqual({
            id: postedUser.id,
            ...newUserData,
        })
    })

    it('Delete user', async () => {
        const res = await request(server).post(BASE_URL).send(mockUser)

        const postedUserId = res.body.id

        const responseByUserDeleting = await request(server).delete(
            `${BASE_URL}/${postedUserId}`
        )

        expect(responseByUserDeleting.status).toBe(204)
    })
})

describe('Scenario 2 - Endpoints error testing', () => {
    it('Invalid endpoint', async () => {
        const response = await request(server).get('/api/member')

        expect(response.status).toBe(StatusCodes.NotFound)
        expect(response.text).toBe(
            'Oops! The resource you are looking for could not be found.'
        )
    })

    it('Unavailable method', async () => {
        const response = await request(server).patch(BASE_URL)

        expect(response.status).toBe(StatusCodes.NotFound)
        expect(response.text).toBe(
            'Oops! The resource you are looking for could not be found.'
        )
    })

    it('Updating a non-existent user', async () => {
        const id = uuidv4()
        const response = await request(server)
            .put(`${BASE_URL}/${id}`)
            .send(mockUser)

        expect(response.status).toBe(StatusCodes.NotFound)
        expect(response.text).toBe(
            'User not found! Please make sure you have entered a valid ID.'
        )
    })

    it('Deleting a non-existent id', async () => {
        const id = uuidv4()
        const response = await request(server).delete(`${BASE_URL}/${id}`)

        expect(response.status).toBe(StatusCodes.NotFound)
        expect(response.text).toBe(
            'User not found! Please make sure you have entered a valid ID.'
        )
    })
})

describe('Scenario 3 - Get errors by invalid post data', () => {
    afterAll(() => {
        server.close()
    })

    it('Create user with invalid input', async () => {
        const invalidUserData = {
            username: 'Superman',
            age: 'forever young',
        }
        const response = await request(server)
            .post(BASE_URL)
            .send(invalidUserData)

        expect(response.status).toBe(StatusCodes.BadRequest)
        expect(response.text).toBe(
            'Invalid input! Please make sure you have provided a valid username, age and hobbies.'
        )
    })

    it('Put user with invalid data', async () => {
        const { body: newUser } = await request(server)
            .post(BASE_URL)
            .send(mockUser)

        const { body: currentUser } = await request(server).get(
            `${BASE_URL}/${newUser.id}`
        )

        expect(currentUser).toEqual(newUser)

        const invalidUserData = {
            name: 'Superman',
            age: 'forever young',
        }

        const response = await request(server)
            .put(`${BASE_URL}/${newUser.id}`)
            .send(invalidUserData)

        expect(response.status).toBe(StatusCodes.BadRequest)
        expect(response.text).toBe(
            'Invalid field! Only username, age, and hobbies are allowed for update.'
        )
    })
})
