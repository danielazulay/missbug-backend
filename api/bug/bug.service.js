import fs from 'fs';
import { utilService } from '../../service/util.Service.js'

const bugs =  utilService.readJsonFile("./data/data.json")


export const bugService = {
    query,
    queryById,
    remove,
    save
}

async function query(filterBy){

    let localBugs = bugs

    try{
        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i');
            localBugs = localBugs.filter(bug => regExp.test(bug.title));
        }
        if(filterBy.owner){
            localBugs =   localBugs.filter((bug)=>bug.owner._id === filterBy.owner)
       }

        if(filterBy.severity){
             localBugs =   localBugs.filter((bug)=>bug.severity === filterBy.severity)
        }
        if(filterBy.labels){
             localBugs =   localBugs.filter(bug=> bug.labels &&  bug.labels.includes(filterBy.labels))
        }
    if (filterBy.sortBy) {
            const sortDir = filterBy.sortDir === '-1' ? -1 : 1;
            localBugs.sort((a, b) => {
                if (a[filterBy.sortBy] > b[filterBy.sortBy]) return sortDir;
                if (a[filterBy.sortBy] < b[filterBy.sortBy]) return -sortDir;
                return 0;
            });
        }
        if (filterBy.pageIdx) {
            // const page = filterBy.pageIdx * 3;

            // // Create a copy of the array
            // const newArray = [...localBugs];
    
            // // Calculate the start index for slicing
            // const start = page - 3;
            // const end = page;
    
            // // Return the sliced portion of the array
            // return newArray.slice(start, end);
            let page =filterBy.pageIdx*3


            return  localBugs.slice(page-3,page)
            
        }

        return localBugs
    }catch(err){    
        console.log(err)    
        throw err
    }
}

 function queryById(bugId){
    try{
        const bug =   bugs.find((bug)=>bug._id === bugId)
        if (!bug) throw 'condt find this bug'
        return bug

    }catch(err){    
        console.error(err)    
        throw err
    }
}

 function remove(bugId,loggedinUser){
    try{
        
        const bugIndex =  bugs.findIndex((bug)=>bug._id === bugId)
        const bug = queryById(bugId)

        if (!bugIndex) throw 'condt find this bug'
        if(bug.owner._id !== loggedinUser._id)throw 'not allowed to delete'
  
            bugs.splice(bugIndex, 1)
            return _saveBugsToFile()
        


    }catch(err){    
        console.error(err)    
        throw err
    }
}

 async function save(bugTosave,loggedinUser){
    try {

        
        if (bugTosave._id) { 
       
       

            const idx  = bugs.findIndex(bug => bug._id === bugTosave._id);

            if(bugs[idx].owner._id !== loggedinUser._id)throw 'not allowed'

            if (idx === -1) throw `Couldn't find bug with _id ${bugId}`
            bugs.splice(idx, 1, {...bugs[idx] ,...bugTosave})
        } else {
            bugTosave._id = utilService.makeId();
            bugTosave.createdAt = Date.now()
            bugTosave.owner = loggedinUser

            bugs.push(bugTosave);
        }
        await  _saveBugsToFile(`./data/data.json`);

        return bugTosave
    } catch (err) {
        console.error(err);
        res.status(400).send("Couldn't save the data");
    }
}




function _saveBugsToFile(path = './data/data.json') {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}