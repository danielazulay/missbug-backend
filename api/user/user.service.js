import fs from 'fs';
import { utilService } from '../../service/util.Service.js'
import { loggerService } from '../../service/logger.service.js'

const users = utilService.readJsonFile('data/user.json')


export const userService = {
    query,
    queryById,
    getByUserName,
    remove,
    save
}

async function query(filterBy){

    let localUsers = users
    try{
        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i');
            localUsers = localUsers.filter(user => regExp.test(user.fullname)  );
        }

        if(filterBy.score){
             localUsers =   localUsers.filter((user)=>user.score === filterBy.score)
        }

    if (filterBy.sortBy) {
            const sortDir = filterBy.sortDir === '-1' ? -1 : 1;
            localUsers.sort((a, b) => {
                if (a[filterBy.sortBy] > b[filterBy.sortBy]) return sortDir;
                if (a[filterBy.sortBy] < b[filterBy.sortBy]) return -sortDir;
                return 0;
            });
        }

        if(filterBy.pageIdx==0) return []
        if (filterBy.pageIdx) {

 

            let page =filterBy.pageIdx*3


            return  localUsers.slice(page-3,page)

            
        }

        return localUsers
    }catch(err){    
        console.log(err)    
        throw err
    }
}

 function queryById(userId){
    try{
        const  user =   users.find((user)=>user._id === userId)

        if (!user) throw 'condt find this user'
        return user

    }catch(err){    
        console.error(err)    
        throw err
    }
}

async function getByUserName(username) {
    try {
        const user = users.find(user => user.username === username)
        // if (!user) throw `User not found by username : ${username}`

        return user
    } catch (err) {
        loggerService.error('userService[getByUsername] : ', err)
        throw err
    }
}

 function remove(userId){
    try{
        const userIndex =  users.findIndex((user)=>user._id === userId)
        if (!userIndex) throw 'condt find this user'
        users.splice(userIndex, 1)
       return _saveusersToFile()
    }catch(err){    
        console.error(err)    
        throw err
    }
}

async function save(user) {
    try {


        // Only handles user ADD for now
        user._id =  utilService.makeId()
        user.score = 10000
        user.createdAt = Date.now()
 
        if (!user.imgUrl) user.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
        users.push(user)
        await _saveUsersToFile()
 
        return user

    } catch (err) {
        loggerService.error('userService[save] : ', err)
        throw err
    }
}


function _saveUsersToFile() {
    return new Promise((resolve, reject) => {

        const usersStr = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', usersStr, (err) => {
            if (err) {
                return console.log(err);
            }
            resolve()
        })
    })
}
