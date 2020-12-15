const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
const cors = require('cors')
const passport = require('passport')
require('dotenv').config()
require('./configs/passport.config')

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const authRoute = require('./routers/auth.router')

app.use('/auth', authRoute)
app.use(
  '/test',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    res.send({ passport: req.user })
  }
)

app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
