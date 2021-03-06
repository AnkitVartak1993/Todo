
require('./config');
var {mongoose} = require('./db/mongoose.js');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const {authenticate} = require('./middleware/authenticate.js');



var {User} =  require('./model/User.js');
var {Todo} = require('./model/Todo.js');
const port = process.env.PORT;

var app = express();
app.use(bodyParser.json());
app.post('/todos', authenticate, (req,res)=>{
    var todo = new Todo({
        text: req.body.text,
        creator: req.user._id
    });
    todo.save().then((doc)=>{
        res.send(doc);
    },(err)=>{res.status(400).send(err);});
});

app.get('/todos',authenticate, (req,res)=>{
    Todo.find({creator: req.user._id}).then((result)=>{
        res.send({result});
    },(err)=>{
        res.status(400).send(err);
    });
})

app.get('/todos/:id', authenticate, (req,res)=>{
        var id = req.params.id;
        if(!ObjectID.isValid(id)){
           return res.status(404).send();
        }
        else{
            Todo.findOne({
                _id: id,
                creator: req.user._id
            }).then((doc)=>{
                res.send({doc});
            }).catch((e)=>{res.status(400).send(e);});
        }
        //res.send(req.params);
});

app.delete('/todos/:id', authenticate, (req,res)=>{
        var id = req.params.id;
        if(!ObjectID.isValid(id)){
           return res.status(404).send();
        }
        else{
            Todo.findOneAndRemove({
                 _id: id,
                creator: req.user._id
            }).then((doc)=>{
                res.send({doc});
            }).catch((e)=>{res.status(400).send(e);});
        }
        //res.send(req.params);
});

app.patch('/todos/:id', authenticate, (req,res)=>{
    var id = req.params.id;
    var body = _.pick(req.body,['text','completed']);

    if(!ObjectID.isValid(id)){
           return res.status(404).send();
        }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }
    else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id:id, creator: req.user._id}, {$set:body}, {new: true}).then((doc)=>{
        if(!doc){
            return res.status(404).send();
        }
        res.send({doc});
    }).catch((e)=>{res.status(400).send();
    });
});

app.post('/users/',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    var user = new User(body);

    user.save().then(()=>{
        return user.generateAuthToken();
        //res.send(user);
    }).then((token)=>{
        res.header('x-auth', token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    });

});

app.get('/users/me/', authenticate ,(req,res)=>{
    res.send(req.user);
});

app.post('/users/login',(req, res) =>{
    var body = _.pick(req.body,['email','password']);
    User.findByCredentials(body.email,body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth', token).send(user);
        });
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

app.delete('/users/me/token', authenticate , (req,res)=>{
    req.user.removeToken(req.token).then(()=>{
       
        res.status(200).send();
    },()=>{res.status(400).send();})
});


app.listen(port,(err,success)=>{
    if (err)
    return console.log(err);
    console.log(`Server started successfuly on port ${port}`);
}) ;
