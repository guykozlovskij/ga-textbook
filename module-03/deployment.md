# Deploying a MERN stack app on Heroku

> **Note**: MERN stands for Mongo, Express, React and Node

Heroku is a web hosting platform and deployment pipeline that uses git. It is free in the most part, but does have usage bands, so if your site is receiving a lot of traffic you may be charged.

## Setting up Heroku

1. First sign up to [Heroku](https://heroku.com)

  You should set your language to _Node.js_ and your position to _student_. You do not have to supply a company name.

1. You should now [download the Heroku toolbelt](https://devcenter.heroku.com/articles/heroku-cli#download-and-install), which is a command line tool for deployment. Follow the instructions for installation with _Homebrew_.

1. Once the CLI has installed, you need to log in to heroku in the terminal:

  ```sh
  heroku login
  ```

  A browser window will open, allowing you to log in. Once you have logged in via the browser, you should see a success message **in the terminal**.

1. Navigate to the root of your MERN stack project. This should be a git repo. If not, you need to initialise it with `git init`

1. Ceate a Heroku app with the following command:

  ```sh
  heroku create --region=eu project-name
  ```

  > **Note** replace `project-name` with the name of your project. This will become part of the website's URL.

## Adding a database

If you are using a database for your app, you will also need to create a Mongo database instance on heroku.

1. Add a credit/debit card to your Heroku account. _Don't worry, you will not be charged, unless you have large volumes of traffic to your site._

1. In the terminal create a Mongo instance for your Heroku app:

  ```sh
  heroku addons:create mongolab
  ```

This will be variable will be automatically added to your heroku config. Ensure your `enviroment.js` is set up to use this file. Eg.

```js
const dbURI = process.env.MONGODB_URI || 'http://....your local database'
```

  > **Note:** Replace `project-name` with the name of your database. You must use `MONGODB_URI` for this to work on Heroku


## Setting up your app for deployment

1. Add your environment variables to the app using the following heroku cli command, for example to set the port:

  ```sh
 heroku config:set PORT=4000
  ```
  
  Don't forget to add the secret and any other API keys. 
  
  You can check what variables and values you have set by typing

  ```js
  heroku config
  ```

  Update your port number to use `process.env.PORT` in `index.js` if it is not already. *Note* Your port may be definfed in your environemt.js file, if so change it there.:

  ```js
  app.listen(process.env.PORT, () => console.log(`Running on port ${process.env.PORT}`))
  ```

1. Add a `start` script to your `package.json`, this will be used by Heroku to launch your app:

  ```json
  "scripts": {
    "serve": "webpack-dev-server --mode=development",
    "build": "webpack -p",
    "start": "node index"
  }
  ```

1. Build your React app

  ```sh
  yarn run build
  ```

1. Test your app locally by running `yarn start`, then navigating to `http://localhost:4000`. Fix any bugs or issues.

1. Commit your code

  ```sh
  git add . && git commit -m "Ready for deployment"
  ```

1. Deploy to Heroku

  ```sh
  git push heroku master
  ```

If any of your files in the src/components folder are not capitalized the build will fail - so make sure you check before pushing to heroku! 

1. Once your code has finished deploying, open your app with `heroku open`

1. If you get an Application Error, check the logs on heroku with `heroku logs --tail`

If this happens, start from checking your config/environment.js file and your webpack.config.js for spelling mistakes.

## Seeding your mongolab database

After deploying, you need to seed the database that you created in Heroku. 

```sh
 heroku run node db/seeds.js
 ```

