// const http = require('http');
// const fs = require('fs');
const express = require('express');


const app = express();
const PORT = process.env.PORT | 9000;


// const server = http.createServer((request, response) => {
//     let html = fs.readFileSync(__dirname + '/index.html')
//     response.setHeader('content-type', 'text/html;charset=utf-8');
//     response.end(html);
// }
// );

// server.listen(9000, () => {
//     console.log('sevrer on !');
// }
// );

app.listen(PORT,()=>console.log(`Srver is running on port ${PORT}`));