
var Budget=require('../models/budget.js');
var Transactions=require('../models/transactions.js');

module.exports=function(app){
  app.get("/data/budgetlist",function(req,res){
      console.log('heree');
      Budget.find(function(err,ret){
          if(err)
            res.send(err);
          res.json(ret);
      });
  }); 
    app.get("/partials/*", function(req, res) {
        console.log('here');
        res.render("../../public/app/templates/" + req.params[0]);
    }); 


//have to set up static routing to our public directory for stylus config

//catchall route
app.get('*',function(req,res){
    //testing mongo, add mongoMessage
    res.render('index');
});
} ;