# React Routing

React doesn't come with a router built-in so its up to you to decide how to route your app.

Your main choices are:

* Roll you own
* Use [React Router](https://reacttraining.com/react-router/)
* Use another 3rd-party router

Generally developers use React Router unless they have a good reason not to. It's well documented and there is plenty of help with it online.

## Installation

Install with npm or yarn:

```sh
yarn add react-router-dom
```

>**Note**: React Router has a separate package for React Native: `react-router-native`. Both packages are dependent on `react-router` which is installed automatically.

There are three main components that you will be using:

* `<BrowserRouter />`: the main parent component
* `<Route />`: An individual route or 'page'
* `<Link />`: A helper component for changing URL
* `<Switch />`: A helper component for managing ambiguous URLs

Import them into your project like so:

```js
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
```

## A Simple Example

>**Note**: The `Router` component has to have only one JSX element, so you always need to wrap your routes in a `<div>`.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>

        <Route path="/about" component={About} />
        <Route exact path="/" component={Home} />
      </div>
    </BrowserRouter>
  )
}


function Home() {
  return (
    <h1>Home Page</h1>
  );
}

function About() {
  return (
    <h1>About Page</h1>
  );
}

```

The `Route` component basically decides whether to display the component you pass to it depending on the URL in the address bar of the browser.

It uses a _regular expression_ matching engine, which means that `/` will match any URL that _starts with_ `/`, which is basically all of them! To get round this the `exact` prop means that the `Route` component will fall back to a more basic matching engine which _probably_ uses `===` to determine whether the URL matches the `path` specified.

## Further Reading

- [React Router v4 Docs](https://reacttraining.com/react-router/web/example/basic)
- [A Simple React Router v4 Tutorial](https://medium.com/@pshrmn/a-simple-react-router-v4-tutorial-7f23ff27adf)
