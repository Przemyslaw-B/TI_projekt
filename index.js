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
app.use(express.static(path.join(__dirname, 'style')));
app.get('/', (req, res) => {
    res.render('index', {uzytkownik: 'testowy'});
});
