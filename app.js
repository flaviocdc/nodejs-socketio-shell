var express = require('express') 
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , spawn = require('child_process').spawn
  , carrier = require('carrier');

server.listen(8080);

app.use(express.logger());
app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {
//  socket.emit('news', { hello: 'world' });
  socket.on('run', function (data) {
    console.log(data);
    run(socket);
  });
});

function run(socket) {
  var proc = spawn('ls', ['-lh', '/usr']);
  console.log("spawned proc");

  carrier.carry(proc.stdout, function(line) {
    socket.emit('running', line);
  });

  proc.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  proc.on('close', function (code) {
    console.log('child process exited with code ' + code);
    socket.emit('finish', code);
  });
}
