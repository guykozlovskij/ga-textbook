import React from 'react'
import { useParams } from 'react-router-dom'
import { getSingleMovie } from '../../lib/api'

function MovieShow() {
  const [movie, setMovie] = React.useState(null)
  const [hasError, setHasError] = React.useState(false)
  const { id } = useParams()

  React.useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getSingleMovie(id)
        setMovie(data)
      } catch (err) {
        setHasError(true)
      }
    }
    getData()
  }, [id])

  return (
    <section className="section">
      <div className="container">
        {movie ?
          <div>
            <h2 className="title has-text-centered">{movie.title} - {movie.year}</h2>
            <hr />
            <div className="columns">
              <div className="column is-half">
                <figure className="image">
                  <img src={movie.poster} alt={movie.title}/>
                </figure>
              </div>
              <div className="column is-half">
                <h4 className="title is-4">Plot Description</h4>
                <p>{movie.plotDescription}</p>
                <hr />
                <h4 className="title is-4">Starring</h4>
                {movie.starring.map((star, i) => <p key={i}>{star}</p>)}
                <hr />
                <h4 className="title is-4">Quote</h4>
                <p><em>&quot;{movie.quote}&quot;</em></p>
              </div>
            </div>
          </div>
          :
          <h2 className="title has-text-centered">
            {hasError ? 'Oh something went wrong, the sadness 😞' : '...loading 🎬'}
          </h2>
        }
      </div>
    </section>
  )
}

export default MovieShow
