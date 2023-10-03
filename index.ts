import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import router from './src/routes'

dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()

app.use(
  cors({
    origin: 'http://127.0.0.1:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }),
)

app.use(express.json())
app.use(cookieParser())

app.use('/', router)

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL as string)
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (error) {
    console.error('Error synchronizing database:', error)
  }
}

start()
