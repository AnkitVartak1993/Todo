var {mongoose} = require('./db/mongoose.js');
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {User} =  require('./model/User.js');
var {Todo} = require('./model/Todo.js');
const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());
app.post('/todos', (req,res)=>{
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc)=>{
        res.send(doc);
    },(err)=>{res.status(400).send(err);});
});

app.get('/todos', (req,res)=>{
    Todo.find().then((result)=>{
        res.send({result});
    },(err)=>{
        res.status(400).send(err);
    });
})

app.get('/todos/:id',(req,res)=>{
        var id = req.params.id;
        if(!ObjectID.isValid(id)){
           return res.status(404).send();
        }
        else{
            Todo.findById(id).then((doc)=>{
                res.send({doc});
            }).catch((e)=>{res.status(400).send(e);});
        }
        //res.send(req.params);
});

app.delete('/todos/:id',(req,res)=>{
        var id = req.params.id;
        if(!ObjectID.isValid(id)){
           return res.status(404).send();
        }
        else{
            Todo.findByIdAndRemove(id).then((doc)=>{
                res.send({doc});
            }).catch((e)=>{res.status(400).send(e);});
        }
        //res.send(req.params);
});

app.listen(port,(err,success)=>{
    if (err)
    return console.log(err);
    console.log(`Server started successfuly on port ${port}`);
}) ;


