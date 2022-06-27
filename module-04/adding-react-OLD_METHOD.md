# Adding React

In order to add React to our Django project, we'll add a new app called _frontend_:

```
python manage.py startapp frontend
```

This will be a very simple app, responsible for serving the `index.html` and `bundle.js` files of the React app.

The app will just need a couple of views, so we can delete everything in the `frontend` folder **except**:

```
├── __init__.py
├── apps.py
├── urls.py
└── views.py
```

In addition to these folders we can create our `src` folder, where all the React files will live.

## Views

You will need two views for this app: one for serving the `index.html`, the other will serve any static files like, the `bundle.js` file, stylesheets, images, fonts etc.

```py
import os
from django.views.generic import View
from django.http import HttpResponse, HttpResponseNotFound

class Home(View):

    def get(self, _request):
        with open(os.path.join(os.path.dirname(__file__), 'dist', 'index.html')) as file:
            return HttpResponse(file.read())


class Assets(View):

    def get(self, _request, filename):
        path = os.path.join(os.path.dirname(__file__), 'dist', filename)

        if os.path.isfile(path):
            with open(path, 'rb') as file:
                return HttpResponse(file.read())
        else:
            return HttpResponseNotFound()
```

The `Home` view, opens the `index.html` file located in the `dist` folder and sends it back to the client.

The `Assets` view attempts to find the requested file in the `dist` folder. If found it will send it back to the client, if not a 404 response will be sent.

We now need to hook the views up to the URLs for the frontend app:

```py
from django.urls import path, re_path
from .views import Home, Assets

urlpatterns = [
    path('', Home.as_view(), name='home'),
    re_path(r'^(?P<filename>[\w\.]+)$', Assets.as_view(), name='assets'),
]
```

The `re_path` uses regex to match the path to the assets view. It is looking for a string that includes a period, so for example `bundle` would not match the assets view, but `bundle.js` would.

Finally we also need to hook the app up to the project. Add it to the installed apps in the project's `settings.py`:

```py
INSTALLED_APPS = [
    ... # other apps
    'frontend',
    ... # your main app
]
```

Then add the frontend URLs to the project's URLs:

```py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    ... # other URLs
    path('', include('frontend.urls'))
]
```

## Adding webpack

**In the your project's root folder**, you need to create a `package.json`:

```
yarn add
```

You can now add all the required node modules for React. For more info, checkout the [Webpack notes](../appendix-01/webpack.md)

With that done, add your `webpack.config.js` file. Again you need to do this **in the project's root folder**.

The `webpack.config.js` will need to point to the `frontend/src` folder, which is different from the last module. Here's an updated version:

```js
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/app.js',
  context: path.resolve(__dirname, 'frontend'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'frontend/dist')
  },
  devtool: 'source-maps',
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, loader: ['style-loader', 'css-loader'] },
      { test: /\.s(a|c)ss$/, loader: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.woff2?$/, loader: 'file-loader' },
      { test: /\.(jpg|png|gif)$/, loader: 'file-loader' }
    ]
  },
  devServer: {
    contentBase: 'src',
    hot: true,
    open: true,
    port: 8000,
    watchContentBase: true,
    proxy: {
      '/api': 'http://localhost:4000'
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      inject: 'body'
    })
  ]
}
```

Don't forget to also add the `.babelrc` file **in the project's root folder**.

## Running the app

In the `package.json` add the following scripts:

```json
"scripts": {
  "build": "webpack -p",
  "serve:backend": "python manage.py runserver 4000",
  "serve:frontend": "webpack-dev-server"
},
```

You should now open two tabs in your terminal, one for the Django API, and one for the React app. **Make sure that you are running _pipenv shell_ on the backend tab**.

On the backend tab, start the Django app running on port 4000 with:

```
yarn serve:backend
```

On the frontend tab, start the webpack dev server running on port 8000 with:

```
yarn serve:frontend
```

The browser should open automatically and load the React app.
