import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


import {loggerService} from './service/logger.service.js'
import {bugRoutes} from './api/bug/bug.routes.js'
import {userRoutes} from './api/user/user.routes.js'
import {authRoutes} from './api/auth/auth.routes.js'

const app = express()

const corsOptions = {
    origin: [
      'http://127.0.0.1:5173',
      'http://localhost:5173',
      'http://127.0.0.1:5174',
      'http://localhost:5174',
    ],
    credentials: true, // Allow credentials
  };

app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())



app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)



const port = process.env.PORT || 3000
app.listen(port, () =>
    console.log(`Server listening on port http://127.0.0.1:${port}/`)
)
