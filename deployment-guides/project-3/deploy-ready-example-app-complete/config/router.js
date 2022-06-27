import express from 'express'
import films from '../controllers/films.js'
import auth from '../controllers/auth.js'
import users from '../controllers/users.js'
import secureRoute from '../lib/secureRoute.js'

const router = express.Router()

router.route('/films')
  .get(films.index)
  .post(secureRoute, films.create)

router.route('/films/:id')
  .get(films.show)
  .put(secureRoute, films.update)
  .delete(secureRoute, films.delete)

router.route('/films/:id/comments')
  .post(secureRoute, films.commentCreate)

router.route('/films/:id/comments/:commentId')
  .delete(secureRoute, films.commentDelete)

router.route('/profile')
  .get(secureRoute, users.userProfile)

router.route('/register')
  .post(auth.registerUser)

router.route('/login')
  .post(auth.loginUser)

export default router
