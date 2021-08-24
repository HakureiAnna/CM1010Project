/**************************************************************
 * File: index.js
 * Description: Minimalistic express server used for bypassing 
 * CORS.
 * Author: Liu Anna
 **************************************************************/

const express = require('express');
const axios = require('axios');

const app = express();
// allow static file loading from public/ folder
app.use(express.static('public', {
    extensions: ['csv', 'html', 'js', 'css']
}));

// set port used
const port = 5555;

// actual CORS bypass
app.get('/load', (req, res) => {    
    var uri = req.query.uri;
    axios.get(uri, {responseType: 'blob'})
    .then(data => {
        res.status(200).send(data.data);
    })
    .catch(err => {
        res.status(200).send(err.data)
    });
});

// run express server
var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("running at http://%s:%s", host, port);
})