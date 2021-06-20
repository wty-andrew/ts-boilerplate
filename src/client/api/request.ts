import axios from 'axios'

import { BASE_URL } from '../config'

const request = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  validateStatus: (status) => status < 500,
})
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (axios.isAxiosError(error) && !error.response) {
      throw new Error(error.message) // Network Error
    }
    throw new Error('Failed to send request')
  }
)

export default request
