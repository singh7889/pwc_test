// const uuid = require('uuid');
const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'helper/data/todo_list.json');


async function getToDoData() {
    const jsonData = fs.readFileSync(dirPath, 'utf-8');
    console.log(jsonData);
    return JSON.parse(jsonData)   
}

async function findOne(id) {
    const jsonData = fs.readFileSync(dirPath, 'utf-8');
    const parseData = JSON.parse(jsonData) 
    const response = parseData.filter(e => {
        if (e.id == id) {
            return e
        }
    });  
    return response[0];
}

// Create Data 
async function createData(body) {
    // Add function and uniq Id and create data
    // genarate uniq ID 
    const id = uuid();
    const paylode = {
        id: id,
        titel: body.titel,
        created: new Date()
    }
    let todoData = JSON.parse(fs.readFileSync(dirPath, 'utf8'));
    let todos = [...todoData];
    todos.push(paylode);
    fs.writeFileSync(dirPath, JSON.stringify(todos));
    return paylode;
}

async function updateTodo(id, data) {
    let todoListData = await getToDoData();
    const findOne = todoListData.filter(e => {
        // Check data in json and update 
        if (e.id == id) {
            e.titel = data.titel
            return e
        }
    });
    let todos = [...todoListData];
    writeFile(todos);
    return findOne
}

function writeFile(data) {
    fs.writeFileSync(dirPath, JSON.stringify(data));
}
function uuid() {
    const id = Math.floor(new Date().valueOf() * Math.random())
    return id
}


module.exports = {
    getToDoData,
    findOne,
    createData,
    updateTodo,
    writeFile
}