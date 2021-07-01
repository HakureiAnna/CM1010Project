const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.static('public', {
    extensions: ['csv', 'html', 'js', 'css']
}));

const port = 5500;

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

var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("running at http://%s:%s", host, port);
})