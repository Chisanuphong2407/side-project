import apiClient from './axios-client'

export default {
  allUnit(user: string) {
    return apiClient.get(`/unit/${user}`)
  },

  addUnit(data: object) {
    return apiClient.post(`/unit`, data)
  },
}
