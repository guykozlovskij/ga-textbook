# Adding React

## 1. Set Up
In order to add React to our Django project, we'll add a new react-app called _frontend_ and install the basic dependencies we will need:

```
$ npx create-react-app frontend
$ cd frontend
$ yarn add react-router-dom axios
$ yarn start
```

Open up localhost:3000 and check that everything is up and running as expected. If we were to make a request now we would get a CORS (cross-origin) error. Let's fix that!

<br />
<br />

## 2. Fix the CORS error 

In the ```project > settings.py``` add 'corsheaders' in your installed apps:

```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]
```

and replace your middleware with this:

```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware'
]
```

And add this to the end of your file:

```python
CORS_ORIGIN_ALLOW_ALL = True
```

Finally, run these commands and check that your app is still working as it should:

```
$ pipenv shell
$ pipenv install django-cors-headers
$ python manage.py runserver
```

<br />
<br />

## 3. Deal with the csrf issue

In order to interact with Django, the request's headers need to include a X-CSRF-TOKEN. Create ```src/lib/headers.js``` inside of frontend and add in this code:

```javascript
import Cookies from 'js-cookie'
const csrftoken = Cookies.get('csrftoken')
import { getToken } from '../auth.js'

// when you send a request that does not need to be authenticated with the jwt token, 
// only send the headers.common object, otherwise send the full headers object 

export const headers = {
  common: {
    'X-CSRF-TOKEN': csrftoken
  },
  headers: { Authorization: `Bearer ${getToken()}` }
}
```

Make sure to install the js-cookie dependency: 

```
$ yarn add js-cookie
```

<br />
<br />


## 4. Manually set up a proxy 

Normally we would do this in the webpack but because create-react-app hides their webpack we have to set up the proxy manually. 

In frontend run:

```
$ yarn add http-proxy-middleware
$ yarn start
```

In ```frontend/src```, create a new file called ```setupProxy.js``` and add this code inside:

```javascript
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(createProxyMiddleware("/api", { target: "http://localhost:8000" }))
}
```

<br />

At this point, make sure to kill both your servers, start the both again and you should see the response! 



