import apiClient from './axios-client'

export default {
  userRegister(data: object) {
    return apiClient.post('/user', data)
  },
}
