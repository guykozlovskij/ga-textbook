# Deploying a Python / Create React app on Heroku

Heroku is a web hosting platform and deployment pipeline that uses git. It is free in the most part, but does have usage bands, so if your site is receiving a lot of traffic you may be charged.
<br />

## Serve your app from one port

Navigate to the frontend directory and run ```yarn build```. This will create a build directory. **We need to ensure that the directory is not hidden from git so that we can use it in te deployment, so once your build is completed navigate to the ```.gitignore``` file inside frontend and remove ```build```.**

<br />
In the project > settings.py, replace your TEMPLATES with this: 

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'frontend')
                 ]  #Look, we have added the root folder of frontend here
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

<br />
and at the bottom of the file add the static files:

```python

ROOT_URLCONF = 'project.urls' #check if you have this already, if not add it in

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'frontend', "build", "static"), 
)
```

<br />
Create a file called views.py in project (project > views.py), we will serve our frontend view from here. Update it like so:

```python
from django.shortcuts import render

def index(request):
    return render(request, "build/index.html")
```
<br />

and update your project > urls to include the index view:

```python
from django.contrib import admin
from django.urls import path, include, re_path # <-- added this new import re_path
from .views import index

urlpatterns = [
    #...your other views,
    re_path(r'^.*$', index) # <-- have this come last using re path.
]
```
<br />

If you serve the django app and navigate to localhost:8000 you should see your frontend. Test that everything is working correctly.

<br />


## Setting up Heroku

First sign up to Heroku
You should set your language to Node.js and your position to student. You do not have to supply a company name.

You should now download the Heroku toolbelt, which is a command line tool for deployment. Follow the instructions for installation with Homebrew.

Once the CLI has installed, you need to log in to Heroku in the terminal:

```
$ heroku login
```
<br />

A browser window will open, allowing you to log in. Once you have logged in via the browser, you should see a success message in the terminal.

Navigate to the root of your project. This should be a git repo. If not, you need to initialise it with git init

Ceate a Heroku app with the following command:

```
$ heroku create --region=eu project-name
```
<br />

Note replace project-name with the name of your project. This will become part of the website's URL.

We need to add the Python buildpack to this project:

```
$ heroku buildpacks:add heroku/python
```
<br />

To check the buildpack run `heroku buildpacks`. You should see the following output:
=== project-name Buildpack URLs
1. heroku/python

<br />

## Adding a database

If you are using a database for your app, you will also need to create a Postgres database instance on Heroku.

Add a credit/debit card to your Heroku account. Don't worry, you will not be charged, unless you have large volumes of traffic to your site.

In the terminal create a PostgreSQL instance for your Heroku app, note hobby-dev refers to Heroku's free payment tier, it is not the name of the database:

```
$ heroku addons:create heroku-postgresql:hobby-dev
```
<br />


## Configure Django for Heroku

In your root folder, add a Procfile (`touch Procfile`) in the root of the project that will be used by Heroku to launch your Python app, add the following to that file (note: look at the command, similar to how we start the app from our command line):

```
web: python manage.py runserver 0.0.0.0:$PORT --noreload
```
<br />

Then, install django-heroku:

```
$ pipenv install django-heroku
```
<br />

Then add it into your project's settings like so:

```python
import django_heroku # put this at the top of the file

# all the rest of the setting file...

django_heroku.settings(locals()) # put this last
```

<br />

## Commit your code

```
$ git add . && git commit -m "Ready for deployment"
```
<br />

## Deploy to Heroku

```
$ git push heroku master
```
<br />

Once your code has finished deploying (you can see the frontend, but logging in etc will not work), open your app with heroku open

If you get an Application Error, check the logs on heroku with heroku logs --tail.

If the deployment was successful you need to run the migrations, and any seeds:

```
$ heroku run python manage.py migrate
$ heroku run python manage.py loaddata books/seeds.json
```
