![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Deploying a MERN App to Heroku# Deploying a MERN App to Heroku

Make sure you have followed the “Creating a Heroku Account” and “Preparing a MERN App for Deployment on Heroku” before following this guide.

* Run all of the commands from the *root directory* of  the project.

* Login to Heroku through the Heroku CLI   `heroku login`

* Create a new Heroku project, replacing project name with one of your choice `heroku create —-region=eu project-name` *ensure there is a double dash before region*

* You will need to add your environment variables to Heroku through the terminal, at minimal this would be your backend PORT, MONGODB_URI and SECRET values, an example for setting the port would look like this:  `heroku config:set PORT=4000`. The casing of the variables here is import. Setting the database would be would be  `heroku config:set MONGODB_URI=connection String from .env`

* You will need to do the same for any env variables used in your Frontend, for example, if your used Mapbox, and you refer to your Mapbox token in the frontend as `process.env.REACT_APP_MAPBOX_TOKEN` *note yours may have been different, this is an example* you would set this into Heroku like so  `heroku config:set REACT_APP_MAPBOX_TOKEN=mytokenvaluehere`

* You can check all of your set environment variables by running the command `heroku config`  and should get an output that looks something like this .
```bash
=== sei-3-test Config Vars
MONGODB_URI:            mongodb://heroku_825rmnpr:ehe8i1d871jv4tqp49lbvqh1i0@ds235078.mlab.com:35078/heroku_825rmnpr
PORT:                   4000
REACT_APP_MAPBOX_TOKEN: mytokenvalue
SECRET:                 jgoirejfoijeriof
```

* You can now *add* and *commit*, and attempt a deployment with `git push heroku main`

* If the deployment does not produce and error, test with `heroku open`. This should open your browser at your website.
