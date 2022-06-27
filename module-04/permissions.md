# Permissions

Django REST Framework comes with some powerful built in permissions. They are very simple to use and can be added any view by passing them as a list or tuple to a `permission_classes` property.

Here's an example:

```py
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

class BookList(ListCreateAPIView):

  permission_classes = (IsAuthenticatedOrReadOnly,)

  def get(self, _request):
      books = Book.objects.all() # get all the books
      serializer = BookSerializer(books, many=True)
      return Response(serializer.data)
```

`IsAuthenticatedOrReadOnly` allows an unauthenticated user read only access eg: INDEX and SHOW, but only allows unsafe access, eg: CREATE, UPDATE and DELETE to authenticated users.

There are several permissions that come with DRF:

- `AllowAny`: This is the same as having no permissions set, but is included to show the intention of no permissions.
- `IsAuthenticated`: The user must be logged in for ALL routes (including INDEX and SHOW for example)
- `IsAdminUser`: The user must be logged in _and_ be a super user
- `IsAuthenticatedOrReadOnly`: The user must be logged in for unsafe routes only (CREATE, UPDATE and DELETE)


In order that we can store the user on the model, we need to add a `ForeignKey` field to the model:

```py
from jwt_auth.models import User

class Book(models.Model):
    title = models.CharField(max_length=50, unique=True)
    author = models.CharField(max_length=50, unique=True)
    image = models.CharField(max_length=200)
    owner = models.ForeignKey(User, related_name='books', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.title} - {self.author}'
```

And we also need to set the user to the model in the view.

```py
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

class BookList(ListCreateAPIView):

    permission_classes = (IsAuthenticatedOrReadOnly,)

    def post(self, request):
        request.data['owner'] = request.user.id
        created_book = BookSerializer(data=request.data)
        if created_book.is_valid():
            created_book.save() # add the user to the model on save
            return Response(created_book.data, status=201)
        return Response(created_book.errors, status=422)
```

## Displaying the user

With the user being automatically added to the book, we can now display the user by adding it to the `BookSerializer`:

```py
from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Book
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username')
        
class BookSerializer(serializers.ModelSerializer):

    class Meta:
        model = Song
        fields = '__all__'

class PopulatedBookSerializer(BookSerializer):
    owner = UserSerializer()
```

## Further reading

- [Authentication & Permissions - Django REST Framework Tutorial](https://www.django-rest-framework.org/tutorial/4-authentication-and-permissions/)
- [Permissions - Django REST Framework Docs](https://www.django-rest-framework.org/api-guide/permissions/)
