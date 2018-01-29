var express= require('express');
var stylus=require('stylus');
var logger=require('morgan');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
//environment variable to tell with in dev or prod mode
//assigning a default value into NODE_ENV if it hasn't been assigned already
var env=process.env.NODE_ENV=process.env.NODE_ENV||'development';

//create express application
var app=express();

function compile(str,path){
    return stylus(str).set('filename',path);
}

app.set('views',__dirname+'/server/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(logger('dev'));

//for stylus . Config stylus middleware
app.use(stylus.middleware({
src:__dirname+'/public',
compile:compile
}));


//this tells express that anytime a request come into the public directory that 
//matches to a file in the public directory, go ahead and server up that file
app.use(express.static(__dirname+'/public'));
//mongoose.connect('mongodb://localhost/Spendtracker2018');
if (env==='development'){
    
    mongoose.connect('mongodb://localhost/Spendtracker2018');
}
else{
mongoose.connect('mongodb://kicklive:spendtracker@ds117858.mlab.com:17858/spendtracker2018');
}
console.log(process.env.NODE_ENV);

var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error...'));
db.once('open',function callback(){
    console.log('Spendtracker2018 db open');
});

//create a schema for Mongoose, even though mongo is schemaless, mongoose uses schemas
//this a test schema being created
var messageSchema=mongoose.Schema({message: String});

//next, have to create the model based on the schema
var Message=mongoose.model('Message',messageSchema);
var mongoMessage;
Message.findOne().exec(function(err, messageDoc){
   // console.log(Message);
    mongoMessage=messageDoc.message;
});


//server side route for the partials files
app.get('/partials/:partialPath',function(req, res){
    res.render('partials/'+req.params.partialPath);
})

//have to set up static routing to our public directory for stylus config

//catchall route
app.get('*',function(req,res){
    //testing mongo, add mongoMessage
    res.render('index',{mongoMessage:mongoMessage});
});


//if port not set, set it to 3333. Using Heroku, port 80 is used. So
//get the environment port, or any port you set (local, unknown port)
var port=process.env.PORT ||3333;
app.listen(port);
console.log('Server started. Listning on port '+port);
