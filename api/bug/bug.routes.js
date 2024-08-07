import express from 'express'


import { addBug, getBug, getBugById, RemoveBug, updateBug,CheckCookie } from './bug.controller.js'
import {requireAuth} from '../../middlewares/auth.midleware.js'
const router = express.Router() 


router.get('/',getBug)

router.get('/:bugId',CheckCookie, getBugById)

router.delete('/:bugId',requireAuth, RemoveBug)

router.post('/',requireAuth, addBug)

router.put('/',requireAuth, updateBug)


export const bugRoutes = router