const newsAPIKey = '21ef90f50c9046c792ebc1abe2901822';
const express = require('express');
const path = require('path');
const axios = require('axios');
var exec = require('child_process').exec;
const app = express();
const port = 8080;
var cors = require('cors')

app.use(cors())

app.get('/data', function (req, res) {
    var url = 'https://newsapi.org/v2/everything?' +
        'q=Apple&' +
        'from=2024-05-26&' +
        'sortBy=popularity&' +
        'apiKey=' + newsAPIKey;

        url = 'https://newsapi.org/v2/top-headlines?' +
          'country=us&' +
          'apiKey=' + newsAPIKey;

    var req = new Request(url);

    axios.get(url).then((data) => {
        console.log(data.data);
        res.send(data.data);
    })
});

// spawn our react server
var child = exec('cd dash && npx react-scripts start')

app.listen(port);
