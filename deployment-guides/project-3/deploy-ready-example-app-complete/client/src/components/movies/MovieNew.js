/* eslint-disable no-unused-vars */
import React from 'react'
import { useHistory } from 'react-router-dom'
import useForm from '../../utils/useForm'
import { createMovie } from '../../lib/api'

import MovieForm from './MovieForm'

function MovieNew() {
  const history = useHistory()
  const { formdata, errors, handleChange, setErrors, setFormdata } = useForm({
    title: '',
    year: '',
    plotDescription: '',
    isSequel: false,
    poster: '',
    starring: [],
    quote: ''
  })

  const handleSubmit = async event => {
    event.preventDefault()
    try {
      const { data } = await createMovie(formdata)
      history.push(`/movies/${data._id}`)
    } catch (err) {
      setErrors(err.response.data.errors)
    }
  }

  return (
    <section className="section">
      <div className="container">
        <MovieForm
          formdata={formdata}
          errors={errors}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </section>
  )
}

export default MovieNew
