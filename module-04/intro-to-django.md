# Intro to Django

Django is a Web Framework based on the MVC design pattern. It's similar to Express in that it is designed to create web applications (and APIs), however it writes a lot of code for you.

Rather than starting with an empty project like we do with Express, we can ask Django to create the files and folders we need, and in most cases write the code that wires it all up. This means we spend more time writing business logic, and less time writing boilerplate code.

This is a common style of server-side framework, most languages have one or more of these. Here are some examples:

- Python: Django
- Ruby: Ruby on Rails
- PHP: Laravel, Symfony
- Node: Feathers, Sails

## Setup

Let's create our first Djano app!

Create a new folder and `cd` into it

```
mkdir my_first_django_app
cd my_first_django_app
```

We could use _pip_ to install Django at this point, but we want to ensure that we only install Djano for this project. To do that we are going to use _pipenv_. _pipenv_ is the same as _pip_ except it installs packages for a single project only. It also creates a `Pipfile` which is the same as the `package.json` for Node projects.

Let's install _pipenv_ with _pip_!

```
pip install pipenv
```

Finally we can use _pipenv_ to install Django:

```
pipenv install django
```

_pipenv_ has created a virtual environment for us that has all the packages that we have installed **for this project only**. To activate the virtual environment we first need to run:

```
pipenv shell
```

You should see that this has updated your terminal like so:

```
(my_first_django_app) ➜  my_first_django_app
```

Now that we have activated the virtual environment, we can use the version of Django that we just installed. Django will create the files and folders we need fo a new project if we run the following code:

```
django-admin startproject project .
```

> **Note** the `.` at the end of the command. This creates a new project in the existing folder

This should have created the following files and folders in the current directory:

```
├── Pipfile
├── Pipfile.lock
├── manage.py
└── project
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    └── wsgi.py
```

To start the app we can run the command:

```
python manage.py runserver
```

The first time you run this command you will get the following error:

```
You have 17 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions.
Run 'python manage.py migrate' to apply them.
```

Django need to add some tables and data to a database before you can use it. Luckily the error message tells us how to do that:

```
python manage.py migrate
```

You should see the following output:

```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying admin.0002_logentry_remove_auto_add... OK
  Applying admin.0003_logentry_add_action_flag_choices... OK
  Applying contenttypes.0002_remove_content_type_name... OK
  Applying auth.0002_alter_permission_name_max_length... OK
  Applying auth.0003_alter_user_email_max_length... OK
  Applying auth.0004_alter_user_username_opts... OK
  Applying auth.0005_alter_user_last_login_null... OK
  Applying auth.0006_require_contenttypes_0002... OK
  Applying auth.0007_alter_validators_add_error_messages... OK
  Applying auth.0008_alter_user_username_max_length... OK
  Applying auth.0009_alter_user_last_name_max_length... OK
  Applying auth.0010_alter_group_name_max_length... OK
  Applying auth.0011_update_proxy_permissions... OK
  Applying sessions.0001_initial... OK
```

As things stand, we have not created a database for this app. Instead by default Django will use _sqlite3_ which will create a database in a file called `db.sqlite3` in your project folder.

While this is not ideal for a production app, it's fine for now.

Start the server again:

```
python manage.py runserver
```

Navigate to `http://localhost:8000` and you should see the following screen:

![Django Homepage](https://media.git.generalassemb.ly/user/15120/files/66841700-c8d6-11e9-95fb-cb98c2e0108a)

Congratulations, you have created your first Django app! 🚀


## File structure

Django is structured in an interesting way. It has a main project folder (which we have named `project`, but it could be called anything). This folder contains all the project wide URLs and settings, including things like the database configuration, and timezone. It also comes with a built-in CMS when the user can directly add, update and delete database records, an email service, and pre made authentication.

Currently there are four files in the `project` folder:

- `__init__.py`: An empty _magic_ file which turns the folder into a module
- `settings.py`: Contains site-wide settings like database config, timezones etc.
- `urls.py`: This is the project wide router
- `wsgi.py`: This is config for WSGI used to ensure Dango apps can run across a range of web servers (_we will not be using this on the course_)


## The admin app

Django comes with a whole admin user section to the site pre-built. To log in we first need to create a user, which we can do like so:

```
python manage.py createsuperuser
```

This will run through the setting up a super user, a user that has access to the admin section of the site, and one that can make changes to the database contents.

You can choose anything here, but we would recommend the following:

```
Username: admin
Email: admin@ga.co
Password: admin
Password (again): admin
Bypass password validation and create user anyway? [y/N]: y
```

You should now be able to log in to the admin section of the site by navigating to http://localhost:8000/admin/

![Django Admin Dashboard](https://media.git.generalassemb.ly/user/15120/files/5e7fa380-c8e5-11e9-83e2-1db09ddad88a)

Here you can add new users, and groups: collections of users that have the same permissions.

We'll be looking at this again later in the module, but for now, let's log out.

## Conclusion

We have barely scratched the surface, but you should now have a guide to creating a new Django project, and have seen how the main project folder to set up, along with some of the naming conventions of a Django project.

## Further reading

- [Getting Started - Django](https://www.djangoproject.com/start/)
