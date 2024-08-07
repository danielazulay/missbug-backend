import { userService } from "./user.service.js";
import { loggerService } from '../../service/logger.service.js'; 

export async function getUser(req,res){
    try{
        const { txt,score,pageIdx,sortBy,sortDir } = req.query

        const filterBy = {
            txt,
            score:+score,            
        }

        if (pageIdx) filterBy.pageIdx = +pageIdx
        if (sortBy){
            filterBy.sortBy = sortBy
            filterBy.sortDir = sortDir
        }
        

        let users = await userService.query(filterBy)
    
        res.send(users)
        
    }catch(err){
        loggerService.error(err)
        res.status(400).send("coundt reach data")
    }
}



export async function getUserById(req,res){

    const {userId} = req.params
    try{

        const user = await userService.queryById(userId)

        res.send(user)
        
    }catch(err){
        loggerService.error(err)
        res.status(400).send("coundt reach data")
    }


}


export async function RemoveUser(req,res){
    
    const {userId} = req.params
    try{
        await userService.remove(userId)

        res.send("user deleted")

    }catch(err){
        loggerService.error(err)
        res.status(400).send("coundt reach data")
    }
}

export async function addUser(req,res){
try {

    const { _id, fullname, username, password,score } = req.body;
    const userToSave = { _id, fullname, username, password,score };
    const savedUser = await userService.save(userToSave);
    res.send(savedUser);
} catch (err) {
    loggerService.error(err);
    res.status(400).send("Couldn't save the data");
}
}


export async function updateUser(req,res){

    try {
        const { _id, fullname, username, password, score} = req.body;
        const userToSave = { _id, fullname, username, password,score };
        const savedUser = await userService.save(userToSave);
        res.send(savedUser);
    } catch (err) {
        loggerService.error(err);
        res.status(400).send("Couldn't save the data");
    }
}