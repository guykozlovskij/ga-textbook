# Mongoose Validations

Mongoose will validate the data that we use to create a record for us. All we have to do is add the validation to the model:

```js
import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  origin: { type: String, required: true, minlength: 2 },
  strength: { type: Number, required: true, min: 1, max: 5 }
});

const Cheese =  mongoose.model('Cheese', schema);
```

In the example above we've added some validations:

- `unique`: No two records can have the same value
- `minlength`: The string must be at least this length
- `min`: The number must be at least this value
- `max`: The number cannot exceed this value

There are other useful ones, including `enum` which means that a value must be one of the options provided.

Once the validations have been added to the model, if we try to save some data, and the validations fail we will get an error:

```js
const cheese = Cheese.create({ name: 'test', origin: 'a', strength: 64 }) // * this will cause an error if validations are not met
```

## Handling errors

Once a validations have been added, it's important that we handle any form errors. This should be done on both the server side _and_ the client side, with the server side being the most important.

In this example we are checking if there is a validation error, and if so we send a 422 (Unprocessble Entity) response and an error page, which could display the errors to the user.

Otherwise we send a more generic 500 (Internal Server Error) response with a page which could display the error to the user, or perhaps a cat running into a screen door or something.


```js
function createRoute(req, res, next) {
  try {
    const cheese = await Cheese.create(req.body)
    res.json(cheese)
  } catch (err) {
    // do something with the error
  }
}
```

## Further reading

- [Mongoose Validations](http://fiznool.com/blog/2014/04/23/mongoose-validations/)
