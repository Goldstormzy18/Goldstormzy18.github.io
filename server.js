const http = require("http");
const fs = require("fs");
const url = require("url");

const server = http.createServer((req, res) => {
  // Read the HTML file
  if(req.url.substring(req.url.length - 1, req.url.length) === "/"){
    console.log(__dirname + req.url + "index.html");
    fs.readFile(__dirname + req.url + "index.html", "utf8", function(err, data){
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Error: 404 - File not found");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  }else if(req.url.substring(req.url.length - 5, req.url.length) === ".json"){
    console.log(__dirname + req.url);
    fs.readFile(__dirname + req.url, "utf8", function(err, data){
      if (err) {
        res.writeHead(500);
        res.end("Error: 500 - JSON file not found");
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(data);
      }
    });
  }else if(req.url.substring(req.url.length - 4, req.url.length) === ".css"){
    console.log(__dirname + req.url);
    fs.readFile(__dirname + req.url, "utf8", function(err, data){
      if (err) {
        res.writeHead(500);
        res.end("Error: 500 - Css File not found");
      } else {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(data);
      }
    });
  }else if(req.url.substring(req.url.length - 4, req.url.length) === ".png"){
    console.log(__dirname + req.url);
    fs.readFile(__dirname + req.url, function(err, data){
      if (err) {
        res.writeHead(500);
        res.end("Error: 500 - Image file not found");
      } else {
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end(data);
      }
    });
  }else if(req.url.substring(req.url.length - 4, req.url.length) === ".jpg"){
    console.log(__dirname + req.url);
    fs.readFile(__dirname + req.url, function(err, data){
      if (err) {
        res.writeHead(500);
        res.end("Error: 500 - Image file not found");
      } else {
        res.writeHead(200, { "Content-Type": "image/jpg" });
        res.end(data);
      }
    });
  }else if(req.url.substring(req.url.length - 3, req.url.length) === ".js"){
    console.log(__dirname + req.url);
    fs.readFile(__dirname + req.url, "utf8", function(err, data){
      if (err) {
        res.writeHead(500);
        res.end("Error: 500 - JavaScript file not found");
      } else {
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(data);
      }
    });
  }else if(req.url.substring(req.url.length - 4, req.url.length) === ".txt"){
    console.log(__dirname + req.url);
    fs.readFile(__dirname + req.url, "utf8", function(err, data){
      if (err) {
        res.writeHead(500);
        res.end("Error: 500 - Text file not found");
      } else {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(data);
      }
    });
  }else{
    console.log(" - Error");
    console.log(__dirname + req.url + " - Error");

  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});