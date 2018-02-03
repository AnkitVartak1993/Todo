var {mongoose} = require('./db/mongoose.js');
var express = require('express');
var bodyParser = require('body-parser');


var {User} =  require('./model/User.js');
var {Todo} = require('./model/Todo.js');

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

app.listen(3000,(err,success)=>{
    if (err)
    return console.log(err);
    console.log('Server started successfuly');
}) ;


