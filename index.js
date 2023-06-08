const express = require('express');
const session = require('express-session');
const app=express();

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Oczekuje na porcie ${port}...`))

app.use(express.json());

app.use(session({
    secret: 'Key',
    resave: false,
    saveUninitialized: false,
}));



//COOKIES
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
app.use(cookieParser('ciasteczkoSesji'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());





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



async function get_rank(db, session) {
    return new Promise((resolve, reject) => {
        db.get('Select rank from users where sesja=?;', [session], (err, row) => {
            resolve(row.rank);
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_id(db, username, password){
    return new Promise((resolve, reject) => {
        db.get('Select id from users where login=? and password=?;', [username, password], (err, row) => {
            if(row){
                resolve(row.id);
            }else{
                resolve(-1);
            }

            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function delete_session(db, sessionS){
    db.run('UPDATE users SET sesja=null where sesja=?;', [sessionS], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function set_session(db, id, sesja){
    db.run('UPDATE users SET sesja=? where id=?;', [sesja, id], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function get_session(db, sessionS){
    return new Promise((resolve, reject) => {
        db.get('Select sesja from users where sesja=?;', [sessionS], (err, row) => {
            if(row){
                resolve(row.sesja);
            } else{
                resolve(-1);
            }
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function insert_user(db, username, password, email){
    db.run('INSERT INTO users (login, password, mail, rank, sesja) VALUES (?, ?, ?, 0, null);', [username, password, email], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function check_username(db, username){
    return new Promise((resolve, reject) => {
        db.get('Select id from users where login=?;', [username], (err, row) => {
            if(row){
                resolve(1);
            } else{
                resolve(0);
            }
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function check_mail(db, email){
    return new Promise((resolve, reject) => {
        db.get('Select id from users where mail=?;', [email], (err, row) => {
            if(row){
                resolve(1);
            } else{
                resolve(0);
            }
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}



app.get('/mainPage', (req, res) => {
    res.render('views/index', {images: 'plakat'});
});

app.get('/', (req, res) => {
    req.session.isAuth = true;
    console.log(req.session);
    console.log(req.session.id);
    return res.redirect("sesja");
});

app.get('/login', (req, res) => {
    res.render('views/loggedin', {images: 'plakat'});
});

app.get('/loginAdmin', (req, res) => {
    res.render('views/loggedin_admin', {images: 'plakat'});
});

app.get('/logout', async (req, res) => {
   await delete_session(db, req.session.id);
   res.redirect("/");
});

app.get('/sesja', async (req, res) => {
    let sessionValue;
    //let cookieValue = "ciastko" + new Date().toString();
    const sesja_bd = await get_session(db, req.session.id);

    if(sesja_bd===req.session.id){
        let rank = await get_rank(db, sesja_bd)
        if(rank === 0){
            res.redirect("/login")
        } else if( rank === 1){
            res.redirect("/loginAdmin")
        } else{
            res.redirect("/mainPage");
        }

    } else{
        res.redirect("/mainPage");
    }
});


app.get('/reset', (req, res) => {
    res.render('views/reset', {images: 'plakat'});
});

app.get('/rejestracja', (req, res) => {
    res.render('views/utworz_konto', {images: 'plakat'});
});

app.post('/rejestracja', async (req, res) => {
    let username = req.body.paramLogin;
    let password = req.body.paramPassword;
    let passwordRep = req.body.paramPasswordRep;
    let email = req.body.paramEmail;
    let checkUsername = await check_username(db, username);
    let checkEmail = await check_mail(db, email);
    if(checkEmail === 0 && checkUsername === 0 && password === passwordRep && username !== "" && password !== "" && email !== ""){
        await insert_user(db, username, password, email);
        return res.redirect("/");
    } else{
        console.log(`No nie poszło.`);
        return res.redirect("/rejestracja");
    }
});

app.post('/login/potwierdz', async (req, res) => {
    let username = req.body.paramLogin;
    let password = req.body.paramPassword;
    console.log(req.session);
    console.log(req.session.id);
    console.log(`logowanie jako ${username} ${password}`);
    const id = await get_id(db, username, password);
    if(id>0){
        await set_session(db, id, req.session.id);
        return res.redirect("/sesja");
    } else{
        return res.redirect("/");
    }
});



