import dotenv from 'dotenv'
dotenv.config()

export const port = process.env.PORT || 4000
export const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/jingle-films-db'
export const secret = process.env.SECRET || 'hello this is my secret'
