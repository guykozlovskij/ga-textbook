![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Preparing a MERN App for Deployment on Heroku

Make sure you have worked through the guide 'mongo-atlas.md' before following these steps.

The aim of this guide is to prepare the app for deployment to Heroku, to do this we need to run (frontend and backend) from the same port (the backend one). As it stands we run them separately, this is great for development, it allows us access to lots of benefits like hot reloading and being able to test changes quickly, but this is not that state it will be deployed in.

## Frontend
* Navigate to the client directory and run the terminal command `yarn build`. This will have  compile your frontend source code and generate a “build” directory inside the frontend folder.

## Backend
* In the root, add the “dotenv”  package, this will allow our application to read values from a `.env`  file.

* To your your `config/environment.js` file, update the variables like the following.

```js
import dotenv from ‘dotenv’
dotenv.config()

export const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/<name-of-your-db>'
export const port = process.env.PORT || 4000
export const secret = process.env.SECRET || 'shhhh its a secret'
```

* The updated declarations ensure that the code uses the values on the left hand side of the `||` (or) operator when the app is deployed online, and these are supplied when setting up your app on Heroku later. If the app is running in development mode, it will use the values on the right hand side as normal.

* In the root create a `.env`  file, `touch .env` and add values for the following.

```
PORT=4000
SECRET=myappsecret
MONGODB_URI=mongodb+srv://YOUR_MONGO_ATLAS_USERNAME:YOUR_MONGO_ATLAS_PASSWORD@cluster0.1mdpo.mongodb.net/NAME_OF_YOUR_DB?retryWrites=true&w=majority
```

* Take care when adding the `MONGOD_DB` section above, the majority of this should have been provided to you when following the steps to set up your Mongo Atlas Instance, ensure you have add your own correct values over the placeholders in the example above.

 * To test if this has worked, attempt to run your database seed command, likely `yarn seed` . If this fails, check your connection string is correct. You can also check if this has worked in the Mongo Atlas console.  Navigate to the “collections” tab of your cluster and you should be able to see your data. We have essentially transferred your database to a cloud instance, that it can now be deployed with.

* The app now needs to be prepared to serve a built React app, update `index.js` to be like the following. See the commented lines for the additions (bear in mind your may not be identical to mine, read the comments to work out where you need to add things)

```js
import express from ‘express’
import { port } from './config/environment.js’
import connectToDatabase from ‘./lib/connectToDb.js’
import logger from ‘./lib/logger.js’
import router from ‘./config/router.js’
import errorHandler from ‘./lib/errorHandler.js’
import path from ‘path’ // * <—- a new import from node


const app = express()

const __dirname = path.resolve() // * this line has been added, note this has a double underscore before it

async function startServer() {
  try {
    await connectToDatabase()

    console.log(‘🤖 Database has connected’)

    app.use(express.static(`${__dirname}/client/build`)) // * <— This line has been added before the express json middleware, it will allow the app to respond to a request with contents of this directory “build”, which will contain our React App code.

    app.use(express.json())

    app.use(logger)

    app.use(‘/api’, router)

    app.use('/*', (_, res) => res.sendFile(`${__dirname}/client/build/index.html`)) // * <— This additional route handler has been added between the router and error handler middleware, it means that any incoming request that does not match a route in router should respond back with our frontend.

    app.use(errorHandler)

    app.listen(port, () => console.log(`🤖 Up and running on port ${port}`))
  } catch (err) {
    console.log(‘🤖 Something went wrong starting the App’)
    console.log(err)
  }
}

startServer()

```


* Test that the app is working correctly by running  `yarn dev` from the backend only, and navigating in your browser to `localhost:theportnumberofyourbackend`. You should see your frontend being served to the browser. Test the app the ensure things are working.

* Finally make this addition to the `scripts` section of the root  `package.json`. Again yours may look slightly different.

```json
"scripts": {
    "seed": "node db/seeds.js",
	  "dev": "npx nodemon",
    "start": "node index.js", // <-- this line has been updated to remove the command for nodemon
    "build": "cd client && yarn && yarn build" // <-- this line has been added, don't forget to put a comma at the end of the line above!
  },
```

* Finally, run `yarn start` and do one more test, you should find the frontend being correctly served on the same port as the backend in a browser now.


