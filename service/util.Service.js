import fs from 'fs';


export const utilService = {
    readJsonFile,
    makeId
}

function makeId(length = 5) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

function readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    return json
}






// export async function readJsonFile(path) {
//     const str = await fs.readFile(path, 'utf8');
//     return JSON.parse(str);
// }


