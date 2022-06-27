# Token Authentication

Django and Django REST Framework come with a number of authentication systems in-built. Unfortunately for us their token are not JSON Web Token (JWT), so we have two options, create our own JWT authentication middleware, or change the way we manage tokens in our client side React app. As the token authentication works well on your React apps, let's go for the custom django middleware options

```
python manage.py startapp jwt_auth
```

## JWT middleware

First off, we'll need to install a JWT library, so using _pipenv_ install _pyjwt_:

```
pipenv install pyjwt
```


Now create a file called `authentication.py` and add the following code:

```py
from rest_framework.authentication import BasicAuthentication
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from django.conf import settings # for the secret key
import jwt
User = get_user_model()

class JWTAuthentication(BasicAuthentication):
    def authenticate(self, request):
        header = request.headers.get('Authorization')
        if not header:
            return None
        if not header.startswith('Bearer'):
            raise PermissionDenied({'message': 'Invalid authorization header'})
        token = header.replace('Bearer ', '')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user = User.objects.get(pk=payload.get('sub'))
        except jwt.exceptions.InvalidTokenError:
            raise PermissionDenied({'message': 'Invalid Token'})
        except User.DoesNotExist:
            raise PermissionDenied({'message': 'User not found'})
        return (user, token)
```

This should look familiar to you, it is basically the same as the `secureRoute` middleware we wrote for the Express module.

We check for a `Authorization` header. If there isn't one, we return `None`, which means the user continues as an unauthorised user, they will not be able to perform any authorised actions.

If there is a header, but it does not start with `Bearer` we throw a `PermissionDenied` error, which will in tern return a 403 response with the message _Invalid Authorization header_.

If the header is good, we extract the token from it by removing the `Bearer ` portion of the string, then we decode the token, which gives us back the payload, including the `sub` or user's ID. We use this to get the user from the database

If the token is invalid or the user does not exist, again we return a 403 response with a useful message.

All being well we return a tuple containing what DRF should store as `request.user`, and `request.auth`. We pass the `user` as the first element, and `token` as the second. If we want access to the current user we can get it with `request.user`, and if we want access to the token, it's `request.auth`.


## Adding out custom authenticate method to the project

With that created we hook it into the project in the project folder's `settings.py` file. Add the following to the file:

```py
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'jwt_auth.authentication.JWTAuthentication',
    ],
}
```

> **Note**: replace <app-name> with the name of your app. We would recommend you create a specific app for this, so that it could be reused in future projects.

We've added our `JWTAuthentication` class to the project's default authentication classes, which means it will use our custom middleware. We've also added the `JSONRenderer` class to the default render classes. This will allow DRF to convert dictionaries to JSON, useful for sending custom messages in our views.

## Custom user serializer

Django comes with its own user model baked in. This is the same user model that you use when you log in to the admin site.

We need to create our own serializer that will check the `password` and `password_confirmation` fields match. It will also need to hash the password.

Create a `serializers.py` file if you don't have one already, and add the following:

```py
from rest_framework import serializers
from django.contrib.auth import get_user_model
import django.contrib.auth.password_validation as validations
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    def validate(self, data):

        password = data.pop('password')
        password_confirmation = data.pop('password_confirmation')

        if password != password_confirmation:
            raise serializers.ValidationError({'password_confirmation': 'Passwords do not match'})

        try:
            validations.validate_password(password=password)
        except ValidationError as err:
            raise serializers.ValidationError({'password': err.messages})

        data['password'] = make_password(password)
        return data

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirmation',)
```

This should look fairly straightforward. We take the `password` and `password_confirmation` fields and check that they match. If not we send a validation error to the user.

We then use Django's built in `validate_password` method that checks the strength of the password. This is the same method used when creating a super user in the terminal. It ensures that passwords aren't too weak.

> **Note**: We could skip this step, which might be desirable to make manual testing easier. However it's a neat feature that requires little effort on our part.

Finally we hash the password using Django's in-built `make_password` function, and we store it back on the data object. This will become the `serializer.data` property and will ultimately get stored in the database.

## Register and login views

We need some custom views for handling register and login. In the app's `views.py` file add the following:

```py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from django.conf import settings
import jwt
from .serializers import UserSerializer
User = get_user_model()

class RegisterView(APIView):

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Registration successful'})

        return Response(serializer.errors, status=422)


class LoginView(APIView):

    def get_user(self, email):
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            raise PermissionDenied({'message': 'Invalid credentials'})

    def post(self, request):

        email = request.data.get('email')
        password = request.data.get('password')

        user = self.get_user(email)
        if not user.check_password(password):
            raise PermissionDenied({'message': 'Invalid credentials'})

        token = jwt.encode({'sub': user.id}, settings.SECRET_KEY, algorithm='HS256')
        return Response({'token': token, 'message': f'Welcome back {user.username}!'})
```

Again, this should be fairly self explanatory. The register view simply creates a new user and sends back a success message if all is well, and any errors if not. These errors might include the custom errors we just added to the `UserSerializer`.

The login view finds the user by email and verifies their password with Django's `check_password` function that's automatically added to the user object. If there's an error, we send back an error message, otherwise we create a token and send it back to the client in the response.


## Further reading

- [PyJWT Docs](https://pyjwt.readthedocs.io/en/latest/)
- [Authentication - Django REST Framework Docs](https://www.django-rest-framework.org/api-guide/authentication/)
