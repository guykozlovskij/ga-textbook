# Deploying a Django / React app on Heroku

Heroku is a web hosting platform and deployment pipeline that uses git. It is free in the most part, but does have usage bands, so if your site is receiving a lot of traffic you may be charged.

## Setting up Heroku

1. First sign up to [Heroku](https://heroku.com)

  You should set your language to _Node.js_ and your position to _student_. You do not have to supply a company name.

1. You should now [download the Heroku toolbelt](https://devcenter.heroku.com/articles/heroku-cli#download-and-install), which is a command line tool for deployment. Follow the instructions for installation with _Homebrew_.

1. Once the CLI has installed, you need to log in to Heroku in the terminal:

  ```sh
  heroku login
  ```

  A browser window will open, allowing you to log in. Once you have logged in via the browser, you should see a success message **in the terminal**.

1. Navigate to the root of your project. This should be a git repo. If not, you need to initialise it with `git init`

1. Ceate a Heroku app with the following command:

  ```sh
  heroku create --region=eu project-name
  ```

  > **Note** replace `project-name` with the name of your project. This will become part of the website's URL.

1. We need to add two buildpacks to this project, one for Node.js and one for the Python app. We want to build our software with webpack using Node.js first, then launch the Django app with Python second, so we need to add the build packs in that order. Run the following commands:

  ```sh
  heroku buildpacks:add heroku/nodejs
  heroku buildpacks:add heroku/python
  ```

1. To check the buildpack run `heroku buildpacks`. You should see the following output:

  ```sh
  === project-name Buildpack URLs
  1. heroku/nodejs
  2. heroku/python
  ```

### Adding a database

If you are using a database for your app, you will also need to create a Postgres database instance on Heroku.

1. Add a credit/debit card to your Heroku account. _Don't worry, you will not be charged, unless you have large volumes of traffic to your site._

1. In the terminal create a PostgreSQL instance for your Heroku app:

  ```sh
  heroku addons:create heroku-postgresql:hobby-dev
  ```

## Setting up your app for deployment

### Django app

Heroku has its own python module which will set up your app Django to connect to the database that you've just created. You'll also need to install `psycopg2-binary` as its a dependency of `django-heroku`. Install them with `pipenv`:

```sh
pipenv install psycopg2-binary django-heroku
```

> **Note**: `django-heroku` will try to install `psycopg2` which is outdated and will fail. You'll need to remove it from the `Pipfile.lock` then run `pipenv install` to ensure everything is installed correctly.

The add it into your project's settings like so:

```py
import django_heroku # put this at the top of the file

# all the rest of the setting file...

django_heroku.settings(locals()) # put this last
```

We need to add a file to instruct Heroku how to start the Django app once it's been deployed, called a `Procfile`. Create it in the root of the app and add the following:

```sh
web: python manage.py runserver 0.0.0.0:$PORT --noreload
```

### React app

1. Add a `build` script in `package.json`:

  ```json
  "scripts": {
    "build": "webpack -p",
    "serve:frontend": "webpack-dev-server",
    "serve:backend": "python manage.py runserver 4000"
  }
  ```

1. Add a `.gitignore` file in the root of your project, then add the following to it:

  ```sh
  frontend/dist
  ```

  This will prevent your `dist` folder from being stored in your repo.

1. Test your app locally by running `yarn build`, then `yarn serve:backend`. Naviagte to `http://localhost:4000`. Fix any bugs or issues.

  > **Note**: Make sure you are running `pipenv shell` when you start your backend.

1. Commit your code

  ```sh
  git add . && git commit -m "Ready for deployment"
  ```

1. Deploy to Heroku

  ```sh
  git push heroku master
  ```

1. Once your code has finished deploying, you need to run the migrations, and any fixtures:
  ```
  heroku run python manage.py migrate
  heroku run python manage.py loaddata books/fixtures.json
  ```

1. Open the app with `heroku open`

1. If you get an Application Error, check the logs on heroku with `heroku logs --tail`
