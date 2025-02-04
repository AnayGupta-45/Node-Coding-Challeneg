const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {
    let filePath = "";
    
    if (req.url === "/" || req.url === "/index.html") {
        filePath = path.join(__dirname, "public", "index.html");
        serveStaticFile(res, filePath, "text/html");
    } else if (req.url === "/style.css") {
        filePath = path.join(__dirname, "public", "style.css");
        serveStaticFile(res, filePath, "text/css");
    } else if (req.url === "/script.js") {
        filePath = path.join(__dirname, "public", "script.js");
        serveStaticFile(res, filePath, "application/javascript");
    } else if (req.url === "/questions") {
        filePath = path.join(__dirname, "questions.json");
        serveStaticFile(res, filePath, "application/json");
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
});

function serveStaticFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Server Error");
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf-8");
        }
    });
}

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
