const express = require('express')
const app = express()
const path = require('path');
const fs = require('fs');

const port = process.env.SERVE_PORT || 4500;
const dir = process.env.SERVE_DIR;

const directoryPath = path.join(dir);
fs.readdir(directoryPath, (err, paths) => {
    let files = paths.filter(x => (x.split(".").length == 2));
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    let html = `
    <!doctype html>
    <html lang="en">
    <head> <title>File server</title> </head>
    <body>
        <h2>${dir}</h2>
        <ul>
            ${files.map(x => `
                <li>
                    <a href = /${x} download>
                        ${x}
                    </a>
                </li>
            `).join("\n")}
        </ul>
    </body>
    </html>
    `

    app.use((req, res, next) => {
        console.log(`LOG: ${req.hostname} made request on: ${req.url}`);
        next();
    })

    app.get('/', (req, res) => {
        res.setHeader('content-type', 'text/html');
        res.send(html);
    })

    app.use(express.static(dir));
    
    app.listen(port, () => {
        console.log(`---\nServing files on path ${dir}\n`);
        console.log(`Server running on: http://localhost:${port}\n---\n`)
    })
});
