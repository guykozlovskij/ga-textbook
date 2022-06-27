# Token Authentication

## What is token authentication?

With an API we can generate a token which is passed between the client and the server. Think of it like a train ticket. When the client authenticates she receives a unique token with her user ID encoded in to it. Whenever the client makes a request she sends the token along with the request in an Authorization header. This is then checked by the server before sending back any data.

The Authorization header can be one of several options, the most common being `Basic` or `Bearer`. Since we are using tokens, we should use the `Bearer` type. Our header should look something like this:

```
Authorization: Bearer <token>
```

## JSON Web Tokens

The technology we will be using is JWT (pronounced 'jot'), which stands for **JSON Web Token**. It allows us to embed JSON into an encrypted token.

A JWT consists of three parts:

- **Header**: which contains information about the token, encryption method etc
- **Payload**: which contains any data that we want to store in the token (most commonly the user's ID)
- **Signature**: which contains the header and payload encrypted with a secret. The secret is stored on the server and is used to generate the token. If a token's signature cannot be decrypted using the correct secret it is deemed to be invalid, and the user is refused access to the requested resource.

A typical JWT might look like this:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o
```

You can see each section delineated by a period `.`.

## Usage

It is fairly straight forward to create a JWT using a node library. My preferred one is jsonwebtoken which can be installed with yarn:

```sh
yarn add jsonwebtoken
```

### Creating a token

The syntax for creating a JWT is as follows:

```js
import jwt from 'jsonwebtoken'

// `sub` means subject, ie the subject of the token, and usually contains the user's ID
const payload = { sub: 1526 }
const secret = 'shhhh!'
const options = { expiresIn: '1hr' }

const token = jwt.sign(payload, secret, options)
```

### Verifying a token

Token verification simple:

```js
const token = jwt.verify(token, secret)
```


## Adding JWT to a login route

To incorporate a JWT into the authentication flow of our APIs, we can create a JWT in our login (and register) controller and send it to the client when they successfully authenticate:

```js
import User from '../models/user.js'
import { unauthorized } from '../lib/errorHandler.js'
import jwt from 'jsonwebtoken'
import { secret } from '../config/environment.js'

async function loginUser(req, res, next) {
  try {
    const userToLogin = await User.findOne({ email: req.body.email })
    if (!userToLogin || !userToLogin.validatePassword(req.body.password)) {
      throw new Error(unauthorized)
    }
    const token = jwt.sign({ sub: userToLogin._id }, secret, { expiresIn: '7 days' })
    return res.status(202).json({ message: `Welcome back ${userToLogin.username}`, token })
  } catch (err) {
    next(err)
  }
}
```

## Checking for a token

In order check for a token when the client makes a request, we need to verify the token in our `secureRoute`:

```js
import jwt from 'jsonwebtoken'
import { secret } from '../config/environment.js'
import User from '../models/user.js'

export default async function secureRoute(req, res, next) {
  try {
    if (!req.headers.authorization) {
      throw new Error('Missing Required Header')
    }

    const token = req.headers.authorization.replace('Bearer ', '')
    const payload = jwt.verify(token, secret)
    const userToVerify = await User.findById(payload.sub)

    if (!userToVerify) {
      throw new Error('User not Found')
    }

    next()
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', detail: err.message })
  }
}
```

## Testing

Now that the authentication flow has been completed it we can test that everything is working using Insomnia.

Make a request to a secured route, you should receive a 401 response:

![](https://user-images.githubusercontent.com/3531085/37476299-af82b422-286c-11e8-9f37-fdc66c782028.png)

Now login, you should receive a token in the response:

![](https://user-images.githubusercontent.com/3531085/37476179-6921ea98-286c-11e8-9ad9-cdedb4c94c9b.png)

In the **Header** tab of Insomnia add the Authorization header with the token you received in the previous response:

![](https://user-images.githubusercontent.com/3531085/37476683-b0d6da00-286d-11e8-928a-a87bcedc1c02.png)

You should now be able to make an authenticated request:

![](https://user-images.githubusercontent.com/3531085/37476685-b2ec1116-286d-11e8-9b91-2120b932a26f.png)

## Further reading

- [JSON Web Tokens](https://jwt.io/)
- [Cookies vs Tokens: The Definitive Guide](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)
- [jsonwebtoken Docs](https://github.com/auth0/node-jsonwebtoken)
