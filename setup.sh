#!/bin/bash
npm install express axios cors --save
cd dash
npm install
npx react-scripts build
npm install -g server
