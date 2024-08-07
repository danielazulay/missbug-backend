import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'
import { loggerService } from '../../service/logger.service.js'
import { userService } from '../user/user.service.js'



const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

export const authService = {
    login,
    signup,
    getLoginToken,
    validateToken
}

async function login(username, password){
    var user = await userService.getByUserName(username)
    if(!user) throw 'uknow username'

    const match = await bcrypt.compare(password, user.password)
    if(!match) throw 'invalid username or password'

    const miniUser = {
        _id : user._id,
        fullname: user.fullname,
        imgUrl:user.imgUrl,
        score:user.score,
    }

    return miniUser
}

async function signup({ username, password, fullname }) {
    const saltRounds = 10

  
    loggerService.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username || !password || !fullname) throw 'Missing required signup information'
    
    const userExist = await userService.getByUserName(username)

    if (userExist) throw 'Username already taken'
    
    const hash = await bcrypt.hash(password, saltRounds)



    return userService.save({ username, password: hash, fullname })
}


function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

function validateToken(token) {
    try {
        const json = cryptr.decrypt(token)

        const loggedinUser = JSON.parse(json)

        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

