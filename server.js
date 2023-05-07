if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index')

// const http = require('http');
// const fs = require('fs');
// const path = require('path');

//for what we need view engine??
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)

app.listen(process.env.PORT || 3000)


// const port = process.env.PORT || 3000;

// const server = http.createServer(function (req, res) {
//   console.log(`${req.method} request for ${req.url}`);

//   if (req.url === '/') {
//     const indexPath = path.join(__dirname, 'index.html');
//     const html = fs.readFileSync(indexPath, 'utf8');
//     res.setHeader('Content-type', 'text/html');
//     res.writeHead(200);
//     res.end(html);
//   } else {
//     res.writeHead(404, {'Content-type': 'text/plain'});
//     res.end('Page not found');
//   }
// });

// server.listen(port, function () {
//   console.log(`Server is listening on port ${port}`);
// });