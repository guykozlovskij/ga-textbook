# AJAX with React

There are a few different ways of making AJAX requests with React:

- **[Vanilla JavaScript](http://mdn.beonex.com/en/DOM/XMLHttpRequest/Using_XMLHttpRequest.html)**: light but very long-winded!
- **[fetch](https://github.github.io/fetch/)**: an AJAX library that is in-built in Chrome and Firefox, which may become a part of HTML spec soon
- **[axios](https://github.com/mzabriskie/axios)**: promise-based AJAX requests

Ultimately it's up to you, but its worth noting that React does not have its own in-built AJAX library.

The two most popular options for making AJAX request with React are Fetch and Axios. Here's a quick summary of both of them:

## `fetch`

`fetch()` allows you to make network requests similar to JavaScript's `XMLHttpRequest`. The main difference is that Fetch uses _promises_, which creates a simpler and cleaner syntax, avoiding callback hell and having to remember the complexities of `XMLHttpRequest`.

We don't need to install the Fetch API as it is in-built in Chrome and Firefox.

| Pros | Cons |
|:-----|:-----|
| Native to Chrome and Firefox | Clunky syntax |
| No installation | Can only handle strings so requires the developer to use `JSON.stringify` before sending data |
| Will likely become standard in all browsers | Two-stage process to get the JSON payload in the response |
| Uses promises | &nbsp; |

#### Example GET request

```js
const getCheeses = async () => {
  try {
    let res = await fetch('api/cheeses')
    let data = await res.json()
    console.log(data)
  } catch (err) {
    console.log(err)
  }
}
```


## `axios`

Like Fetch, Axios is a promise-based HTTP client that works both in the browser and in a Node.js environment.

There are some benefits of using Axios over Fetch. It has a syntax that is slightly simpler - we don't need the first `.then()` block that turns the response into JSON, and we don't need to _stringify_ data before sending it as part of a POST request. However as a standalone 3rd-party package it does require installation.

| Pros | Cons |
|:-----|:-----|
| Has a familiar jQuery-esq syntax | Requires installation |
| Simple to use | &nbsp; |
| Lightweight compared to jQuery | &nbsp; |

#### Example GET request

```js
const getCheeses = async () => {
  try {
    let res = await axios.get('/api/cheeses')
    console.log(res.data)
  } catch (err) {
    console.log(err)
  }
}
```

#### Example POST request

```js
const createCheeses = async () => {
  try {
    let res = await axios.post('/api/cheeses', cheese)
    console.log(res.data)
  } catch (err) {
    console.log(err)
  }
}
```


## When to use AJAX in a React app

If you want to load data when the component renders, you should use the `useEffect` lifecycle hook:

```js
function Cats() {
  const [cats, setCats] = React.useState([])

  React.useEffect(() => {
    const getCats = async () => {
      const cats = axios.get('/api/cats')
      setCats(cats.data)
    }
    getCats()
  }, [])

  return <SomeJSX />
}
```


