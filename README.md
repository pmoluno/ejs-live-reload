# ejs-live-reload

A Node.js module that automatically reloads the browser when EJS file content changes.

## Installation

```
npm install ejs-live-reload
```

## Usage

```javascript
const express = require('express');
const ejsLiveReload = require('ejs-live-reload');

const app = express();
const server = require('http').createServer(app);

// Set up EJS
app.set('view engine', 'ejs');

// Use ejs-live-reload
ejsLiveReload(server, __dirname + '/views');

// Your routes and other middleware
app.get('/', (req, res) => {
  res.render('index');
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

Make sure to pass the server object (not the Express app) to the ejsLiveReload function.

## How it works

This module uses chokidar to watch for changes in your EJS files and socket.io to communicate with the browser. When an EJS file is modified, it sends a message to the browser to trigger a reload.

