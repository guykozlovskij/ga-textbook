# Preparing a Django App for Deployment.

The aim of this guide is to prepare the app for deployment to Heroku, to do this we need to run (frontend and backend) from the same port (the backend one). As it stands we run them separately, this is great for development, it allows us access to lots of benefits like hot reloading and being able to test changes quickly, but this is not that state it will be deployed in. 

### Frontend

* Make sure your files/folders are correctly cased within your app, folders are lowered cased eg `components` . Check that all import statements have the correct casing, this will cause errors in deployment if they are not matching.

* Make sure all urls in requests end in a trailing `/` regardless of verb. So a GET request should be for example `axios.get('/api/pokes/)` the trailing slash at the end of `pokes/` will be required. 

* Go to the file `client/.gitignore` and replace it with the following 

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

* Making sure you are inside `client` in the terminal, run the following

		* If you used NPM for your project,  `npm run build`

		* if you used YARN,  `yarn build`

### Backend

* In the project root, install the Python .env package `pipenv install python-dotenv`  and another to configure our database on heroku `pipenv install dj-database-url`

* Navigate to `project/settings.py`

* To the top of the file, replace any current imports with the following the following

```python
import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url
load_dotenv()
```

* Find the key  `SECRET_KEY` and replace with the following *NOTE THERE ARE PLACEHOLDER VALUES BELOW REPLACE WITH YOUR OWN*:

```python

if str(os.getenv('ENVIRONMENT')) == 'development':
    SECRET_KEY = 'whateveryourdevelopmentsecretleyvaluewas' # should be whatever your original key was
else:
    SECRET_KEY = str(os.getenv('SECRET_KEY'))

```

* Find the key  `TEMPLATES` in this file and completely replace what is there with the following 

```python
TEMPLATES = [
    {
        'BACKEND': 
'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, ‘client')
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

* Find the key `DATABASES` and replace with the following *NOTE THERE ARE PLACEHOLDER VALUES BELOW REPLACE WITH YOUR OWN*:

```python
DATABASES = {}
if str(os.getenv('ENVIRONMENT')) == 'development':
    DATABASES['default'] =  {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'name-of-your-db', # < --- make sure you chage this
        'HOST': 'localhost',
        'PORT': 5432
    }
else:
    DATABASES['default'] = dj_database_url.config(conn_max_age=600, ssl_require=True)
```

* Still in  `project/settings.py`  add the following to the bottom of the file 

```python
ROOT_URLCONF = 'project.urls' #check if you have this already, if not add it in

STATIC_URL = '/static/' # same with this

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, ‘client’, "build", "static"), 
)

```

* In the root of your project,  create a file `.env` and add the following:

```
ENVIRONMENT=development
```

* Create a file inside the project directory called  `views.py`

* To the new `project/views.py` file add the following. 

```python
from django.shortcuts import render

def index(request):
    return render(request, 'build/index.html')
```

* Now update the `project/urls.py` to add the following. 

```python
from django.contrib import admin
from django.urls import path, include, re_path # <-- added this new import re_path
from .views import index # <-- also new

urlpatterns = [
    #...your other views,
    re_path(r'^.*$', index) # <-- have this come last using re path.
]

```

* Run the command to run the server `python manage.py runserver`  navigate to `localhost:8000` you should see your frontend working there. Test everything is working at this point before moving on. 

* Please see this finished example `settings.py` file,  *DO NOT JUST COPY AND PASTE THIS EXAMPLE, IT CONTAINS PLACEHOLDER VALUES, PLEASE REFERENCE AGAINST YOUR OWN*

```python
import os
from pathlib import Path
import django_heroku
from dotenv import load_dotenv
import dj_database_url
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
if str(os.getenv('ENVIRONMENT')) == 'development':
    SECRET_KEY = 'mysecreykeydev'
else:
    SECRET_KEY = str(os.getenv('SECRET_KEY'))

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'pokemon',
    'comments',
    'poketypes',
    'jwt_auth'
]

AUTH_USER_MODEL = 'jwt_auth.User'

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, ‘client')],
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

WSGI_APPLICATION = 'project.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases
DATABASES = {}
if str(os.getenv('ENVIRONMENT')) == 'development':
    DATABASES['default'] =  {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'poke-django',
        'HOST': 'localhost',
        'PORT': 5432
    }
else:
    DATABASES['default'] = dj_database_url.config(conn_max_age=600, ssl_require=True)


# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

REST_FRAMEWORK = {  # added this to get rest framework to use our custom authentication classes
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'jwt_auth.authentication.JWTAuthentication'
    ],
}

ROOT_URLCONF = 'project.urls' #check if you have this already, if not add it in

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, ‘client’, "build", "static"),
)

```
