# Views

Django considers itself a _Model-Template-View_ framework, however coming from a _Model-View-Controller_ architecture you can think of a Django _View_ as a _Controller_. It gets the required data from the model and passes it to the correct template or _serializer_ then sends the result to the client.


## Class View

An example of a class based view in Django, with methods for getting all of a resource (Index) and creating a new one (Create)

```py
from rest_framework.response import Response
from rest_framework.views import APIView

class BookList(View):

    def get(self, _request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)
```

This can now be added to the app's URLs like so:

```py
urlpatterns = [
    path('/books', BookList.as_view())
]
```


## Further reading:

- [Writing Views - Django Docs](https://docs.djangoproject.com/en/2.2/topics/http/views/)
- [Class Based Views - Django REST Framework Tutorial](https://www.django-rest-framework.org/tutorial/3-class-based-views/)
