var mongoose = require('mongoose');

var Todo = mongoose.model('Todo',{
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    text:{
        type:String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed:{
        type: Boolean,
        default: false
    },
    completedAt:{
        type: Number,
        defualt: null
    }
});

module.exports = {
    Todo
}