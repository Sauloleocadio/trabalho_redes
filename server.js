// Iniciando servidor HTTP
var app = require("http").createServer(index),
  io = require("socket.io").listen(app),
  fs = require("fs");

//Conexão da porta  
app.listen(3000, function() {
  console.log("Servidor rodando!");
});

//Função passando requisições e as repostas
function index(req, res) {
  var arquivo = "";
  if(req.url == "/"){
      arquivo = __dirname + '/index.html';
  }else{
      arquivo = __dirname + req.url;
  }
  fs.readFile(arquivo,
      function (err, data) {
           if (err) {
                res.writeHead(404);
                return res.end('Error 404 NOT FOUND');
           }

           res.writeHead(200);
           console.log("Requisição 200 está funcionando")
           res.end(data);
      }
  );
}
// Iniciando Socket.IO
var visitas = 0;

// Evento connection ocorre quando entra um novo usuário.
io.on("connection", function(socket) {
  // Incrementa o total de visitas no site.
  visitas++;

  // Envia o total de visitas para o novo usuário.
  socket.emit("visits", visitas);

  // Envia o total de visitas para os demais usuários.
  socket.broadcast.emit("visits", visitas);

  // Evento disconnect ocorre quando sai um usuário.
  socket.on("disconnect", function() {
    visitas--;

    // Atualiza o total de visitas para os demais usuários.
    socket.broadcast.emit("message", visitas);
  });
});
