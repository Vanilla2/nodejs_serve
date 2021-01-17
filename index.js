const express = require('express')
const app = express()
const path = require('path');
const fs = require('fs');

const port = process.env.SERVE_PORT || 4500;
const dir = process.env.SERVE_DIR;
const type = process.env.TYPE;
const directoryPath = path.join(dir);

const solveStatic = () => {
    app.get('*', (req, res) => {
        fs.readFile(`${dir}${req.url}`, (err, data) => {
            if (err) {
                res.write("file not found.");
                return res.end();
            }
            res.writeHead(200);
            res.write(data);
            return res.end();
        })
    });
}

const static = (files) => {
    let html = `
    <!doctype html>
    <html lang="en">
    <head> <title>File server</title> </head>
    <body>
        <h2>${dir}</h2>
        <ul>
            ${files.map(x => `
                <li>
                    <a href = /${encodeURI(x)} download>
                        ${x}
                    </a>
                </li>
            `).join("\n")}
        </ul>
    </body>
    </html>
    `
    app.get('/', (req, res) => {
        res.setHeader('content-type', 'text/html');
        res.send(html);
    })
    solveStatic();
};
const website = (files) => {
    app.get('/', (req, res) => {
        fs.readFile(`${dir}/index.html`, (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        })
    })
    solveStatic();
}

fs.readdir(directoryPath, (err, paths) => {
    let files = paths.filter(x => (x.split(".").length == 2));

    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    app.use((req, res, next) => {
        console.log(`[LOG]: ${req.hostname} made request on: ${req.url}`);
        next();
    })

    if (type === "static")
        static(files);
    else
        website(files);
    
    app.listen(port, () => {
        console.log(`---\nServing files on path ${dir}\n\nServer running on: http://localhost:${port}\n\nServer type is: ${type}\n\n${type==="static" ? "Static files are listed on /": "index.html is served on / and the other static files keep their location"}\n---`);
    })
});
