# Serializers

Django REST Framework uses _serializers_ to convert model instances into JSON, and to convert JSON into model instances. A serializer is very similar to a mongoose schema.

In Django the _model_ defines the database table structure, and is also responsible for interacting with the database. It ultimately runs SQL commands against the project's database. The _serializer_ sits in front of the model, it validates the data coming from the client, before it reaches the model, and it also serialises the data (turns it into a JSON string) after the model has retrieved the data from the database.

## Syntax

Here is a typical model serializer:

```py
class BookSerializer(serializers.ModelSerializer):

    class Meta:
        model = Book
        fields = ('id', 'title', 'author', 'image')

```

A model serializer is a special type of serializer that uses the model to help define the data types and the way it should be converted into a string.

The `model` property indicates which model the serializer should base its serialisation on, and the `fields` property defines which fields should be output to the JSON string, or be included when validating the data from the client.

In the example above if the serializer receives a field that doesn't exist in the `fields` tuple, it will throw an error.

The `ModelSerializer` is a convenience class, which reduces the amount of code a developer needs to write, and often is the most suitable when there is little or no customisation needed. However we could also use the more generic `Serializer` class. The `Serializer` class makes no assumptions about the data, and the developer must define each field manually:

```py
class BookSerializer(serializers.Serializer):
    title = serializer.CharField()
    author = serializer.CharField()
    image = serializer.CharField()
```

On top of this the developer will need to define `create` and `update` methods which come built-in to the `ModelSerializer`. Below is a simple example:

```py
class BookSerializer(serializers.Serializer):
    title = serializer.CharField()
    author = serializer.CharField()
    image = serializer.CharField()

    def create(self, validated_data):
      return Book(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.author = validated_data.get('author', instance.author)
        instance.image = validated_data.get('image', instance.image)
        return instance
```

The `Serializer` class is best for when the serializer either does not rely on a specific model, or when there is a large amount of custom logic required.

## Validation

If you are using the `ModelSerializer` (which you should be, unless you have a good reason not to), a lot of the validation is inferred from the underlying model, so adding restraints there will automatically be added during validation:

```py
class Book(models.Model):
    title = models.CharField(max_length=50, unique=True)
    author = models.CharField(max_length=50)
    image = models.CharField(max_length=200)
```

> **Note**: All fields are required by default. To make a field optional add `blank=True` for TextField and CharField or `null=True` for any other field

## Custom validation

If you want to add custom validation, you can do so in two main ways, either at an object level (ie, if you need to access the data of more than one field), or at a field level (ie, when you only need access to a specific field).

### Field level validation

Let's add a validator specifically to the image field to ensure it begins with `http`:

```py
class BookSerializer(serializers.ModelSerializer):

    class Meta:
        model = Book
        fields = ('id', 'title', 'author', 'image')

    def validate_image(self, value):
        if not value.startswith('http'):
            raise serializers.ValidationError({'image': 'Image field must begin `http`'})

        return value
```

Since we have called the function `validate_image`, it will only run when the serializer attempts to validate the image field. The `value` passed to the function will be the value of that field specifically

### Object level validation

If we need a more global level of validation, we can use the `validate` method. While this is rather contrived, let's check that the title and the author do not match:

```py
class BookSerializer(serializers.ModelSerializer):

    class Meta:
        model = Book
        fields = ('id', 'title', 'author', 'image')

    def validate(self, data):
        if data['title'] == data['author']:
            raise serializers.ValidationError({'author': 'Author cannot match title'})
```

## Using serializers

We can now use our serializers in the view, to not only convert the database data into JSON, but also to turn the client request data into model instances ready to be saved to the database.


### Serialisation

Firstly let's look at how we can serialise data:

```py
def get(self, _request, _format=None):
    books = Book.objects.all()
    serializer = CheeseSerializer(books, many=True)
    return Response(serializer.data)
```

When we instantiate a new serializer with some data from the database, it will create a Django friendly format for that data that can be easily converted to JSON by the `Response` class.

If we have a collection of data, like in an INDEX route, for example, we need to tell the serializer that we expect an array of data by passing the `many=True` keyword argument.

### Deserialisation

When deserialising, we also need to handle any errors throw during validation. Let's take a look at a CREATE route first:

```py
def post(self, request, _format=None):
    serializer = BookSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=422)
```

Here we pass the data from the request to the serializer, then check if it is valid using the `is_valid` method. If it is we can pass back the serialised data to the client as before, otherwise we can send the validation errors created by the serializer instead.

The process is similar with the UPDATE route, except this time we need to add the request data to the existing database object:

```py
def put(self, request, pk, _format=None):
    book = Book.objects.get(pk=pk)
    serializer = BookSerializer(book, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=422)
```

## Further reading

- [Tutorial 1: Serializers - Django REST Framework](https://www.django-rest-framework.org/tutorial/1-serialization/)
- [Serializers - Django REST Framework](https://www.django-rest-framework.org/api-guide/serializers/)
