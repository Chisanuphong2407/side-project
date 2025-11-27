import apiClient from './axios-client'

export default {
  allCatalog(user: string) {
    return apiClient.get(`/catalog/${user}`)
  },

  addCatalog(data: object) {
    return apiClient.post(`/catalog`, data);
  },
}
