var express=require('express');
var app=express();

const MongoClient=require('mongodb').MongoClient;
let server=require('./server');
let middleware=require('./middleware');
let config=require('./config');
const { connect } = require('mongodb');
const url='mongodb://127.0.0.1:27017';
const dbName='hospitalManagement';
const bodyParser=require('body-parser');
//let jwt = require('jsonwebtoken');
//const middleware=require('middleware');
let db;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ type: 'application/json' }))

MongoClient.connect(url,{useUnifiedTopology: true},(err,client)=>{
    if(err) return console.log(err);

    db=client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database: ${dbName}`);
});
//Fetching hospital Details
app.get('/h',middleware.checkToken,(req,res)=>{
    
    db.collection('hospitals').find().toArray(function(err,result){
        console.log("FETCHING HOSPITALS' DETAILS");
        if(err) return console.log(err);;
        res.send(result);
    });
        
});
//Fetching ventilator details
app.get('/v',middleware.checkToken,(req,res)=>{
    db.collection('ventilators').find().toArray(function(err,result){
        console.log("FETCHING VENTILATORS' DETAILS");
        if(err) return console.log(err);;
        res.send(result);
    });

});
//Searching ventilator by status
app.post('/st',middleware.checkToken,(req,res)=>{
    var oc=req.body.status;
    console.log(oc);
    var col=db.collection('ventilators').find({"status":oc}).toArray(function(err,result){
        //if(err) return console.log(err);;
        res.json(result);
    });

});
//Searching ventilator by hospital name

app.post('/hn',middleware.checkToken,(req,res)=>{
    var hc=req.query.name;
    console.log(hc);
    var hl=db.collection('ventilators').find({"name":hc}).toArray(function(err,result){
        //if(err) return console.log(err);;
        res.json(result);
    });

});

//Searching Hospital by name
app.post('/vn',middleware.checkToken,(req,res)=>{
    var na=req.query.name;
    console.log(na);
    var vd=db.collection('hospitals').find({"name":na}).toArray(function(err,result){
        //if(err) return console.log(err);;
        res.json(result);
    });

});

//Updating the ventilator details
app.put('/up',middleware.checkToken,(req,res)=>{
    var vd={ventilatorid:req.body.ventilatorid};
    console.log(vd);
    var newValues={ $set :{status:req.body.status}};
    db.collection('ventilators').updateOne(vd,newValues,function(err,result){
        console.log("updated");
        res.json("updated");
        if(err) throw err;
    });

});

//Adding new ventilator to ventilators collection
app.post('/addvd',middleware.checkToken,(req,res)=>{
    var hid=req.body.Hid;
    var vid=req.body.ventilatorid;
    var s=req.body.status;
    var n=req.body.name;
    var newVen={Hid:hid,ventilator:vid,status:s,name:n};
    //console.log(na);
    db.collection('ventilators').insertOne(newVen,function(err,result){
        console.log("inserted");
        res.json("inserted");
        if(err) throw err;
    });

});

//deleting ventilator by ventilator id
app.delete('/del',middleware.checkToken,(req,res)=>{
    var d=req.body.ventilatorid;
    console.log(d);
    var query={ventilatorid:d};
    db.collection('ventilators').deleteOne(query,function(err,obj){
        console.log("deleted");
        res.json("deleted");
        if(err) throw err;
    });
});

app.listen(3000);

  

