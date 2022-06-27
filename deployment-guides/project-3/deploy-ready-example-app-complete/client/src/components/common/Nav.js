import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Nav() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { pathname } = useLocation()

  const handleMenuToggle = () => {
    setIsOpen(!isOpen)
  }

  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return  (
    <nav className="navbar is-dark">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            <span role="img" aria-label="logo" className="title">🎬</span>
          </Link>
          <span onClick={handleMenuToggle} className={`navbar-burger ${isOpen ? 'is-active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
        <div className={`navbar-menu ${isOpen ? 'is-active' : ''}`}>
          <div className="navbar-start">
            <Link to="/movies" className="navbar-item">Movies</Link>
            {/* <Link to="/movies/new" className="navbar-item">Add a new Movie</Link> */}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav

