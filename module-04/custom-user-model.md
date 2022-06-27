# Creating a custom user model in Django

Often we want to add custom fields to Django's user model. This might be something like adding an avatar, or potentially a relationship with another model.

Since Django uses its user model for some internal stuff (mainly authentication), we have replace it with our own model that _extends_ Django's _AbstractUser_ class.

You can create this model in any app in your project. In this example we'll use the `jwt_auth` app:

```py
from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):

    # custom fields here...
    image = models.CharField(max_length=200)
```

With this done, we need to tell Django that we want to use this model for the project's user. In `project/settings.py` add the following:

```py
AUTH_USER_MODEL = 'jwt_auth.User'
```

It's important to note that this will modify some tables in Django's auth app, which might be quite disruptive if there is already some data in the database. For this reason it's probably best to do this at the very start of the app.

If that isn't an option, it might be worth dropping your database, deleting your existing migrations, then making new migrations and running them to create all the correct fields in the database, including the new custom fields for the new custom user model.

## Further reading

- [Django Tips #6: Custom User Model - William Vincent](https://wsvincent.com/django-tips-custom-user-model/)
- [Specifying a custom user model - Django Docs](https://docs.djangoproject.com/en/2.2/topics/auth/customizing/#specifying-a-custom-user-model)
