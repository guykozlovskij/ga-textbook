import axios from 'axios'

const baseUrl = '/api'

export function getAllMovies() {
  return axios.get(`${baseUrl}/films`)
}

export function getSingleMovie(id) {
  return axios.get(`${baseUrl}/films/${id}`)
}

export function createMovie(formdata) {
  return axios.post(`${baseUrl}/films`, formdata)
}
