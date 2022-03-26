const express = require('express');
const exphbs = require('express-handlebars');
const app=express();
const path = require('path');
const db = require('./db/connection');
const bodyParser = require('body-parser');
const Job = require('./models/Job');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const port = 3000;

app.listen(port, function(){
    console.log(`O Express está rodando na porta ${port}`);
});


// Body-parser
app.use(bodyParser.urlencoded({extended: false}));

//handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// static folder
app.use(express.static(path.join(__dirname, 'public')));

//db connection
db
    .authenticate()
    .then(() =>{
    console.log("Conectou ao banco com sucesso");
}) 
    .catch(erro => {
        console.log("Ocorreu um erro ao conectar", erro);
    });


//Routes
app.get('/', (req,res)=>{

        let search = req.query.job;
        let query = '%'+search+'%'; // PH -> PHP, Word -> Wordpress, press -> Wordpress

        if(!search){
     
    Job.findAll({order:[
        ['createdAt', 'DESC']
    ]})
    .then(jobs =>{

        res.render('index', {
            jobs
        });

        })
        .catch(erro => console.log(erro));
    }else{
        
    Job.findAll({
        where: {title: { [Op.like]: query}},
        order:[
        ['createdAt', 'DESC']
    ]})
    .then(jobs =>{
        res.render('index', {
            jobs, search
        });
    })
    .catch(erro => console.log(erro));
    }

});

// Jobs routes
app.use('/jobs', require('./routes/jobs'));