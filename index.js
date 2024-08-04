const chokidar = require('chokidar');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

function ejsLiveReload(app, dir) {
  const io = socketIo(app);
  const watcher = chokidar.watch(path.join(dir, '**/*.ejs'), {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });

  watcher.on('change', (path) => {
    console.log(`File ${path} has been changed`);
    io.emit('reload');
  });

  // Inject the client-side script
  app.use((req, res, next) => {
    const originalRender = res.render;
    res.render = function(view, options, callback) {
      originalRender.call(this, view, options, (err, html) => {
        if (err) return callback(err);
        
        const script = `
          <script src="/socket.io/socket.io.js"></script>
          <script>
            const socket = io();
            socket.on('reload', () => {
              window.location.reload();
            });
          </script>
        `;
        
        html = html.replace('</body>', script + '</body>');
        callback(null, html);
      });
    };
    next();
  });
}

module.exports = ejsLiveReload;