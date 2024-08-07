import express from 'express'


import { addUser, getUser, getUserById, RemoveUser, updateUser } from './user.controller.js'

const router = express.Router() 


router.get('/',getUser)

router.get('/:userId', getUserById)

router.delete('/:userId', RemoveUser)

router.post('/', addUser)

router.put('/', updateUser)


export const userRoutes = router