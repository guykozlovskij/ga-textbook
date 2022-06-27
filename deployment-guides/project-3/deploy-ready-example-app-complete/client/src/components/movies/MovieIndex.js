import React from 'react'
import { getAllMovies } from '../../lib/api'

import MovieCard from './MovieCard'

function MovieIndex() {
  const [movies, setMovies] = React.useState(null)
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getAllMovies()
        setMovies(data)
      } catch (err) {
        setHasError(true)
      }
    }
    getData()
  }, [])

  return (
    <section className="section">
      <div className="container">
        {movies ?
          <div className="columns is-multiline">
            {movies.map(movie => (
              <MovieCard key={movie._id} {...movie} />
            ))}
          </div>
          :
          <h2 className="title has-text-centered">
            {hasError ? 'Oh something went wrong, the sadness 😞' : '...loading 🎬 '}
          </h2>
        }
      </div>
    </section>
  )
}

export default MovieIndex
