import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 300 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true  },
}, {
  timestamps: true,
})

const christmasFilmSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  year: { type: Number, required: true },
  plotDescription: { type: String, required: true, maxlength: 400 },
  isSequel: { type: Boolean, default: false },
  poster: { type: String, required: true },
  starring: [{ type: String, required: true }],
  quote: { type: String, required: true, unique: true },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true  },
  comments: [commentSchema],
})

christmasFilmSchema.virtual('avgRating').get(function () {
  if (!this.comments.length) return 'Not Rated Yet'

  const avg = this.comments.reduce((sum, curr) => {
    return sum + curr.rating
  }, 0)
  return Math.round(avg / this.comments.length)
})

christmasFilmSchema.set('toJSON', { virtuals: true })

christmasFilmSchema.plugin(uniqueValidator)

export default mongoose.model('Film', christmasFilmSchema)
