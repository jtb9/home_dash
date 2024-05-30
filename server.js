const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
var exec = require('child_process').exec;
const app = express();
const port = 8080;
var cors = require('cors')
const si = require('systeminformation');

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const {
    Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

function getState() {
    try {
        const buff = fs.readFileSync('state.json');

        return JSON.parse(buff);
    }
    catch (e) {
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

function loadWeather(state) {
    var url = 'https://api.tomorrow.io/v4/weather/forecast?location=42.3478,-71.0466&apikey=' + WEATHER_API_KEY;

    axios.get(url, {
        headers: {
            'accept': "application/json"
        }
    }).then((data) => {
        try {
            si.cpuTemperature()
                .then(cpuData => {
                    weather.cpuTemp = cpuData.main;

                    setState({
                        ...state,
                        weather: data.data.timelines.daily[0].values
                    })
                })
                .catch(error => console.error(error));

        }
        catch (e) {
            console.error(e);
        }
    })
}

function loadArticles(state) {
    var url = 'https://newsapi.org/v2/top-headlines?' +
        'country=us&' +
        'apiKey=' + NEWS_API_KEY;

    axios.get(url).then((data) => {
        setState({
            ...state,
            articles: data.data.articles
        })
    })
}

let iterationsSinceArticles = 0;
let iterationsSinceWeather = 0;
function runMainLoop() {
    setTimeout(() => {
        const state = getState();

        console.log('main monitor run');

        if (state.weather === undefined) {
            loadWeather(state);
        }
        else {
            iterationsSinceWeather += 1;

            if (iterationsSinceWeather >= 20) {
                iterationsSinceWeather = 0;

                loadWeather(state);
            }
        }

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



