# Controllers

In order to link the data from our models to a template, we need to create a controller. Our controller files will hold a set of functions, one for each route that they need to handle. For a RESTful resource that will be five RESTful routes on the server side: `INDEX`, `CREATE`, `SHOW`, `UPDATE` and `DELETE`.

Let's take a look at a typical RESTful controller for a songs resource:

```js
const Dinosaur = require('../models/dinosaur') // require the model

async function dinosaursIndex(req, res) {
  try {
    const dinosours = await Dinosaur.find()
    res.status(200).json(dinosours)
  } catch (err) {
    res.json(err)
  }
}

async function dinosaursCreate(req, res) {
  try {
    const createdDinosaur = await Dinosaur.create(req.body)
    res.status(201).json(createdDinosaur)
  } catch (err) {
    res.status(422).json(err)
  }
}

async function dinosaursShow(req, res) {
  const dinoId = req.params.id
  try {
    const dinosaur = await Dinosaur.findById(dinoId)
    if (!dinosaur) throw new Error()
    res.status(200).json(dinosaur)
  } catch (err) {
    res.status(404).json({ 'message': 'Not Found' })
  }
}

async function dinosaursUpdate(req, res) {
  const dinoId = req.params.id
  try {
    const dinosaur = await Dinosaur.findByIdAndUpdate(
      dinoId, 
      req.body, 
      { new: true, runValidators: true }
    )
    res.status(202).json(dinosaur)
  } catch (err) {
    res.status(422).json(err)
  }
}

async function dinosaursDelete(req, res) {
  const dinoId = req.params.id
  try {
    await Dinosaur.findByIdAndDelete(dinoId)
    res.sendStatus(204)
  } catch (err) {
    res.json(err)
  }
}


module.exports = {
  index: dinosaursIndex,
  create: dinosaursCreate,
  show: dinosaursShow,
  update: dinosaursUpdate,
  delete: dinosaursDelete
}
```

Now that we have created a controller, we can connect it to the router in our `config/router.js` file:

```js
const router = require('express').Router()
const songs = require('../controllers/songs')

router.route('/songs')
  .get(songs.index)
  .post(songs.create)


router.route('/songs/:id')
  .get(songs.show)
  .put(songs.update)
  .delete(songs.delete)
```
