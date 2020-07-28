var express = require('express');
var parser = require('body-parser');
var path = require('path');
var app = express();
var multer = require('multer');
var upload = multer();
var hone =require('ejs');
app.use(parser.urlencoded({ extended: true }))
app.use(parser.json())
//var bodyParser = require('body-parser');
// app.use(function(req,res,next){
//     res.locals.userValue = null;
//     next();
// })
// app.engine('ejs', require('ejs').renderFile)
// app.set('view engine','ejs');
// app.set('views',path.join(__dirname,'views'))
// app.set('view options', {
//     layout: false
// });

// for parsing application/xwww-
//app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

app.engine('pug', require('pug').__express)

app.set('view engine', 'pug');
app.set('views', './views');

var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    secure: false,
    auth: {
        user: "arunmehtajkg@gmail.com",
        pass: "Rohit@1234"
    }
});


app.get('/', function(req, res, next) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log("Database created!");
        db.close();
      });
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("myemail");
        dbo.createCollection("customers", function(err, res) {
          if (err) throw err;
          console.log("Collection created!");
          db.close();
        });
      });
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("myemail");
        dbo.createCollection("customers1", function(err, res) {
          if (err) throw err;
          console.log("Collection created!");
          db.close();
        });
      });
    res.render('home1234', { error: false });
});

app.post('/',function(req,res){
    console.log(req.body.name)
    var email=req.body.email.split(',');
    var myobj={name:req.body.name,email:req.body.email}
    console.log(myobj)
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("myemail");
        dbo.collection("customers").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });
      var lengthOfEmail=email.length;
      link ="http://localhost:8000/suggestion";
    for(var i=0;i<lengthOfEmail;i++)
    {
      mailOptions = {
        to: email[i],
        subject: "Please confirm your Email account",
        html: "Hello<br><p>please click to the link for giving your suggestion for this topic <h1>"+req.body.topic+"</h1><br> "+link +"</p>"
    }
    smtpTransport.sendMail(mailOptions, function (err, data) {
        if (err) {
            res.send("error");
        } else {
            return}
        })
    }
})
app.get("/1",function(req,res){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("myemail");
        dbo.dropCollection("customers", function(err, delOK) {
          if (err) throw err;
          if (delOK) console.log("Collection of sending email is deleted");
          db.close();
        });
      });
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("myemail");
        dbo.dropCollection("customers1", function(err, delOK) {
          if (err) throw err;
          if (delOK) console.log("Collection of suggestion deleted");
          db.close();
        });
      });

    });    
app.get("/suggestion",function(req, res, next) {
  res.render('users', { error: false });
})
app.post("/suggestion",function(req, res){
  console.log(req.body.email);
  var honey={name:req.body.name,email:req.body.email,topic:req.body.topic}
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("myemail");
    dbo.collection("customers1").insertOne(honey, function(err, res) {
      if (err) throw err;
      console.log("1 suggestion inserted");
      db.close();
    });
  });  
});
app.listen(8000,function(){
    console.log('server running on port 8000');
});
