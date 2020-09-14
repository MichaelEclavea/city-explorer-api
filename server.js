'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
require('dotenv').config();
const PORT = process.env.PORT;




// app.get('/location', handlerLocation);


// function handlerLocation(req, res) {
//     try {
//         let place = req.query.display_name;
//     } catch(error) {
//         response.status(500).send('Broken request');
//     }
// }




app.listen(PORT, () => {
    console.log('listening on PORT 3000');
});