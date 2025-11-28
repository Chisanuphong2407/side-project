import { apiClient } from './axios-client'

export default {
  searchProduct(
    search: string,
    selectCatalog: string,
    selectUnit: string,
    itemPerPage: number,
    createdAtASC: boolean,
    uid: string,
    isFavorite: boolean,
    skip: number,
  ) {
    return apiClient.get(
      `/product/search?productname=${search}&catalog=${selectCatalog}&unit=${selectUnit}&ownerID=${uid}&favorite=${isFavorite}&createdAtASC=${createdAtASC}&limit=${itemPerPage}&skip=${skip}`,
    )
  },

  addProduct(data: object) {
    return apiClient.post(`/product`, data)
  },

  editProduct(id: string, data: object) {
    // console.log(data);
    console.log('id', id)
    return apiClient.patch(`/product/${id}`, data)
  },

  deleteProduct(id: string) {
    return apiClient.delete(`/product/${id}`)
  },

  likeProduct(id: string) {
    return apiClient.patch(`/product/favorite/${id}`)
  },

  getProduct(id: string) {
    return apiClient.get(`/product/get?_id=${id}`)
  },
}
