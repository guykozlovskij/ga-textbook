# Django Apps

An app is a single, standalone part of a project which could, theoretically be removed from one Django project and plugged into another with little or no modification.

An app has its own set of URLs, it own models, views and templates.

> **Note**: Django describes itself as a Model-View-Template framework. Coming from MVC this can sound a little confusing but actually semantically it's the same thing. Models are models, templates are views, and views are controllers:

> Model = Model<br>View = Controller<br>Template = View<br>

Once we have built our app, we can plug it into the Django project by modifying some settings in the `project` folder.

> **Note**: This follows on from the [Intro to Django](intro-to-django.md) notes, so at by this point you should have already set up a Django project, and run the initial migrations.

To create an app run the following command:

```
django-admin startapp books
```

This will create a `books` folder next to the project folder. It should contain the following files and folders:

```
├── __init__.py
├── admin.py
├── apps.py
├── migrations
│   └── __init__.py
├── models.py
├── tests.py
└── views.py
```

All these files are important, but for now we'll just be concentrating on the `models.py` and `views.py` files.

Firstly we need to hook up the `books` app to the Django product by adding it to the `INSTALLED_APPS` list in the `project/settings.py` file:

```py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'books', # add the app name here
]
```

## Creating a model

For this app we are going to display some books, so first off we need to create a book model. Open the `models.py` file and add the following code:

```py
from django.db import models

# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=50)
    author = models.CharField(max_length=50)
    image = models.CharField(max_length=200)
```

Obviously we could add a lot more fields, but for now, let's just keep it simple.

Now that we've created our model, we need to modify the database, to create a new table. Rather than writing the SQL commands ourselves, we'll get Django to do it for us:

```
python manage.py makemigrations
```

This will create some _migrations_, files that describe database changes. These allow us to modify the database, and also roll back those modifications if need be.

> **Note**: This will only work if the app has been added to the INSTALLED_APPS list in the project's settings file.

One the migrations have been created, we can run them (which will actually create the new table), like so:

```
python manage.py migrate
```

## Adding some data

With that in place, we can add some test data using the admin section of the site, but first we have to register the model so the admin site can pick it up.

Add the following to `books/admin.py`:

```py
from django.contrib import admin
from .models import Book

# Register your models here.
admin.site.register(Book)
```

Navigate to the admin site: http://localhost:8000/admin. Once you have logged in you should see a Books link on the dashboard:

![Django Admin Dashboard](https://media.git.generalassemb.ly/user/15120/files/2a6eb600-c9ab-11e9-8221-863692c75dbd)

Click on _Add_ to add a few books.

You'll notice that the books will appear as _Book object (1)_ on the list view. Let's make this a bit easier to read by updating the Book models' `__str__` method:

```py
class Book(models.Model):
    title = models.CharField(max_length=50)
    author = models.CharField(max_length=50)
    image = models.CharField(max_length=200)

    def __str__(self):
        return f'{self.title} - {self.author}'
```

Reload the page, and you should see a much more clear representation of the books.

### If you are implementing DJANGO REST FRAMEWORK, please head to that entry now, and stop following this one here.

## Adding some routes

Now we have some data we can work with we can create an INDEX route. This means we need to create a view (controller), and a template (view).

There are a number of ways of creating a view in Python, but we'll just focus on one, a class.

Add the following code to `books/views.py`:


```py
from django.shortcuts import render
from django.views import View

# Create your views here.
class ListView(View):

    def get(self, request):
        return render(request, 'index.html')
```

When the view receives a GET request it will return the `index.html` file (which we have yet to write).

We now need to add the view to the URLs of the app. Create a `books/urls.py` file and add the following:

```py
from django.urls import path
from .views import ListView

urlpatterns = [
    path('', ListView.as_view()),
]
```

Now we need to hook the book app's URLs to the Django project. Update `project/urls.py` to the following:

```py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('books/', include('books.urls'))
]
```

Finally we need to make our template file. Create a folder called `templates` in the `books` folder, and add an `index.html` file. Add the following:

```html
<h1>Books INDEX</h1>
```

If you go to http://localhost:4000/books/ you should now see the books INDEX page.

## Adding some data to the template

Django comes with its own templating engine, which we can use to display the data from the model in HTML format. Firstly we need to pass the data to the template. Update the `books/views.py` file like so:

```py
from django.shortcuts import render
from django.views import View

from .models import Book

# Create your views here.
class ListView(View):

    def get(self, request):
        books = Book.objects.all() # get all the books

        # pass the books to the template file
        return render(request, 'index.html', {'books': books})
```

Here we are loading all the books from the database and storing them in a variable called `books`. We then pass them to the template in the last argument of the `render` method. We have to pass them in a dictionary, the key is the name given to the data in the template, the data is the data we are passing.

Now we have the book data being passed into the template, we can loop over the data in the template file. Update `books/templates/index.html` like so:

```html
<h1>Books INDEX</h1>

{% for book in books %}
<div>
  <img src="{{ book.image }}" alt="{{ book.title }}" />
  <h3>{{ book.title }}</h3>
  <h4>{{ book.author}}</h4>
</div>
{% endfor %}
```

Django's templating engine is actually very similar to React's JSX, except we're using `{{ }}` instead of `{ }`. Also note the `{% %}` when performing control flow.

In the template we are looping over `books`, this is the data from the database that we passed into the template in the render method:

```py
render(request, 'index.html', {'books': books}) # The key is the name given to the data in the template
```

Reload the page, and you should see some books appear.


## SHOW route

To round off, let's add a SHOW route. Open `books/views.py` and add the following:

```py
class DetailView(View):

    def get(self, request, pk):
        book = Book.objects.get(pk=pk) # get a book by id (pk means primary key)

        # pass the book to the template file
        return render(request, 'show.html', {'book': book})
```

Update `books/urls.py`:

```py
from django.urls import path
from .views import ListView, DetailView

urlpatterns = [
    path('', ListView.as_view()),
    path('<int:pk>/', DetailView.as_view()),
]
```

> **Note**: A note about URLs in Django: Django prefers trailing slashes for its urls, eg: books/ books/1/ etc. While this can be changed it is a convention.

The `<int:pk>` is similar to Express and React's `:id`, it reads that portion of the url as a parameter that gets passed to the view as the third argument.

Finally let's make the template. Create `books/templates/show.html` and add the following:

```html
<h1>{{ book.title }}</h1>
<h2>{{ book.author}}</h2>

<img src="{{ book.image }}" alt="{{ book.title }}" />
```

We can also add a link to the INDEX route, so that we don't have to type out the URL manually to see the SHOW route. Update `books/templates/index.html` like so:

```html
<h1>Books INDEX</h1>

{% for book in books %}
<div>
  <a href="/books/{{ book.id }}/">
    <img src="{{ book.image }}" alt="{{ book.title }}" />
    <h3>{{ book.title }}</h3>
    <h4>{{ book.author}}</h4>
  </a>
</div>
{% endfor %}
```

## Conclusion

For the rest of the module we will be using Django as a RESTful API, so instead of serving HTML it will serve JSON to a React app. However it is useful to know how a "standard" Django app works.

## Further reading

- [Django Tips #8: Projects vs Apps](https://wsvincent.com/django-projects-vs-apps/)
- ["Hello World" Using Django - Medium](https://medium.com/@sharma.ashish.1996/hello-world-using-django-first-app-5218e4168b42)
- [Making a Hello World App with Django - YouTube](https://www.youtube.com/watch?v=h7rvyDK70FA)
