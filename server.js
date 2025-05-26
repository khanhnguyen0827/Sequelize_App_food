/*************  ✨ Windsurf Command ⭐  *************/
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
/*******  e2e5435d-a859-4bb4-b344-30385e655a38  *******/
