const express = require('express');
const router = express.Router();

// Import Files //
const { getToDoData, findOne, createData, updateTodo, writeFile } = require('../controllers/todo')

// Get All todo List
router.get('/list', async (_, res) => {
    try {
        const response = await getToDoData();
        res.status(200).send({data: response, error: {}});
    } catch (error) {
        console.log(error );
        res.status(500).send("Internal Server Errro")
    }
});

// Get All todo List By sort
router.get('/sort', async (_, res) => {
    try {
        const todoList = await getToDoData();
        const response = todoList.sort((a,b) => a - b);
        res.status(200).send({data: response, error: {}});
    } catch (error) {
        console.log(error );
        res.status(500).send("Internal Server Errro")
    }
});

// Get By ID 
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const response = await findOne(id);
        if (response) {
            res.status(200).send({data: response, error: {}});
        } else {
            res.status(404).send({data: {}, error: {message: "Data Not found !"}});
        }
        
    } catch (error) {
        console.log(error );
        res.status(500).send("Internal Server Errro")
    }
});

// Create Doc //
router.post('/add', async (req, res, next) => {
    try {
        console.log(" beginning of POST/add");
        const response = await createData(req.body);
        res.status(200).send({data: response, error: {}});
    } catch (error) {
        console.log(" Error of POST/add : " + error);
        res.status(500).send("Internal Server Errro")
    }
});

// Update Api 
router.put('/update/:id', async (req, res, next) => {
    try {
        console.log(" beginning of PUT/update");
        const id = parseInt(req.params.id);
        const checkData = await findOne(id);
        if (checkData) {
            const response = await updateTodo(id, req.body);
            res.status(200).send({data: response, error: {}});
        }
        res.status(404).send({data: {}, error: {message: "Data Not found !"}});
    } catch (error) {
        console.log(" Error of PUT/update : " + error);
        res.status(500).send("Internal Server Errro")
    }
});

// Delete Data //
router.delete('/delete/:id', async (req, res) => {
    try {
        console.log(" beginning of Delete/delete");
        const id = parseInt(req.params.id);
        const checkData = await findOne(id);
        if (checkData) {
            const todoList = await getToDoData();
            const filterdata = todoList.filter((todo) => todo.id !== id );
            await writeFile(filterdata);
            res.status(200).send({data: {message: `Data deleted ${id}`}, error: {}});
        }
        res.status(404).send({data: {}, error: {message: "Data Not found !"}});
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});





module.exports = router;
