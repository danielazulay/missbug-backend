import {authService} from './auth.service.js'
import {loggerService} from './../../service/logger.service.js'


export async function login(req,res){
    const { username, password } = req.body
    try{
       
    const user = await authService.login(username, password)

    const loginToken  = authService.getLoginToken(user)
 
    res.cookie('loginToken',loginToken,{sameSite:'None', secure:true})
    res.json(user)


    }catch(err){
        loggerService.error('failed to login'+err)
        res.status(401).send({err : 'failed to login'})
    }

}

export async function signup(req,res){
    const credentials = req.body
    try{    

        const account = await authService.signup(credentials)
      
        loggerService.debug('auth.route - new account created' + JSON.stringify(credentials.username))

        const user = await authService.login(credentials.username,credentials.password)

        loggerService.info('User signup:', user)

        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
        
        res.json(user)

    }catch(err){
        loggerService.error('failed to sigin'+err)
        res.status(401).send({err : 'failed to sigin'})
    }

}


export async function logout(req,res){

    try{
       
        res.clearCookie('loginToken')
        res.send('logged out successfully')

    }catch(err){
        loggerService.error('failed to log out'+err)
        res.status(401).send({err : 'failed to logout'})
    }

}