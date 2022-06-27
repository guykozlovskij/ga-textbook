# Migrations and Fixtures

## Migrations

SQL is far less forgiving than noSQL, and changes to the database require their own SQL commands. If a team is working on a project, in development they will all have their own database. If a model is modified, or a new one created, a set of SQL commands will need to run against every team member's local database.

These SQL commands can add up quickly. How should they be shared throughout the team, and how should we ensure that they are run correctly in the proper sequence without any of them being missed?

With most SQL projects teams use _migrations_, files that contain the database changes that are stored in the codebase and tracked with some version control software like git.


### Making migration files

With Django, when ever we add, modify or delete a model, we need to generate migration files, which we can do with the following command:

```
python manage.py makemigrations
```

This will generate migration files that will be stored in the app's `migrations` folder. Each file will be generated with a unique file name that starts with a number, ensuring that they will be ran in sequence against the database. Example file names might look like this:

```
0001_initial.py
0002_auto_20190829_1434.py
0003_auto_20190829_1610.py
```

It is very important that these files are not tampered with, and that they are stored on git along with the rest of the project, so that developers wishing to collaborate can rapidly generate the correct database tables.

### Running migration files

Once the migrations have been created, they need to be run, which we can do with the following command:

```
python manage.py migrate
```

From time to time a migration might not run. This is normally because the data in the database conflicts with the new database tables. For example we might be trying to change a CHAR field to an INT, and the strings that are in the database cannot be converted to numbers.

In this case, you may need to delete and recreate your database before running the migrations again. We can do this with the following commands:


#### With sqlite3:
```
rm db.sqlite3
```

#### With PostgreSQL:
```
dropdb <database-name>
createdb <database-name>
```

> **Note**: replace `<database-name>` with the actual name of your database


## Fixtures

Django has its own seeding system called _fixtures_. Much like with mongoose, we can create a file that holds seed data or _fixtures_ that we can run against the database that will populate it with data for testing and development purposes.

The fixtures need to be created in a JSON file, which we recommend you call `fixtures.json` and place in your app's folder.

Here is an example fixture file:

```json
[{
  "model": "books.genre",
  "pk": 1,
  "fields": {
    "name": "Fantasy"
  }
},{
  "model": "books.genre",
  "pk": 2,
  "fields": {
    "name": "Comedy"
  }
},{
  "model": "books.author",
  "pk": 1,
  "fields": {
    "firstname": "Terry",
    "middlename": "",
    "lastname": "Pratchett"
  }
},{
  "model": "books.author",
  "pk": 2,
  "fields": {
    "firstname": "J",
    "middlename": "R R",
    "lastname": "Tolkien"
  }
},{
  "model": "books.book",
  "pk": 1,
  "fields": {
    "title": "The Lord of The Rings",
    "author": 2,
    "image": "https://cdn.waterstones.com/bookjackets/large/9780/2611/9780261103252.jpg",
    "genres": [
      1
    ]
  }
},{
  "model": "books.book",
  "pk": 2,
  "fields": {
    "title": "The Colour of Magic",
    "author": 1,
    "image": "https://vignette.wikia.nocookie.net/discworld/images/7/76/TCoM_cover.jpg/revision/latest?cb=20070107074953",
    "genres": [
      1,
      2
    ]
  }
}]
```

If you want to have Django generate a fixture file for you based on the data currently in your database, you can use the following command:

```
python manage.py dumpdata <app-name> --output <file-name> --indent=2
```

> **Note**: Replace `<app-name>` with the name of your app, `books` for example. Replace `<file-name>` with the name of the file to write the data to `books/fixtures.json` for example.

If you want to seed your database, you can now do it with the following commands:

```
python manage.py flush
```

This will empty your database. You can now re-seed it with:

```
python manage.py loaddata <file-name>
```

> **Note**: Replace `<file-name>` with the name of the file containing your fixtures `books/fixtures.json` for example.

## Further reading

- [Migrations - Django Docs](https://docs.djangoproject.com/en/2.2/topics/migrations/)
- [Providing initial data for models - Django Docs](https://docs.djangoproject.com/en/2.2/howto/initial-data/)
- [`dumpdata` command - Django Docs](https://docs.djangoproject.com/en/dev/ref/django-admin/#dumpdata)
- [`loaddata` command - Django Docs](https://docs.djangoproject.com/en/dev/ref/django-admin/#loaddata)
