# Mongoose Models

Rather than using MongoDB directly in the command line, we need a way to interface with it from our Express app. To do this we will use an _Object-relational Mapping_ application or \(ORM\). Although this sounds complex it is simply a piece of software which interacts with the database on our behalf.

There are ORMs for all sorts of databases and programming languages, but for a node app interacting with a mongo database, the _de facto_ choice is Mongoose.

We can use Mongoose to create models which perform two fuctions:

1. They perform CRUD actions on the relevant collection in our database
2. They validate the data that we send to the database

## Creating a model

Before we create a model, we need to establish a _schema_. A schema is simply a design for the data we want store. Think _class_ or _constructor function_.

Let's take cheese as an example. We want to create a collection of cheese records in our database. Each record needs to have specific properties, and each of those properties should have a specific data type.

A cheese model might look something like this:

```js
import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  origin: { type: String, required: true },
  strength: { type: Number, required: true }
})

export default mongoose.model('Cheese', schema)
```

So here we are saying that when we create a cheese record, it should have:

* a `name` which must be a string, and must be present
* a `origin` which must be a string, and must be present
* a `strength` must be a number, and must be present

Anything else will be removed by mongoose, to ensure that our data is consistent.

## Using a model

Once we've created a model, we can use it to perform CRUD actions on our `cheeses` collection. The mongoose model will interact with the database for us, running the correct Mongo commands. Whenever we use Mongoose models we need to pass a callback function which will be called _once the database interaction has been completed_.


### Create

You can create a new record like so:

```js
const createdCheese = await Cheese.create({ name: 'Gorgonzola', origin: 'Italy', strength: 5 })
console.log(createdCheese)
```

### Read

```js
// get all the cheeses
const cheeses = await Cheese.find() 

// get all the cheeses that have a strength of 4
const cheeseWithStrength4 = await Cheese.find({ strength: 4 })

// get the cheese with a specific ID
const cheeseById = await Cheese.findById('5a82d0ba2f65c8c6cb4d77f1')

```

### Update

Again there are several ways to update a record with Mongoose.

The preferred method is the two stage process of finding a record, updating it, then saving it again.

```js
// This is the preferred method

const cheeseToUpdate = await Cheese.findById('5a82d0ba2f65c8c6cb4d77f1') // find by its id
cheeseToUpdate.name = 'Cheddar' // update the cheese's properties
await cheeseToUpdate.save() // save the cheese
```

### Delete

Similar to update. Again the preferred method is to find a record, then delete it.

```js
// This is the preferred method

const cheeseToRemove = await Cheese.findById('5a82d0ba2f65c8c6cb4d77f1') // find by its id
await cheeseToRemove.remove() // remove the cheese

```

## Further reading

* [Easily Develop Node.js and MongoDB Apps with Mongoose](https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications)
* [Mongoose CRUD](https://coursework.vschool.io/mongoose-crud/)
* [Mongoose API Docs](http://mongoosejs.com/docs/api.html)
