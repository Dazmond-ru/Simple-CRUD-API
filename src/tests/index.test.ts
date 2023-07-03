import { server } from '../index'
import request from 'supertest'

const URL = '/api/users'

describe('GET', () => {
  afterEach(() => {
    server.close()
  })

  test('should return empty array', async () => {
    const response = await request(server).get(URL)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([])
  })

  test('should return code 404', async () => {
    const response = await request(server).get(URL + 'kkk')
    expect(response.statusCode).toBe(404)
  })
})
