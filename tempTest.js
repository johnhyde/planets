var express = require('express');    //Express Web Server 
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation

var app = express();
app.use(busboy());
app.use(express.static(__dirname));

/* ========================================================== 
Create a Route (/upload) to handle the Form submission 
(handle POST requests to /upload)
Express v4  Route definition
============================================================ */
app.route('/upload')
    .post(function (req, res, next) {
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);

            //Path where image will be uploaded
            var path = __dirname + '/uploads/' + filename;
            fstream = fs.createWriteStream(path);
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);              
                res.end(getHTML(path));        //where to go next
            });
        });
    });

var server = app.listen(3030, function() {
    console.log('Listening on port %d', server.address().port);
});

function getHTML(path)
{
    while (path.indexOf(' ') != -1)
    {
        var index = path.indexOf(' ');
        path = path.substring(0, index) + '%20' + path.substring(index + 1, path.length);
    }
    var html = '<html lang="en" ng-app="APP"><head><meta charset="UTF-8"><title>angular file upload</title></head><body><form method="post" action="http://localhost:3030/upload" enctype="multipart/form-data">Upload Image:<input type="file" name="fileUploaded"><input type="submit"></form><img src="' + path.substring(path.indexOf('uploads')) + '"></body></html>';
    
    return html;
}