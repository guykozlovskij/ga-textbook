import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Nav from './components/common/Nav'
import Home from './components/common/Home'
import MovieIndex from './components/movies/MovieIndex'
import MovieShow from './components/movies/MovieShow'
// import MovieNew from './components/movies/MovieNew'

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Switch>
        <Route exact path="/" component={Home} />
        {/* <Route path="/movies/new" component={MovieNew}/> */}
        <Route path="/movies/:id" component={MovieShow} />
        <Route path="/movies" component={MovieIndex} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
