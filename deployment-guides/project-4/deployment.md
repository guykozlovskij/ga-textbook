![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Deploying a Django/React App to Heroku
* Ensure you have followed and tested Preparing a Django App for Deployment, and created an account with Heroku before following these steps.
* Your project should be have git initialized at this point also, *if you have not*, run `git init`

### Set Up Heroku App

Run the following commands from the project root

* `heroku login`  - This will log you into the Heroku command line tools

* `heroku create --region=eu project-name` - replace project name with a name of your choosing, Heroku will let you know if it is currently available (custom domains can be configured later from the Heroku dashboard)

* `heroku buildpacks:add heroku/python` - This tell Heroku we will be using Python

* `heroku addons:create heroku-postgresql:hobby-dev` - This will create a Postgres database instance in the cloud for the app to use, “hobby-dev” part refers to the payment tier which is free.

### Configure Django For Heroku

* In the root of your project, create a new file called “Procfile” `touch Procfile`

* Add the following code to that file

```
web: python manage.py runserver 0.0.0.0:$PORT --noreload
```


* From the root `pipenv install django-on-heroku` - install the Django-Heroku package.


* Add the following to `project/settings.py`
```python

import django_on_heroku # put this at the top of the file

# all the rest of the settings file...

django_on_heroku.settings(locals()) # put this last

```


* *If you worked in a team*, add, commit and checkout to the master branch `gco master` and merge all code into it from development `git merge development`

* Add and commit your code from the root `git add . && git commit -m"ready to deploy"`

* `git push heroku master` - Push your application to Heroku to be deployed.

* If you get an application error when navigating to the site, in the root run `heroku logs --tail`

* If the deployment was successful (you can see the site, but things may not be working)  you need to run the migrations, and any seeds eg:
```
heroku run python manage.py migrate
heroku run python manage.py loaddata books/seeds.json
```
