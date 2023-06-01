const express = require('express');
const app=express();

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Oczekuje na porcie ${port}...`))

app.use(express.json());



//COOKIES
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
app.use(cookieParser('kluczSesji'));
app.use(bodyParser.urlencoded({extended: true}));

//SESJA
const session = require('express-session');
app.use(session({resave: true, saveUninitialized: true, secret: 'kluczSesji'}));

app.use('/', (req,res) =>{
    let cookieValue;
    if(!req.cookies.ciasteczkoSesji){
        cookieValue = "INFORMACJA" + new Date().toString();
        res.cookie('ciasteczkoSesji', cookieValue, {signed: true});
    }else{
        cookieValue = req.cookies.ciasteczkoSesji;
    }
    res.render("ciastko", {cookieValue: cookieValue});
});







//const ejs=require('ejs');
const path= require("path");

app.set('view engine', 'ejs');  //konieczne doinstalowanie modułu

app.set('views', './pages');

const sqlite3 = require('sqlite3').verbose();
let db=new sqlite3.Database('./pages/DB/database', (err) =>{
    if(err){
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

const expressSession = require('express-session');
app.use(express.static(path.join(__dirname, 'pages')));
const session = require('express-session');












app.get('/', (req, res) => {
    res.render('views/index', {images: 'plakat'});
});

app.get('/login', (req, res) => {
    res.redirect('/sesja');
});

app.get('/sesja', (req, res) => {
    let sessionValue;
    res.render('views/loggedin', {images: 'plakat'});
});

app.get('/reset', (req, res) => {
    res.render('views/reset', {images: 'plakat'});
});

app.get('/rejestracja', (req, res) => {
    res.render('views/utworz_konto', {images: 'plakat'});
});

app.post('/login/potwierdz', (req, res) =>{
    let username=req.body.paramLogin;
    let password=req.body.paramPassword;

    console.log(`logowanie jako ${username} ${password}`);
    if(username===password){
        db.all(`Select id from users where login=? and password=?;`,[username, password], (err, rows)=>{
            rows.forEach((row)=>{
                console.log(`Wynik: ${row.id}`);
            })
            if(err){
                console.log('ERROR!', err);
            }
        });
    }

});

