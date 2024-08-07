// import {loggerService} from './../service/logger.service.js'
import {authService} from '../api/auth/auth.service.js'

export async function requireAuth(req,res,next){

        const loggedinUser = authService.validateToken(req.cookies.loginToken)
        if(!loggedinUser) return res.status(401).send(`login first`)

        req.loggedinUser = loggedinUser
        next()

  

}