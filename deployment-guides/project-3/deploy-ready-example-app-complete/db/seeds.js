import mongoose from 'mongoose'
import connectToDatabase from '../lib/connectToDb.js'
import Film from '../models/film.js'
import User from '../models/user.js'
import filmData from './data/films.js'
import userData from './data/users.js'


async function seedDatabase() {
  try {
    await connectToDatabase()

    console.log('🤖 Database connected')

    await mongoose.connection.db.dropDatabase()

    console.log('🤖 Database dropped')

    const users = await User.create(userData)

    console.log(`🤖 ${users.length} users created`)

    const filmDataWithOwners = filmData.map(film => {
      film.owner = users[0]._id
      return film
    })

    const films = await Film.create(filmDataWithOwners)

    console.log(`🤖 ${films.length} films created`)

    await mongoose.connection.close()

    console.log('🤖 Goodbye')

  } catch (err) {
    console.log('🤖 Something went wrong')
    console.log(err)

    await mongoose.connection.close()
    console.log('🤖 Goodbye')
  }
}

seedDatabase()
