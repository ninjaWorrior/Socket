var express = require('express');
var parser = require('body-parser');
var path = require('path');
var app = express();
var hone =require('ejs');
app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())
 
app.use(function(req,res,next){
    res.locals.userValue = null;
    next();
})
 
app.set('view engine','ejs');
//app.set('views',path.join(__dirname,'views'))
app.set('view options', {
    layout: false
});

app.get('/',function(req,res){
    console.log("work")
    res.render('./home1234.ejs',{
        topicHead : 'Student Form',
    });
    console.log('user accessing Home page');
});
app.post('/student/add',function(req,res){
    var student = {
        first : req.body.fname,
        last : req.body.lname
    }
    console.log(student);
    res.render('home1234',{
        userValue : student,
        topicHead : 'Student Form'
    });
    //res.json(student);
     
});
app.listen(8000,function(){
    console.log('server running on port 8000');
})