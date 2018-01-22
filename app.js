const express = require('express');
const app = express()
const fs = require('fs')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const formidable = require('formidable')

const port = process.env.PORT || 3000
app.set('port', port);

app.listen(port, () => console.log('listening on port ' + port))

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => res.redirect('/upload'))

app.get('/upload', (req, res) => {
    res.render('upload')
})

// Upload files handle
app.post('/upload', (req, res) => {

    // Formidable: https://www.npmjs.com/package/formidable
    const form = new formidable.IncomingForm();
    
    // Set Upload directory
    form.uploadDir = path.join(__dirname, `/public/uploads`)
    
    // Expect multiple files in a single input field
    form.multiples = true;
    
    // File Size Limit: 2MB (emits an error)
    form.maxFieldsSize = 2 * 1024 * 1024;

    form.on('file', function (field, file) {
        console.log(`File recieved: ${file.name}`)
        // Rename file
        fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
            if (err) console.error(err)
        });
    });

    // log any errors that occur
    form.on('error', (err) => console.error(err))

    // once all the files have been uploaded, send a success response to the client (200 <= statusCode <= 399)
    form.on('end', () => res.sendStatus(201))

    // parse the incoming request containing the form data
    form.parse(req);
})