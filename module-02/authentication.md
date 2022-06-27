# Authentication with React

We are going to look at how to implement authentication with React when consuming an API that uses _JSON Web Tokens_.

If the API receives a `POST` request to `/api/register`, a new user will be created in the database. If it receives a `POST` request to `/api/login` with correct credentials, a JWT token is sent back as part of the response.

We will store that JWT token in _local storage_, and then send it back as part of any request that is secured, eg. _CREATE_, _UPDATE_ and _DELETE_ routes.

We will also look at hiding and showing buttons/links depending on whether or not the user is logged in, and redirecting the user if they attempt to access protected areas of the site, for example the _NEW_ and _EDIT_ pages which would display forms to create and update resources respectively.

### Register

A typical register form submit handler might look something like this:

```js
const handleSubmit = async event => {
    event.preventDefault()

    try {
      await registerUser(formdata)
      history.push('/login')
    } catch (err) {
      console.log(err.response.data)
    }
  }
```

When the register form is submitted, a `POST` request is made using `axios`. Once it is complete, the user is redirected to the login page.

### Login

A typical register form submit handler might look something like this:

```js
  const handleSubmit = async event => {
    event.preventDefault()

    try {
      const { data } = await loginUser(formdata)
      history.push('/')
    } catch (err) {
      console.log(err)
    }
  }
```

We are using `axios` to make an AJAX request to the API, and sending in the form data (the user's email and password). Inside the `try` block we are redirecting the user to the homepage by pushing `/` into the history. Let's break this function on to two lines, and console log the response.

```js
  const handleSubmit = async event => {
    event.preventDefault()

    try {
      const { data } = await loginUser(formdata)
      console.log(data)
      history.push('/')
    } catch (err) {
      console.log(err)
    }
  }
```

When you submit the login form you should see a token come back as part of the response in the Chrome console. We need to store this token in _local storage_ to be used later.

## `auth` Helpers

We can create a class which can be used to handle storing and retrieving tokens to and from _local storage_. We can also add extra functionality to validate tokens, and helper methods to determine whether a user is logged in (has a token), or not.

Here is an implementation of such a class:

```js
export function setToken(token) {
  window.localStorage.setItem('token', token)
}

export function getToken() {
  return window.localStorage.getItem('token')
}

export function logout() {
  return window.localStorage.removeItem('token')
}

function getPayload() {
  const token = getToken()
  if (!token) return false
  const parts = token.split('.')
  if (parts.length < 3) return false
  return JSON.parse(atob(parts[1]))
}

export function isAuthenticated() {
  const payload = getPayload()
  const now = Math.round(Date.now() / 1000)
  return now < payload.exp
}

```

There are 5 methods here:

* `setToken` will take a token and add it to _local storage_
* `getToken` will retrieve a token from _local storage_
* `logout` will clear _local storage_ of a token, essentially logging a user out
* `getPayload` will return the `payload` portion of the token as an object
* `isAuthenticated` will return `true` is there is a valid token in _local storage_ and `false` otherwise

We can now use the `setToken()` function to store the token that is returned from the API.

```js
const handleSubmit = async event => {
    event.preventDefault()

    try {
      const { data } = await loginUser(formdata)
      setToken(data.token)
      history.push('/')
    } catch (err) {
      console.log(err)
    }
  }
```

### Sending the token in a header

The _CREATE_, _UPDATE_ and _DELETE_ routes are protected in our API, so we will need to send the token as a header, with the key of `Authorization`, and a value of `Bearer TOKEN-FROM-LOCAL-STORAGE-HERE`.

Here's a typical form submit handler for creating a new resource, in this case `cheese`:

```js
const handleSubmit = async event => {
  event.preventDefault()

  try {
    const { data } = await createCheese(formdata)
    history.push(`/cheeses/${data._id}`)
  } catch (err) {
    console.log(err)
  }
}
```

The edit form submit handler would be very similar:

```js
const handleSubmit = async event => {
  event.preventDefault()

  try {
    const { data } = await editCheese(id, formdata)
    history.push(`/cheeses/${data._id}`)
  } catch (err) {
    console.log(err)
  }
}
```

Ditto the delete button:

```js
const deleteCheese = async () => {

  try {
    await deleteCheese(id)
    history.push('/')
  } catch (err) {
    console.log(err)
  }
}
```

