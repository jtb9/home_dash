const newsAPIKey = '21ef90f50c9046c792ebc1abe2901822';
const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
var exec = require('child_process').exec;
const app = express();
const port = 8080;
var cors = require('cors')
const {
    Worker, isMainThread, parentPort, workerData,
  } = require('node:worker_threads');

function getState() {
    try {
        const buff = fs.readFileSync('state.json');

        return JSON.parse(buff);
    }
    catch(e) {
        console.log(e);
        return {}
    }
}

function setState(data) {
    fs.writeFile('state.json', JSON.stringify(data), () => {

    });
}


app.use(cors())

app.get('/data', function (req, res) {
    const state = getState();

    res.send(state);
});

// spawn our react server
var child = exec('cd dash && npx react-scripts start')

app.listen(port);

function loadArticles(state) {
    var url = 'https://newsapi.org/v2/top-headlines?' +
          'country=us&' +
          'apiKey=' + newsAPIKey;

    axios.get(url).then((data) => {
        setState({
            ...state,
            articles: data.data.articles
        })
    })
}

let iterationsSinceArticles = 0;
function runMainLoop() {
    setTimeout(() => {
        const state = getState();

        console.log('main monitor run');

        if (state.articles === undefined) {
            loadArticles(state);
        }
        else {
            iterationsSinceArticles += 1;

            if (iterationsSinceArticles >= 60) {
                iterationsSinceArticles = 0;

                loadArticles(state);
            }
        }

        runMainLoop();
    }, [5000])
}

runMainLoop();



