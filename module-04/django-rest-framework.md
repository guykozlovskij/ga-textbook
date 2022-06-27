# Django Rest Framework (DRF)

Dango is a great framework for rapid development of complex apps. However it has no native support for JSON APIs. However we can install the Django Rest Framework to turn out HTML based app into a JSON based API with relative ease.

> **Note**: This follows on from the [Django Apps](django-apps.md) notes, so at by this point you should have already set up a Django project with a books app, with models.

## Setup

Install DRF with _pipenv_:

```
pipenv install djangorestframework
```

Add it to your project's `INSTALLED_APPS` list in `project/settings.py`:

```py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'books',
]
```

## Serializers

Rather than using templates which use HTML, Django Rest Framework uses _serializers_ to convert model data to JSON.

> **Note**: serialization is the process of turning objects to strings, de-serialization is the reverse process.

Create a directory `books/serializers`the file `books/serializers/common.py`, and add the following:

```py
from rest_framework import serializers
from ..models import Book

class BookSerializer(serializers.ModelSerializer):

    class Meta:
        model = Book
        fields = ('id', 'title', 'author', 'image')
```

We now need to tell the view to use the serializer rather than the `index.html` template. Update `books/views.py`:

```py
from rest_framework.views import APIView # get the APIView class from DRF
from rest_framework.response import Response # get the Response class from DRF

from .models import Book
from .serializers import BookSerializer # get the BookSerializer

# Create your views here.
class ListView(APIView): # extend the APIView

    def get(self, _request):
        books = Book.objects.all() # get all the books
        serializer = BookSerializer(books, many=True)

        return Response(serializer.data) # send the JSON to the client


class DetailView(APIView): # extend the APIView

    def get(self, _request, pk):
        book = Book.objects.get(pk=pk) # get a book by id (pk means primary key)
        serializer = BookSerializer(book)

        return Response(serializer.data) # send the JSON to the client
```

Navigate to http://localhost:8000/books/, you should be greeted by the Django REST framework! It's an interactive, "browsable" API which allows the end user to browse the API in an interactive way. It attempts to add the functionality of 3rd-party apps like Insomnia and Postman right into the app!

![Django REST Framework](https://media.git.generalassemb.ly/user/15120/files/141c2680-c9ba-11e9-9385-7cf612ccdbad)

This does not affect HTTP requests to the API, instead it only adds this extra styling when accessed by a browser. Check it what you get if you make the same request on Insomnia:

![Insomnia view](https://media.git.generalassemb.ly/user/15120/files/ad4b3d00-c9ba-11e9-8c9b-2f3552d3395f)


## Further Reading

- [Quickstart - Django REST Framework](https://www.django-rest-framework.org/tutorial/quickstart/)
- [Official Django REST Framework Tutorial - A Beginners Guide](https://wsvincent.com/official-django-rest-framework-tutorial-beginners-guide/)
- [Basics of Django REST Framework - Caktus Group](https://www.caktusgroup.com/blog/2018/02/26/basics-django-rest-framework/)
