const http = require('http')
const fs = require('fs')

const server = http.createServer((request, response) => {
    let html = fs.readFileSync(__dirname + '/index.html')
    response.end(html)
}
)

server.listen(443, () => {
    console.log('sevrer on !')
}
)
