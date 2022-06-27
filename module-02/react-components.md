# React Components

Everything in React is a component. When we think about creating an app in React, we first need to establish which components we need to make.

Components should be reusable. A component might be used stand-alone or as part of another larger component.

Consider this shopping cart. It is made up of 5+ components, which work together to make the app work.

![Everything in React is a component](https://s3-us-west-2.amazonaws.com/techdojo-web/blog/react+table+2.png)

## Creating a component in React

There are a couple of different ways of creating a component in React. We'll look at the most modern way, which uses the function syntax:

```js
import React from 'react'
import ReactDOM from 'react-dom'

function App() {
  return (
    <h1>Hello World</h1>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
```

As you can see a component is simply a function which defines a set of values that describes how React should handle the component's UI.

Every component should `render` something to the DOM. A component should contain all the logic that it needs inside of itself. It can then be connected to other components to build up complex applications.

You can think of it like the human body. The lungs know only how to pass oxygen to the blood and carbon dioxide to the oesophagus. The heart knows only how to pump blood around the body. Hooking them together allows the body to deliver oxygen to all the muscles.

## The data layer

Every component in a React app at some point needs to display something to the user in the form of HTML rendered to the DOM. Exactly what they display usually depends on some data.

It might be an array of birds, or a user's data in the form of an object. Whatever it is, a React component handles this data in the form of `state` or `props`.

### `state`

`state` is data that lives inside a component. We can add state to our `App` component like so:

```js
import React from 'react'
import ReactDOM from 'react-dom'

function App() {
  const [message] = React.useState('Hello World')
  return (
    <h1>{message}</h1>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
```

This component is now displaying data that is being stored on the component's `state`.

### `props`

We can pass data into a component using `props`. Let's update our `App` component to allow it to receive data through props:

```js
import React from 'react'
import ReactDOM from 'react-dom'

function App({ name }) {
  const [message] = React.useState('Hello World')
  return (
    <>
      <h1>{message}</h1>
      <h2>{name}</h2>
    </>
  )
}

export default App

// inside index.js

ReactDOM.render(
  <App name="Mike" />,
  document.getElementById('root')
)
```

We have added a `name` property to the `<App />` component in the `ReactDOM.render` method. It looks like an attribute on an HTML element eg: `<input name="Mike" />` where the attribute is `name`.

When we add an attribute to a React component, we refer to it as a `prop`, and the data can be accessed inside the component via `this.props`.

In the background React is converting the attributes on the JSX to an object:

```js
<App name="Mike" />
// identical to
new App({ name: 'Mike' })
```

When either `props` or `state` changes, React will re-render the component, updating the view.

![Changing state or props updates a react component](https://discoversdkcdn.azureedge.net/postscontent/react%20native/how%20it%20works/image5.png)

## Nesting Components

Ok, let's look at how we can now combine components to create a slightly more complex application.

We'll create two new components `Header` and `Footer` and nest them inside our `App` component.

#### Header

```js
import React from 'react'

function Header({ message, name}) {
  return (
    <header>
      <h1>{message}</h1>
      <h2>Welcome, {name}!</h2>
    </header>
  )
}

export default Header
```

We can now import it in our `src/index.js` file and nest it inside `App`:

```js
import React from 'react'
import ReactDOM from 'react-dom'

import Header from './components/Header'

function App() {
  const message = 'Hello World!' 

  return (
    <Header name="Mike" message={message}/>
  )
}

export default App
```

See how we have passed the message from our `App` component's `state` to the `Header` component via props.

#### Footer

```js
import React from 'react'

function Footer() {
  return (
    <footer>
      <p>Made with &hearts; at GA London</p>
    </footer>
  )
}

export default Footer
```

Again, let's import this in our `src/index.js` file and add it to our `App` component's `render` method:

```js
import React from 'react'

import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const message = 'Hello World!'

  return (
    <Header name="Mike" message={message} />
    <Footer />
  )
}

export default App
```

If we look at the browser we'll see an error message:

```
Error in ./src/index.js Syntax error: Adjacent JSX elements must be wrapped in an enclosing tag
```

This is the same error as we saw earlier. React is complaining because we have adjacent JSX tags, so let's wrap everything in a `main` element:

```js
function App() {
  const message = 'Hello World!'

  return (
    <main>
      <Header name="Mike" message={message} />
      <Footer />
    <main />
  )
}
```

## Further reading

* [React JS Tutorial - Nesting Components #6](https://www.youtube.com/watch?v=7VOko6eXb8s)
* [Thinking In React - ReactJS](https://reactjs.org/docs/thinking-in-react.html)
