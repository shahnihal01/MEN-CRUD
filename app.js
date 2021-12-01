const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Task = require('./models/tasks');
 
const app = express();

const dbURI = "mongodb+srv://boi2k:shah300589@cluster0.q3pwb.mongodb.net/MongoDBMiniProject?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

app.get('/',(req,res)=>{
    Task.find().sort()
    .then(result=>{
        res.render('tasks/index',{title: 'All Tasks', tasks: result});
    })
    .catch((err)=>{
        console.log(err);
    });
});

app.get('/tasks/create',(req,res)=>{
    res.render('tasks/create',{title: "Create a Task"})
});

app.post('/',(req,res)=>{
    console.log(req.body);
    try{
        const newtask = new Task({
            description: req.body.description,
            completed: req.body.completed
        });
        newtask.save()
        .then((result)=>{
            res.redirect('/');
            console.log("entered in db");
        })
        .catch((err)=>{
            console.log(err);
        });
    }catch(err){console.log(err);}
    console.log("form accepted");    
});

app.get('/:id',(req,res)=>{
    const id = req.params.id;
    console.log(id);
    Task.findById(id)
    .then(result =>{
        res.render('tasks/details',{tasks: result, title: 'Task Details'});
    })
    .catch((err)=>{
        console.log("get error");
        console.log(err);
    });
});

app.delete('/:id',(req,res)=>{
    const id = req.params.id;
    console.log(id);
    Task.findByIdAndDelete(id)
    .then(result=>{
        res.json({redirect:'/'});
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.post('/:id',(req,res)=>{
    console.log(req.params.id);
    console.log("put active");
    Task.findOneAndUpdate({_id: req.params.id},{completed: "true"})
    .then(res.redirect('/'))
    .catch(err=>{
        console.log(err);
    })
})