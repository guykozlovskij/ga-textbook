import Film from '../models/film.js'
import { notFound, forbidden } from '../lib/errorHandler.js'

async function filmIndex(_req, res, next){
  try {
    const films = await Film.find().populate('owner')
    return res.status(200).json(films)
  } catch (err) {
    next(err)
  }
}

async function filmCreate (req, res, next) {
  try {
    const newFilmData = { ...req.body, owner: req.currentUser._id }
    const newFilm = await Film.create(newFilmData)
    return res.status(201).json(newFilm)
  } catch (err) {
    next(err)
  }
}

async function filmShow(req, res, next) {
  const { id } = req.params
  try {
    const film = await Film.findById(id).populate('owner').populate('comments.owner')
    if (!film) throw new Error(notFound)
    return res.status(200).json(film)
  } catch (err) {
    next(err)
  }
}

async function filmUpdate(req, res, next) {
  const { id } = req.params
  try {
    const filmToEdit = await Film.findById(id)
    if (!filmToEdit) throw new Error(notFound)
    if (!filmToEdit.owner.equals(req.currentUser._id)) throw new Error(forbidden)
    Object.assign(filmToEdit, req.body)
    await filmToEdit.save()
    return res.status(202).json(filmToEdit)
  } catch (err) {
    next(err)
  }
}

async function filmDelete(req, res, next) {
  const { id } = req.params
  try {
    const filmToDelete = await Film.findById(id)
    if (!filmToDelete) throw new Error(notFound)
    if (!filmToDelete.owner.equals(req.currentUser._id)) throw new Error(forbidden)
    await filmToDelete.remove()
    return res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}

async function filmCommentCreate(req, res, next) {
  const { id } = req.params
  try {
    const film = await Film.findById(id)
    if (!film) throw new Error(notFound)
    const newComment = { ...req.body, owner: req.currentUser._id }
    film.comments.push(newComment)
    await film.save()
    return res.status(201).json(film)
  } catch (err) {
    next(err)
  }
}

async function filmCommentDelete(req, res, next) {
  const { id, commentId } = req.params
  try {
    const film = await Film.findById(id)
    if (!film) throw new Error(notFound)
    const commentToDelete = film.comments.id(commentId)
    if (!commentToDelete) throw new Error(notFound)
    if (!commentToDelete.owner.equals(req.currentUser._id)) throw new Error(forbidden)
    await commentToDelete.remove()
    await film.save()
    return res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}

export default {
  index: filmIndex,
  create: filmCreate,
  show: filmShow,
  update: filmUpdate,
  delete: filmDelete,
  commentCreate: filmCommentCreate,
  commentDelete: filmCommentDelete,
}
