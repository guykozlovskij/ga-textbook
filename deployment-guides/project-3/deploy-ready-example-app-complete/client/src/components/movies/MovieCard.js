import React from 'react'
import { Link } from 'react-router-dom'

function MovieCard({  _id, title, poster, year }) {
  return (
    <div className="column is-one-quarter-desktop is-one-third-tablet">
      <Link to={`/movies/${_id}`}>
        <div className="card">
          <div className="card-header">
            <div className="card-header-title">{title}</div>
          </div>
          <div className="card-image">
            <figure className="image image-is-1by1">
              <img src={poster} alt={title}/>
            </figure>
          </div>
          <div className="card-header">
            <div className="card-header-title">{year}</div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default MovieCard
