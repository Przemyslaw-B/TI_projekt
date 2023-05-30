const express = require('express');
const app=express();

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Oczekuje na porcie ${port}...`))

app.use(express.json());

const ejs=require('ejs');
const path= require("path");

app.set('view engine', 'ejs');  //konieczne doinstalowanie modułu

app.set('views', './pages');

const expressSession = require('express-session');
app.use(express.static(path.join(__dirname, 'pages')));
app.get('/', (req, res) => {
    res.render('views/index', {images: 'plakat'});
});

app.get('/login', (req, res) => {
    res.redirect('/sesja');
});

app.get('/sesja', (req, res) => {
    res.render('views/loggedin', {images: 'plakat'});
});

app.get('/reset', (req, res) => {
    res.render('views/reset', {images: 'plakat'});
});

app.get('/rejestracja', (req, res) => {
    res.render('views/utworz_konto', {images: 'plakat'});
});

