# Testing

It probably comes as no surprise that testing comes built in with Django. In fact whenever you create a new app with `startapp` it will come with a `tests.py` file already created.

Before you start testing your API, you will probably want to name your URLs. This is useful because then you can use Django's `reverse` method to get the url by name, rather than hardcoding it in your tests. This way, if you change your URLs at any point (like prefix them with `/api` for example), your tests will still pass.

Update your app's `urls.py` file like so:

```py
urlpatterns = [
    path('books/', BooksList.as_view(), name='books-list'),
    path('books/<int:pk>/', BooksDetail.as_view(), name='books-detail'),
]
```

Now you can generate the correct URL using the `reverse` method:

```py
reverse('books-list') # => /books/
reverse('books-detail', kwargs={'pk': 1}) # => /books/1
```

## A simple test

Let's look at a simple test for an INDEX route:

```py
from django.urls import reverse
from rest_framework.test import APITestCase
from .models import Genre, Author, Book

# Create your tests here.
class BooksTests(APITestCase):

    def setUp(self):
        author = Author.objects.create(firstname='J', middlename='R R', lastname='Tolkien')
        genre = Genre.objects.create(name='Fantasy')
        book = Book.objects.create(title='The Hobbit', author=author, image='http://i.imgur.com/1KLiyRc')
        book.genres.set([genre]) # Have to use `set` with M:M relationships

    def test_books_index(self):
        """
        Should return an array of books
        """

        url = reverse('books-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, [{
            'id': 1,
            'title': 'The Hobbit',
            'image': 'http://i.imgur.com/1KLiyRc',
            'author': {
                'id': 1,
                'firstname': 'J',
                'middlename': 'R R',
                'lastname': 'Tolkien'
            },
            'genres': [{
                'id': 1,
                'name': 'Fantasy'
            }]
        }])
```

Each test is created in a class which extends DRF's `APITestCase` class. The `setUp` method is run at the start of the tests and can be used to add data into the database for testing.

> **Note**: Django will automatically create a test database for desting, and destroy it after tests have run

Each test should be a method of the test class and should begin with `test_`. Firstly we can get the URL using Django's `reverse` method to look up the correct URL.

We can then make a request using the built in `client`, like so:

```py
response = self.client.get(url)
```

This is similar to Axios, where the method name matches the request method, eg: `get()`, `post()`, `put()` etc.

We can now make assertions based on the response. If we want to test the JSON output of the response, we can use `assertJSONEqual`.


## Testing authenticated endpoints

Let's take a look at an authenticated endpoint. Let's assume that our _Book_ model has a `user` field which is set automatically when a book is created, and  only an authenticated user can create a book:

```py
from django.urls import reverse
from django.contrib.auth.models import User # import the User model
from rest_framework.test import APITestCase
from .models import Genre, Author, Book

# Create your tests here.
class BooksTests(APITestCase):

    def setUp(self):
        # create a test user
        user = User.objects.create(username='test', email='test@test.com')
        author = Author.objects.create(firstname='J', middlename='R R', lastname='Tolkien')
        genre = Genre.objects.create(name='Fantasy')
        # add the user to the book
        book = Book.objects.create(title='The Hobbit', author=author, image='http://i.imgur.com/1KLiyRc', user=user)
        book.genres.set([genre])

        # authenticate the client
        self.client.force_authenticate(user=user)

    def test_books_create(self):
        """
        Should return an array of books
        """

        url = reverse('books-list')
        data = {
            'title': 'The Lord of the Rings',
            'image': 'http://i.imgur.com/1KLiyRc',
            'author': 1,
            'genres': [1]
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Book.objects.count(), 2)
        self.assertJSONEqual(response.content, {
            'id': 2,
            'title': 'The Hobbit',
            'image': 'http://i.imgur.com/1KLiyRc',
            'author': {
                'id': 1,
                'firstname': 'J',
                'middlename': 'R R',
                'lastname': 'Tolkien'
            },
            'user': {
                'username': 'test',
                'email': 'test@test.com'
            }
            'genres': [{
                'id': 1,
                'name': 'Fantasy'
            }]
        })

        self.client.force_authenticate(user=None) # remove authentication
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 401)

```

So firstly we need to import the User model from `django.contrib.auth.models`. Then, in the `setUp` method we create a test user:

```py
user = User.objects.create(username='test', email='test@test.com')
```

add the user to the book like so:

```py
book = Book.objects.create(title='The Hobbit', author=author, image='http://i.imgur.com/1KLiyRc', user=user)
```

then authenticate the `client` using Django's built in `force_authenticate` method:

```py
self.client.force_authenticate(user=user)
```

Now, on to the actual test, we create some test data, and make a POST request like so:

```py
data = {
    'title': 'The Lord of the Rings',
    'image': 'http://i.imgur.com/1KLiyRc',
    'author': 1,
    'genres': [1]
}
response = self.client.post(url, data)
```

We can now test for a 201 response and the correct JSON similar to before. Also, we can test that the record was added to the database like so:

```py
self.assertEqual(Book.objects.count(), 2)
```

Finally, we can check for a 401 response if the user tries to cerate a book without being authenticated:

```py
self.client.force_authenticate(user=None) # remove authentication
response = self.client.post(url, data)
self.assertEqual(response.status_code, 401)
```

## Further reading

- [Testing - Django REST Framework Docs](https://www.django-rest-framework.org/api-guide/testing/)
