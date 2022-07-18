const express = require('express');
const dotenv = require('dotenv');

// Add own file and model //
dotenv.config();
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());

// Import required Files //
const mainRouter = require('./src/routers');

// Added new API // 
app.use('/api/todo', mainRouter);


app.listen(port, () => console.log(`PWC_Test app listening on port ${port}!`))