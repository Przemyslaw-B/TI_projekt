const express = require('express');
const session = require('express-session');
const multer = require("multer");
const upload = multer()
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
            if(row){
                resolve(row.rank);
            } else {
                resolve(-1);
            }
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

async function get_movie_tyt(db, id){
    return new Promise((resolve, reject) => {
        db.get('Select tytul from movies where id=?;', [id], (err, row) => {
            if(row){
                resolve(row.tytul);
            }else{
                resolve(-1);
            }

            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_movie_opis(db, id){
    return new Promise((resolve, reject) => {
        db.get('Select opis from movies where id=?;', [id], (err, row) => {
            if(row){
                resolve(row.opis);
            }else{
                resolve(-1);
            }

            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_movie_plakat(db, id){
    return new Promise((resolve, reject) => {
        db.get('Select path from movies where id=?;', [id], (err, row) => {
            if(row){
                resolve(row.path);
            }else{
                resolve(-1);
            }

            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_movie_rok_produkcji(db, id){
    return new Promise((resolve, reject) => {
        db.get('Select rok_produkcji from movies where id=?;', [id], (err, row) => {
            if(row){
                resolve(row.rok_produkcji);
            }else{
                resolve(-1);
            }

            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_movie_rezyser(db, id){
    return new Promise((resolve, reject) => {
        db.get('Select rezyser from movies where id=?;', [id], (err, row) => {
            if(row){
                resolve(row.rezyser);
            }else{
                resolve(-1);
            }

            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function create_movie_list(db, amount){
    let id = 1;
    let lista = [];
    let name;
    let opis;
    let path;
    let movieId;
    while(id <= amount){
        movieId = id;
        name = await get_movie_tyt(db, id);
        opis = await  get_movie_opis(db, id);
        path = await get_movie_plakat(db, id);
        lista.push({tytul: name, opis: opis, plakat: path, movieId: id});
        id++;
    }
    return lista;
}

async function create_one_movie_list(db, movieId){
    let lista = [];
    let id = movieId;
    let name = await get_movie_tyt(db, id);
    let opis = await get_movie_opis(db, id);
    let path = await get_movie_plakat(db, id);
    let rok_produkcji = await get_movie_rok_produkcji(db, id);
    let rezyser = await get_movie_rezyser(db, id);
    console.log(`Print z tworzenia listy: id - ${id}`);
    console.log(`Print z tworzenia listy: name - ${name}`);
    lista.push({tytul: name, opis: opis, plakat: path, movieId: id, rezyser: rezyser, rok_produkcji: rok_produkcji});
    return lista;
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

async function get_movies_amount(db){
    return new Promise((resolve, reject) => {
        db.get('Select id from movies ORDER BY id DESC;', (err, row) => {
            if(row){
                resolve(row.id);
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

async function insert_kino(db, nazwaKina){
    db.run('INSERT INTO cinema (nazwa) VALUES (?);', [nazwaKina], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function insert_movie(db, nazwaFilmu, rokProdukcji, rezyser, opis){
    db.run('INSERT INTO movies (tytul, rok_produkcji, rezyser, opis) VALUES (?, ?, ?, ?);', [nazwaFilmu, rokProdukcji, rezyser, opis], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function insert_cinema_movie(db, idCinema, idMovie){
    db.run('INSERT INTO cinema_movie (id_cinema, id_movie) VALUES (?, ?);', [idCinema, idMovie], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function get_cinemaId(db, name){
    return new Promise((resolve, reject) => {
        db.get('Select id from cinema where nazwa=?;', [name], (err, row) => {
            if(row){
                resolve(row.id);
            } else{
                resolve(-1);
            }
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_movieId(db, name){
    return new Promise((resolve, reject) => {
        db.get('Select id from movies where tytul=?;', [name], (err, row) => {
            if(row){
                resolve(row.id);
            } else{
                resolve(-1);
            }
            if (err) {
                console.log('ERROR!', err);
            }
        });
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

async function check_nazwaKina(db, nazwaKina){
    return new Promise((resolve, reject) => {
        db.get('Select id from cinema where nazwa=?;', [nazwaKina], (err, row) => {
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

async function check_nazwaFilmu(db, nazwaFilmu){
    return new Promise((resolve, reject) => {
        db.get('Select id from movies where tytul=?;', [nazwaFilmu], (err, row) => {
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

app.get('/cookieAmount', (req, res) => {
    let amount = req.cookies["movieAmount"];
    console.log(`Ilość filmów: ${amount}`);
});



app.get('/mainPage', async (req, res) => {
    let amount = parseInt(req.cookies["movieAmount"]);
    let lista = await create_movie_list(db, amount);
    res.render('views/index', {images: 'plakat', amount: amount, lista: lista});
});

app.get('/', (req, res) => {
    req.session.isAuth = true;
    console.log(req.session);
    console.log(req.session.id);
    return res.redirect("sesja");
});

app.get('/login', async (req, res) => {
    let amount = parseInt(req.cookies["movieAmount"]);
    let lista = await create_movie_list(db, amount);
    let rank = await get_rank(db, req.session.id);
    if(rank === 0){
        res.render('views/loggedin', {images: 'plakat', amount: amount, lista: lista});
    } else if(rank === 1){
        res.redirect("/loginAdmin");
    } else{
        res.redirect("/")
    }
});

app.get('/loginAdmin',async (req, res) => {
    let amount = parseInt(req.cookies["movieAmount"]);
    let lista = await create_movie_list(db, amount);
    let rank = await get_rank(db, req.session.id);
    if(rank === 1){
        res.render('views/loggedin_admin', {images: 'plakat', amount: amount, lista: lista});
    } else if(rank === 0){
        res.redirect("/login");
    } else{
        res.redirect("/");
    }

});

app.get('/logout', async (req, res) => {
   await delete_session(db, req.session.id);
   res.redirect("/");
});

app.get('/sesja', async (req, res) => {
    let sessionValue;
    const sesja_bd = await get_session(db, req.session.id);
    var amount = 0;
    amount = await get_movies_amount(db);
    res.cookie("movieAmount", amount);
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

app.post('/dodajKino', async (req, res) => {
    let nazwaKina = req.body.paramNazwaKina;
    let checkNazwaKina = await check_nazwaKina(db, nazwaKina);
    let rank = await get_rank(db, req.session.id);
    if(checkNazwaKina === 0 && nazwaKina !== "" && rank == 1){
        await insert_kino(db, nazwaKina);
        return res.redirect("/");
    } else{
        return res.redirect("/dodajKino");
    }
});


app.post('/dodajFilm', async (req, res) => {
    let tytul = req.body.paramNazwaFilmu;
    let rokProdukcji = req.body.paramRokProdukcji;
    let rezyser = req.body.paramRezyser;
    let opis = req.body.paramOpis;
    let kina = req.body.paramKina;
    //console.log(file);
    let rank = await get_rank(db, req.session.id);
    let checkMovie = await check_nazwaFilmu(db, tytul);

    if(rank == 1 && checkMovie === 0 && tytul !== "" && rokProdukcji !== "" && rezyser !== "" && kina !== "" && opis !== ""){
        await insert_movie(db, tytul, rokProdukcji, rezyser, opis);

        let arrayCinema = kina.split(";");
        var j=0;

        while(j < arrayCinema.length){

            let kinoId = await get_cinemaId(db, arrayCinema[j]);
            let filmId = await get_movieId(db, tytul);
            if(kinoId !== -1 && filmId !== -1){
                await insert_cinema_movie(db, kinoId, filmId);
            }
        j++;
        }

        return res.redirect("/");
    } else{
        return res.redirect("/dodajFilm");
    }
});

app.get('/dodajKino', async (req, res) => {
    let rank = await get_rank(db, req.session.id);
    if(rank === 1){
        res.render('views/dodawanie_kina');
    } else{
        return res.redirect("/");
    }
});

app.get('/pokazListe', async (req, res) => {
    //var amount = req.cookies.userData;
    var nazwa = "";
    var opis = "";
    var plakat = "";
    let lista=[];
    var i=1;
    while(i<6){

        console.log(`nazwa: ${nazwa} opis: ${opis} plakat: ${plakat}`);
        let element = {
            id: i,
            tytul: nazwa,
            opis: opis,
            plakat: plakat
        }
        lista.push(element);
        i+=1;
    }
    res.render('views/index', {lista:lista});
});

app.get('/dodajFilm', async (req, res) => {
    let rank = await get_rank(db, req.session.id);
    if(rank === 1){
        res.render('views/dodawanie_filmu');
    } else{
        return res.redirect("/");
    }
});

app.get('/showMovie/:id', async (req, res) => {
    let id = req.params.id;
    console.log(`Param - id: ${id}`);
    let session = req.session.id;
    let rank = await get_rank(db, session);
    let lista = await create_one_movie_list(db, id);
    console.log(`Lista: ${lista[0].rezyser}`);
    if(rank === 1){
        res.render('views/show_movie_admin', {images: 'plakat', lista: lista});
    } else if(rank === 0){
        res.render('views/show_movie_user', {images: 'plakat', lista: lista});
    }else{
        res.render('views/show_movie', {images: 'plakat', lista: lista});
    }
});






