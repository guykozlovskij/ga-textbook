# Relationships

Most application make some form of relationship between models, so let's look at how we can make some simple relationships with Django and the Django REST framework.

## One-to-many (1:M)

A 1:M relationship is relatively trivial with Django, however we do need to consider how the data will be rendered. If we take books and authors as an example. A book can have ONE author (well, actually it can have many, but in this example it can have only one), and another can have MANY books.

We need to decide whether the books should be nested in the author, or the author in the book. Since we will definitely want to display the author on the books INDEX and SHOW routes, we'll nest the author in the book in this example.

### Models

Firstly we need to create the models:

```py
class Author(models.Model):
    firstname = models.CharField(max_length=20)
    middlename = models.CharField(max_length=20, blank=True)
    lastname = models.CharField(max_length=20)

    def __str__(self):
        return f'{self.firstname} {self.middlename} {self.lastname}'



class Book(models.Model):
    title = models.CharField(max_length=50, unique=True)
    author = models.ForeignKey(Author, related_name='books', on_delete=models.CASCADE)
    image = models.CharField(max_length=200)

    def __str__(self):
        return f'{self.title} - {self.author}'
```

The important part here is the `author` field in the `Book` model. It is a `ForeignKey` field, and the `Author` class is passed into it as the first argument. In order to do this the `Author` model needs to be defined _before_ the `Book` model.

The `ForeignKey` field also takes a `related_name` keyword argument. This is the name for the opposite side of the relationship. So in this example the author has `books` property which would contain all the books with that author's ID.

Finally there is the `on_delete` kwarg. This tells the database what to do if a book is deleted. There are several options, but the most commonly used ones are:

- `CASCASDE`: Delete the book if the related author is deleted
- `PROTECT`: Prevent deletion unless the field is `NULL`
- `SET_NULL`: Set the field to `NULL` if the related author is deleted

Once the models have been created we need to make and run our migrations:

```
python manage.py makemigrations
python manage.py migrate
```

> **Note**: If you are modifying an existing model to add a foreign key, the migrations may not run as the migrations may fail due to the existing data not being compatible with the new table design. In this case you may have to drop and recreate your database before running the migrations again.

### Serializers

Now we need to create the serializers:

```py
from rest_framework import serializers
from .models import Author, Book

class AuthorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Author
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):

    class Meta:
        model = Book
        fields = '_all__'

class PopulatedBookSerializer(BookSerializer):
    author = AuthorSerializer()
```

We can now use the "Populated" serializer in our Book view, whenever we want a response to be populated with nested values/

### Adding data

With that done, we can add both the `Author` and `Book` models to the admin site, but modifying the app's `admin.py` file like so:

```py
from django.contrib import admin
from .models import Author, Book

# Register your models here.
admin.site.register(Author)
admin.site.register(Book)
```

Now we can log in to the admin site, and add some data. You'll notice that that admin site has a dropdown for assigning an author to a book:

![Adding a book](https://media.git.generalassemb.ly/user/15120/files/9706b500-ca7e-11e9-8a66-9315b0cc77e3)

The `/books` endpoint should now display the book with the author nested in the JSON:

![Nested author](https://media.git.generalassemb.ly/user/15120/files/15fdec80-ca83-11e9-8d09-a4f46f539bbf)

> **Note**: As things stand the books will not be nested in the author. We'll look at how to do this later.

## Many-to-many (M:M)

M:M relationships are equally as trivial (so long as you only want to display the data one way). Let's add a third model `Genre` into the mix:

### Models

```py
class Genre(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self):
        return f'{self.name}'
```

We can now add it to the `Book` as a M:M relationship:

```py
class Book(models.Model):
    title = models.CharField(max_length=50, unique=True)
    author = models.ForeignKey(Author, related_name='books', on_delete=models.DO_NOTHING)
    image = models.CharField(max_length=200)
    genres = models.ManyToManyField(Genre, related_name='books', blank=True)

    def __str__(self):
        return f'{self.title} - {self.author}'
```

Again, `Genre` needs to be defined first before being added to the `Book` model.

Now we need to run the migrations to create the new genre table and the join table needed for the M:M relationship:

```
python manage.py makemigrations
python manage.py migrate
```

### Serializers

Let's create a `GenreSerializer` and update the `BookSerializer` to handle the nested genres:

```py
class GenreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Genre
        fields = '__all__'

class AuthorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Author
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):

    class Meta:
        model = Book
        fields = '_all__'

class PopulatedBookSerializer(BookSerializer):
    author = AuthorSerializer()
    genres = GenreSerializer(many=True)
```

Notice here we are passing `many=True` to the `GenreSerializer` so it can handle an array of genres.

## Adding data

Hook up the new model to the admin site:

```py
from django.contrib import admin
from .models import Genre, Author, Book

# Register your models here.
admin.site.register(Genre)
admin.site.register(Author)
admin.site.register(Book)
```

Now you should be able to add some genres to books:

![Adding genres to books](https://media.git.generalassemb.ly/user/15120/files/c7505280-ca82-11e9-8170-25bd7dc11010)

And the data should be nested in the API:

![Nested genres](https://media.git.generalassemb.ly/user/15120/files/e5b64e00-ca82-11e9-93f1-4873e21024a4)

## Further Reading

- [Handling Model Relationships in Django Rest Framework - Medium](https://medium.com/@krishnaregmi/handling-model-relationships-in-django-rest-framework-e0dfbcf1d83e)
- [Serializer Relations - Django REST Framework](https://www.django-rest-framework.org/api-guide/relations/)
