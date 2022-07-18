// A To-do-List server side faciliates the following:
// 1.adding on to list 
// 2.Deleting from list
// 3.Get all list elements
// 4.Get list By ID
// 5.Sort List
// 6.Update a todo

// For the Above functionality create a server Side with following endpoints:

// 1./add -->this call will add onto a todo list
// 2./delete --> this endpoint will delete the element from lists(By ID) (you can send the ID in URI/query params)
// 3./update --> this endpoint will update the elment by ID.
// 4./list --> this end point will fetch todos
// 5
// 5. /sort --> this will sort the list in server side and return sorted element(default will be descending)

// Create a local JSON file as a mock DB.perform above operations on it

const express = require("express");
const uuid = require('uuid');
const fs = require('fs');

// import files 
var todoListPath = './todo_list.json';
// 
const port =  3000;
const app = express();

app.use(express.json());

app.get('/todo/list', (_, res) => {
    console.log("In Get API");
    try {
        const response = getToDoData();
        res.status(200).send({data: response, error: {}});
    } catch (error) {
        console.log(error );
        res.status(500).send("Data not Found")
    }
})

app.get('/todo/:id', (req, res) => {
    console.log("Find By Id");
    try {
        const id = req.params.id;
        const todoList = getToDoData();
        if (!todoList || !id) {
            res.status(404).send("Data not Found")
        }else {
            const response = todoList.filter(e => {
                if (e.id == id) {
                    return e
                }
            });
            console.log("response" , response.length);
            if (response.length <= 0) {
                res.status(404).send("Data not Found")
            }
            res.status(200).send({data: response, error: {}});
        }
    } catch (error) {
        console.log(error );
        res.status(500).send("Data not Found")
    }
    
})

app.post('/todo/add', async (req, res) => {
    console.log("In Post API  ");
    try {
        const body = req.body;
        if (!body) {
            res.status(201).send("body data is req")
        }
        const response = await createData(body);
        res.status(200).send(response);
    } catch (error) {
        console.error("Error :", error);
        res.status(500).send("Internal Server Error");
    }
})

app.put('/todo/update/:id', async (req, res) => {
    console.log("In Update Doc ");
    try {
        const id = req.params.id;
        const body = req.body;
        const response = await updateData(id, body);
        res.status(200).send({data: response, error: {}});
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

app.delete('/todo/delete/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let todoList = getToDoData();
        if(todoList.filter(todo => todo.id == id).length !== 0){
            todoList = todoList.filter(todo => todo.id !== id);
            res.status(200).send({data: {message: `Data deleted ${id}`}, error: {}});
        }else{
            res.status(404).send({data: {},error: {massage: "Data Not Found"}});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

// Create Data 
async function createData(body) {
    // Add function and uniq Id and create data
    // genarate uniq ID 
    const id = uuid.v1();
    const paylode = {
        id: id,
        titel: body.titel,
        created: new Date()
    }
    let todoData = JSON.parse(fs.readFileSync('todo_list.json', 'utf8'));
    let todos = [...todoData];
    todos.push(paylode);
    fs.writeFileSync('todo_list.json', JSON.stringify(todos));
    return paylode;
}


async function updateData(id, body) {
    let todoListData = await getToDoData();
    const findOne = todoListData.filter(e => {
        // Check data in json and update 
        if (e.id == id) {
            e.titel = body.titel
            return e
        }
    });
    let todos = [...todoListData];
    fs.writeFileSync('todo_list.json', JSON.stringify(todos));
    return findOne
}

const getToDoData = () => {
    const jsonData = fs.readFileSync(todoListPath, 'utf-8');
    console.log(jsonData);
    return JSON.parse(jsonData)   
}



app.listen(port , () => {
    console.log("Server is running on port : 3000")
})
