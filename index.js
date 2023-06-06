const express = require('express');
const app=express();

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Oczekuje na porcie ${port}...`))

app.use(express.json());



//COOKIES
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
app.use(cookieParser('ciasteczkoSesji'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/ciastko', (req,res) =>{
    let cookieValue;
    if(!req.cookies.ciasteczkoSesji){
        cookieValue = "ciastko" + new Date().toString();
        res.cookie('ciasteczkoSesji', cookieValue, {signed: true});
    }else{
        cookieValue = req.cookies.ciasteczkoSesji;
    }

    if(!req.cookies.ciasteczkoId){
        cookieValue = "-1".toString();
        res.cookie('ciasteczkoId', cookieValue, {signed: true});
    }else{
        cookieValue = req.cookies.ciasteczkoId;
    }
    res.render("ciastko", {cookieValue: cookieValue});
});


app.use('/ciastkoId', (req,res) =>{
    let cookieValue;
    if(!req.cookies.ciasteczkoId){
        cookieValue = "-1".toString();
        res.cookie('ciasteczkoId', cookieValue, {signed: true});
    }else{
        cookieValue = req.cookies.ciasteczkoId;
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

app.use(express.static(path.join(__dirname, 'pages')));

app.use(bodyParser.json());





app.get('/', (req, res) => {
    res.render('views/index', {images: 'plakat'});
});

app.get('/login', (req, res) => {
    res.redirect('/sesja');
});

app.get('/sesja', (req, res) => {
    let sessionValue;
    //let cookieValue = "ciastko" + new Date().toString();
    let cookieValue;
    if(!req.cookies.ciasteczkoSesji){
        cookieValue = "-1".toString();

    }else{
        cookieValue = req.cookies.ciasteczkoSesji;
    }
    res.cookie('ciasteczkoSesji', cookieValue, {signed: true});

    res.render('views/loggedin', {images: 'plakat'});

});


app.post('/tajneCiastko', (req, res) => {
    let cookieValue;
    console.log(`aktywowano tajne ciastko!`);
    cookieValue = "supertajnaINFORMACJA";
    res.cookie('TAJNEciastkoi', cookieValue);
    res.render('views/loggedin', {cookieValue: cookieValue});
});

app.get('/reset', (req, res) => {
    res.render('views/reset', {images: 'plakat'});
});

app.get('/rejestracja', (req, res) => {
    res.render('views/utworz_konto', {images: 'plakat'});
});

app.post('/login/potwierdz', async (req, res) => {
    let username = req.body.paramLogin;
    let password = req.body.paramPassword;
    console.log(`logowanie jako ${username} ${password}`);
    var re;
    const question = await db.all('Select rank from users where login=? and password=?;', [username, password], (err, rows) => {
        rows.forEach((row) => {
            console.log(`Wynik: ${row.rank}`);
            re = row.rank + "";
        });
        if (err) {
            console.log('ERROR!', err);
        }
    });
    let cookieValue = `${re}`.toString();
    if (!req.cookies.TAJNEciastko) {
        res.cookie('TAJNEciastko', cookieValue);
    }
    console.log(`Wynik tajnego ciastka: ${cookieValue}`);
    res.render('views/loggedin', {cookieValue: cookieValue});

});

app.get('/login/potwierdz/:username/:password', (req, res) =>{
    //let username=req.body.paramLogin;
    //let password=req.body.paramPassword;
    var username = req.params.username;
    var password = req.params.password;
    let cookieValue;
    console.log(`logowanie jako: ${username} ${password}`);
    if(username===password){
        db.all('Select rank from users where login=? and password=?;',[username, password], (err, rows)=>{
            rows.forEach((row)=>{
                console.log(`Wynik: ${row.rank}`);
                cookieValue = `${row.rank}`.toString();
                //res.cookie('user', username, {maxAge: 10800}).send('cookie set');
                //res.cookie('ciasteczkoId', `${row.rank}`.toString(), {signed: true});

            });


            if(err){
                console.log('ERROR!', err);
                cookieValue = `brak` + new Date().toString();
            }

        });
    }
    res.cookie('ciasteczkoSesji', cookieValue, {signed: true});
    res.render('views/loggedin', {images: 'plakat'});

});

