var express = require('express');
var parser = require('body-parser');
var path = require('path');
var app = express();
var hone =require('ejs');
var multer =require('multer')
var upload =multer();

app.use(parser.json())
var bodyParser = require('body-parser');

app.use(upload.array()); 
app.use(express.static('public'));

app.engine('pug', require('pug').__express)

app.set('view engine', 'pug')
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: true }));
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb"

/* GET login page. */ 
app.get('/index', function(req, res, next) { 
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
  });
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mypug");
    dbo.createCollection("customers", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
    res.render('index'); 
}); 

app.get('/login', function(req, res, next) { 
  res.render('login'); 
}); 
 /* GET Signup */ 
app.post('/index',function(req,res,next){
  console.log(req.body.name ,req.body.email , req.body.pswd)
  var email1=req.body.email;
  var pswd1 =req.body.pswd; 
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mypug");
    var myobj = { name: req.body.name, email:req.body.email , password:req.body.pswd };
    dbo.collection("customers").find({email:email1,password:pswd1}).toArray(function(err, result) {
      if (err) throw err;
       if(result[0])
      {
        console.log("correct");
      }
     else{
      dbo.collection("customers").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
     }
    });
    
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mypug");
      var mysort = { name: 1 };
      dbo.collection("customers").find().sort(mysort).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.render('register',{title:"Register candidate",h1 :"Register candidate",p:JSON.stringify(result)})
        db.close();
      });
    });
  
  });

})
app.post('/login',function(req,res,next){
  var email=req.body.email;
  var pswd=req.body.psw;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mypug");
    dbo.collection("customers").find({email:email,password:pswd}).toArray(function(err, result) {
      if (err) throw err;
       if(result[0])
      {
        console.log("correct");
        res.render('register',{title:"Register candidate",h1 :"Register candidate",p:JSON.stringify(result)})
      }
      else{
        res.render('register',{title:"Wrong information",h1 :"Wrong information",p:"email-Id or password not match"})
      }
      db.close();
    });
  });

})

app.get('/',function(req,res)
{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mypug");
    dbo.collection("customers").drop(function(err, delOK) {
      if (err) throw err;
      if (delOK) console.log("Collection deleted");
      db.close();
    });
  });
})
app.listen(8000,function(){
    console.log('server running on port 8000');
})
