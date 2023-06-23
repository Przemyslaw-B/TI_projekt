const express = require('express');
const session = require('express-session');
const multer = require("multer");
const storage = multer.diskStorage({
    filename: (req, file, cb) =>{
        //console.log(file)
        cb(null, file.originalname)
        //cb(null, Date.now() + path.extname(file.originalname))
    },
    destination: (req, file, cb) =>{
        cb(null, './pages/plakat')
    }

})
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return null
        }
        callback(null, true)
    }

});



const app=express();
const fs = require('fs');

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
const {response} = require("express");

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
            } else{
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

async function get_userId(db, session){
    return new Promise((resolve, reject) => {
        db.get('Select id from users where sesja=?;', [session], (err, row) => {
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

async function get_movie_actors(db, movieId){
    let obsada = []
    return new Promise((resolve, reject) => {
        db.all('Select id_actor, imie, nazwisko from movies_actors JOIN actors ON id_actor=id where id_movie=?;', [movieId], (err, row) => {
            row.forEach(function(row){
                obsada.push({actorId: row.id_actor, imie: row.imie, nazwisko: row.nazwisko});
            })
            resolve(obsada);
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_playing_time(db, movieId, cinemaId, dzien){
    let godziny = []
    return new Promise((resolve, reject) => {
        db.all('Select godzina, minuta from playing_time where id_movie=? and id_cinema=? and day=? order by godzina, minuta ASC;', [movieId, cinemaId, dzien], (err, row) => {
            row.forEach(function(row){
                godziny.push({godzina: row.godzina, minuta: row.minuta});
            })
            resolve(godziny);
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_cinema_amount(db, movieId){
    return new Promise((resolve, reject) => {
        db.get('Select Count(id_cinema) as ilosc from cinema_movie where id_movie=?;', [movieId], (err, row) => {
            if(row){
                resolve(row.ilosc);
            }else{
                resolve(-1);
            }

            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_all_movie_amount(db){
    return new Promise((resolve, reject) => {
        db.get('Select Count(id) as ilosc from movies;', (err, row) => {
            if(row){
                resolve(row.ilosc);
            }else{
                resolve(-1);
            }

            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_favorite_movie_amount(db, userId){
    return new Promise((resolve, reject) => {
        db.get('Select Count(movie_id) as ilosc from users_favorite where user_id=?;', [userId], (err, row) => {
            if(row){
                resolve(row.ilosc);
            }else{
                resolve(-1);
            }

            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function check_cinema_movies(db, cinemaId, movieId){
    return new Promise((resolve, reject) => {
        db.get('Select id_movie from cinema_movie where id_cinema=? and id_movie=?;', [cinemaId, movieId], (err, row) => {
            if(row){
                resolve(1);
            }else{
                resolve(-1);
            }

            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function check_movie_time(db, cinemaId, movieId, dzien, godzina, minuta){
    return new Promise((resolve, reject) => {
        db.get('Select id_movie from playing_time where id_cinema=? and id_movie=? and day=? and godzina=? and minuta=?;', [cinemaId, movieId, dzien, godzina, minuta], (err, row) => {
            if(row){
                resolve(1);
            }else{
                resolve(-1);
            }

            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}


async function get_cinemaNames(db, movieId){
    let listaNazw =[];
    return new Promise((resolve, reject) => {
        db.all('Select nazwa from cinema join cinema_movie on id=id_cinema  where id_movie=?;', [movieId], (err, row) => {
            row.forEach(function(row){
                listaNazw.push(row.nazwa);
            })
            resolve(listaNazw);
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_movieIDs(db){
    let listaId =[];
    return new Promise((resolve, reject) => {
        db.all('Select id from movies where isPlaying=1;', (err, row) => {
            row.forEach(function(row){
                listaId.push(row.id);
            })
            resolve(listaId);
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_all_movieIDs(db){
    let listaId =[];
    return new Promise((resolve, reject) => {
        db.all('Select id from movies;', (err, row) => {
            row.forEach(function(row){
                listaId.push(row.id);
            })
            resolve(listaId);
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_all_likes_list(db, userId){
    let listaLike =[];
    return new Promise((resolve, reject) => {
        db.all('Select id_movie, like_value from likes where id_user=?;',[userId], (err, row) => {
            row.forEach(function(row){
                listaLike.push({movieId: row.id_movie, likeValue: row.like_value});
            })
            resolve(listaLike);
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_movie_likes_count_list(db){
    let listaLike =[];
    return new Promise((resolve, reject) => {
        db.all('Select id_movie, count(like_value) as ilosc from likes where like_value=1;', (err, row) => {
            row.forEach(function(row){
                listaLike.push({movieId: row.id_movie, likeCount: ilosc});
            })
            resolve(listaLike);
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_movie_dislikes_count_list(db){
    let listaLike =[];
    return new Promise((resolve, reject) => {
        db.all('Select id_movie, count(like_value) as ilosc from likes where like_value=0;', (err, row) => {
            row.forEach(function(row){
                listaLike.push({movieId: row.id_movie, likeCount: ilosc});
            })
            resolve(listaLike);
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_all_cinemaIds(db){
    let listaId =[];
    return new Promise((resolve, reject) => {
        db.all('Select id from cinema order by id ASC;', (err, row) => {
            row.forEach(function(row){
                listaId.push(row.id);
            })
            resolve(listaId);
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_all_cinemaNames(db){
    let listaId =[];
    return new Promise((resolve, reject) => {
        db.all('Select nazwa from cinema order by id ASC;', (err, row) => {
            row.forEach(function(row){
                listaId.push(row.nazwa);
            })
            resolve(listaId);
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_favorite_movies_id(db, userId){
    let listaId =[];
    return new Promise((resolve, reject) => {
        db.all('Select movie_id as ids from users_favorite where user_id=?;',[userId], (err, row) => {
            row.forEach(function(row){
                listaId.push(row.ids);
            })
            resolve(listaId);
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function create_favorite_movie_list(db, userId){
    let id = 0;
    let lista = [];
    let name;
    let opis;
    let path;
    let cinemaAmount;
    let movieIds = await get_favorite_movies_id(db, userId);
    let movieId;
    let amount = movieIds.length;
    while(id < amount){
        name = await get_movie_tyt(db, movieIds[id]);
        opis = await  get_movie_opis(db, movieIds[id]);
        path = await get_movie_plakat(db, movieIds[id]);
        cinemaAmount = await get_cinema_amount(db, movieIds[id]);
        movieId = movieIds[id];
        let cinemaList = await get_cinemaNames(db, movieIds[id]);
        let isFavorite=1;
        lista.push({tytul: name, opis: opis, plakat: path, cinemaAmount: cinemaAmount, movieId: movieId, cinemaList: cinemaList, isFavorite: 1});
        id++;
    }
    return lista;
}

async function create_movie_list(db, amount){
    let id = 0;
    let lista = [];
    let name;
    let opis;
    let path;
    let movieId = [];
    movieId = await get_movieIDs(db);
    let cinemaAmount;
    let cinemaList;
    while(id < amount){
        name = await get_movie_tyt(db, movieId[id]);
        opis = await  get_movie_opis(db, movieId[id]);
        path = await get_movie_plakat(db, movieId[id]);
        cinemaAmount = await get_cinema_amount(db, movieId[id]);
        cinemaList = await get_cinemaNames(db, movieId[id]);
        lista.push({tytul: name, opis: opis, plakat: path, cinemaAmount: cinemaAmount, movieId: movieId[id], cinemaList: cinemaList});
        id++;
    }
    return lista;
}

async function create_movie_list_with_favorite(db,userId, amount){
    let id = 0;
    let lista = [];
    let name;
    let opis;
    let path;
    let movieId = [];
    movieId = await get_movieIDs(db);
    let cinemaAmount;
    let cinemaList;
    let favoriteList = await get_favorite_movies_id(db, userId);
    let isFavorite = 0;
    while(id < amount){
        isFavorite=0;
        name = await get_movie_tyt(db, movieId[id]);
        opis = await  get_movie_opis(db, movieId[id]);
        path = await get_movie_plakat(db, movieId[id]);
        cinemaAmount = await get_cinema_amount(db, movieId[id]);
        cinemaList = await get_cinemaNames(db, movieId[id]);
        for(let i=0; i< favoriteList.length; i++){
            if(favoriteList[i] === movieId[id]){
                isFavorite=1;
            }
        }
        lista.push({tytul: name, opis: opis, plakat: path, cinemaAmount: cinemaAmount, movieId: movieId[id], cinemaList: cinemaList, isFavorite: isFavorite});
        id++;
    }
    return lista;
}

async function create_all_movie_list_with_favorite(db,userId){
    let id = 0;
    let lista = [];
    let name;
    let opis;
    let path;
    let movieId = [];
    movieId = await get_all_movieIDs(db);
    let cinemaAmount;
    let cinemaList;
    let favoriteList = await get_favorite_movies_id(db, userId);
    let amount = movieId.length;
    let isFavorite = 0;
    while(id < amount){
        isFavorite=0;
        name = await get_movie_tyt(db, movieId[id]);
        opis = await  get_movie_opis(db, movieId[id]);
        path = await get_movie_plakat(db, movieId[id]);
        cinemaAmount = await get_cinema_amount(db, movieId[id]);
        cinemaList = await get_cinemaNames(db, movieId[id]);
        for(let i=0; i< favoriteList.length; i++){
            if(favoriteList[i] === movieId[id]){
                isFavorite=1;
            }
        }
        lista.push({tytul: name, opis: opis, plakat: path, cinemaAmount: cinemaAmount, movieId: movieId[id], cinemaList: cinemaList, isFavorite: isFavorite});
        id++;
    }
    return lista;
}

async function create_all_movie_like_list(db,userId){
    let id = 0;
    let lista = [];
    let movieId = await get_all_movieIDs(db);
    let likeList = await get_all_likes_list(db, userId);
    let likeAmount = likeList.length;
    let movieAmount = movieId.length;
    let isLiked = 0;

    while(id < movieAmount){
        isLiked=0;
        for(let i=0; i< likeAmount; i++){
            if(likeList[i] === movieId[id]){
                isLiked=1;
            }
        }
        lista.push({tytul: name, opis: opis, plakat: path, cinemaAmount: cinemaAmount, movieId: movieId[id], cinemaList: cinemaList, isFavorite: isFavorite});
        id++;
    }
    return lista;
}



async function create_favorite_only_movie_list(db, userId){
    let id = 0;
    let lista = [];
    let name;
    let opis;
    let path;
    let movieId = [];
    movieId = await get_movieIDs(db);
    let cinemaAmount;
    let cinemaList;
    while(id < amount){
        name = await get_movie_tyt(db, movieId[id]);
        opis = await  get_movie_opis(db, movieId[id]);
        path = await get_movie_plakat(db, movieId[id]);
        cinemaAmount = await get_cinema_amount(db, movieId[id]);
        cinemaList = await get_cinemaNames(db, movieId[id]);
        lista.push({tytul: name, opis: opis, plakat: path, cinemaAmount: cinemaAmount, movieId: movieId[id], cinemaList: cinemaList});
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
    let cinemaAmount = await get_cinema_amount(db, movieId);
    let cinemaList = await get_cinemaNames(db, movieId);
    lista.push({tytul: name, opis: opis, plakat: path, movieId: id, rezyser: rezyser, rok_produkcji: rok_produkcji, cinemaAmount: cinemaAmount, cinemaList: cinemaList});
    return lista;
}

async function create_all_cinema_list(db){
    let count = 0;
    let lista = [];
    let name;
    let opis;
    let path;
    let cinemaId = [];
    cinemaId = await get_cinemaIds(db);
    let cinemaAmount;
    let cinemaList;
    while(count < amount){
        name = await get_movie_tyt(db, movieId[id]);
        opis = await  get_movie_opis(db, movieId[id]);
        path = await get_movie_plakat(db, movieId[id]);
        cinemaAmount = await get_cinema_amount(db, movieId[id]);
        cinemaList = await get_cinemaNames(db, movieId[id]);
        lista.push({tytul: name, opis: opis, plakat: path, cinemaAmount: cinemaAmount, movieId: movieId[id], cinemaList: cinemaList});
        id++;
    }
    return lista;
}

async function delete_session(db, sessionS){
    db.run('UPDATE users SET sesja=null where sesja=?;', [sessionS], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function update_like_value(db, userId, movieId, value){
    db.run('UPDATE likes SET like_value=? where id_user=? and id_movie=?;', [value, userId, movieId], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function update_movie_name(db, movieId, newName){
    db.run('UPDATE movies SET tytul=? where id=?;', [newName, movieId], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function update_movie_describtion(db, newDesc, movieId){
    db.run('UPDATE movies SET opis=? where id=?;', [newDesc, movieId], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function update_movie_director(db, newDirector, movieId){
    db.run('UPDATE movies SET rezyser=? where id=?;', [newDirector, movieId], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function update_isPlaying(db, status, movieId){
    db.run('UPDATE movies SET isPlaying=? where id=?;', [status, movieId], (err) => {
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

async function update_okladka(db, sciezka, movieId){
    db.run('UPDATE movies SET path=? where id=?;', [sciezka, movieId], (err) => {
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
        db.get('Select count(id) as ilosc from movies where isPlaying = 1;', (err, row) => {
            if(row){
                resolve(row.ilosc);
            } else{
                resolve(-1);
            }
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function check_isPlaying(db, movieId){
    return new Promise((resolve, reject) => {
        db.get('Select id_cinema from cinema_movie where id_movie=?;', [movieId], (err, row) => {
            if(row){
                resolve(1);
            } else{
                resolve(-1);
            }
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function check_is_favorite(db, userId, movieId){
    return new Promise((resolve, reject) => {
        db.get('Select user_id from users_favorite where user_id=? and movie_id=?;', [userId, movieId], (err, row) => {
            if(row){
                resolve(1);
            } else{
                resolve(-1);
            }
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function check_actor(db, imie, nazwisko){
    return new Promise((resolve, reject) => {
        db.get('Select id from actors where imie=? and nazwisko=?;', [imie, nazwisko], (err, row) => {
            if(row){
                resolve(1);
            } else{
                resolve(-1);
            }
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function check_actor_in_movie(db, actorId, movieId){
    return new Promise((resolve, reject) => {
        db.get('Select id_actor from movies_actors where id_actor=? and id_movie=?;', [actorId, movieId], (err, row) => {
            if(row){
                resolve(1);
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

async function insert_playing_time(db, cinemaId, movieId, day, godzina, minuta){
    db.run('INSERT INTO playing_time (id_cinema, id_movie, day, godzina, minuta) VALUES (?, ?, ?, ?, ?);', [cinemaId, movieId, day, godzina, minuta], (err) => {
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

async function insert_movie(db, nazwaFilmu, rokProdukcji, rezyser, opis, sciezka){
    db.run('INSERT INTO movies (tytul, rok_produkcji, rezyser, opis, path) VALUES (?, ?, ?, ?, ?);', [nazwaFilmu, rokProdukcji, rezyser, opis, sciezka], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function insert_actor(db, imie, nazwisko){
    db.run('INSERT INTO actors (imie, nazwisko) VALUES (?, ?);', [imie, nazwisko], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function insert_actor_in_to_movie(db, movieId, actorId){
    db.run('INSERT INTO movies_actors (id_movie, id_actor) VALUES (?, ?);', [movieId, actorId], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function get_actor_Id(db, imie, nazwisko){
    return new Promise((resolve, reject) => {
        db.get('Select id from actors where imie=? and nazwisko=?;', [imie, nazwisko], (err, row) => {
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

async function count_actors_in_movie(db, movieId){
    return new Promise((resolve, reject) => {
        db.get('Select count(id_actor) as ilosc from movies_actors where id_movie=?;', [movieId], (err, row) => {
            if(row){
                resolve(row.ilosc);
            } else{
                resolve(-1);
            }
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_favorite_movies_id(db, userId){
    let listaId =[];
    return new Promise((resolve, reject) => {
        db.all('Select movie_id as ids from users_favorite where user_id=?;',[userId], (err, row) => {
            row.forEach(function(row){
                listaId.push(row.ids);
            })
            resolve(listaId);
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}


async function get_all_actors(db){
    return new Promise((resolve, reject) => {
        let actors=[];
        db.all('Select id, imie, nazwisko from actors order by imie, nazwisko DESC;', (err, row) => {
            row.forEach(function(row){
                actors.push({id: row.id, imie: row.imie, nazwisko: row.nazwisko});
            })
            resolve(actors);
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

async function check_isFavorite(db, userId, movieId){
    return new Promise((resolve, reject) => {
        db.get('Select movie_id from users_favorite where user_id=? and movie_id=?;', [userId, movieId], (err, row) => {
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

async function check_like(db, userId, movieId){
    return new Promise((resolve, reject) => {
        db.get('Select like_value from likes where id_user=? and id_movie=?;', [userId, movieId], (err, row) => {
            if(row){
                resolve(row.like_value);
            } else{
                resolve(-1);
            }
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function get_likes_value_amount(db, movieId, value){
    return new Promise((resolve, reject) => {
        db.get('Select count(id_movie) as ilosc from likes where id_movie=? and like_value=?;', [movieId, value], (err, row) => {
            if(row){
                resolve(row.ilosc);
            } else{
                resolve(-1);
            }
            if (err) {
                console.log('ERROR!', err);
            }
        });
    });
}

async function add_isFavorite(db, userId, movieId){
    db.run('INSERT INTO users_favorite (user_id, movie_id) VALUES (?, ?);', [userId, movieId], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function add_like_value(db, userId, movieId, value){
    db.run('INSERT INTO likes (id_user, id_movie, like_value) VALUES (?, ?, ?);', [userId, movieId, value], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function remove_isFavorite(db, userId, movieId){
    db.run('DELETE FROM users_favorite where user_id=? and movie_id=?;', [userId, movieId], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function remove_one_playing_time(db, cinemaId, movieId, dzien, godzina, minuta){
    db.run('DELETE FROM playing_time where id_cinema=? and id_movie=? and day=? and godzina=? and minuta=?;', [cinemaId, movieId, dzien, godzina, minuta], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function remove_like(db, userId, movieId){
    db.run('DELETE FROM likes where id_user=? and id_movie=?;', [userId, movieId], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function remove_actor_from_movie(db, actorId, movieId){
    db.run('DELETE FROM movies_actors where id_actor=? and id_movie=?;', [actorId, movieId], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function remove_movie_from_cinema(db, cinemaId, movieId){
    db.run('DELETE FROM cinema_movie where id_cinema=? and id_movie=?;', [cinemaId, movieId], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}

async function remove_all_movie_playing_time_from_cinema(db, cinemaId, movieId){
    db.run('DELETE FROM playing_time where id_cinema=? and id_movie=?;', [cinemaId, movieId], (err) => {
        if (err) {
            console.log('ERROR!', err);
        }
    });
}



app.get('/mainPage', async (req, res) => {
    let amount = parseInt(req.cookies["movieAmount"]);
    let lista = await create_movie_list(db, amount);

    let allLikes = [];
    for(let count =0; count<lista.length; count++){
        let id = lista[count].movieId;
        let likesAmount = await get_likes_value_amount(db, id, 1);
        let dislikesAmount = await get_likes_value_amount(db, id, 0);
        let likeStatus = -1;
        allLikes.push({movieId: id, likesAmount: likesAmount, dislikesAmount: dislikesAmount, likeStatus: likeStatus});

    }
    //movieId, likeValue
    let allLikesAmount = allLikes.length;

    res.render('views/index', {images: 'plakat', allLikes: allLikes, allLikesAmount: allLikesAmount, amount: amount, lista: lista});
});

app.get('/', (req, res) => {
    req.session.isAuth = true;
    console.log(req.session);
    console.log(req.session.id);
    return res.redirect("sesja");
});

app.get('/login', async (req, res) => {
    let amount = parseInt(req.cookies["movieAmount"]);
    let sesja = req.session.id;
    let rank = await get_rank(db, sesja);
    if(rank === 0){
        let userId = await get_userId(db, sesja);
        let lista = await create_movie_list_with_favorite(db, userId, amount);
        let likeList = await get_all_likes_list(db, userId);
        let allLikes = [];
        for(let count =0; count<lista.length; count++){
            let id = lista[count].movieId;
            let likesAmount = await get_likes_value_amount(db, id, 1);
            let dislikesAmount = await get_likes_value_amount(db, id, 0);
            let likeStatus = await check_like(db, userId, id);
            allLikes.push({movieId: id, likesAmount: likesAmount, dislikesAmount: dislikesAmount, likeStatus: likeStatus});

        }
        //movieId, likeValue
        let likeListAmount = likeList.length;
        let allLikesAmount = allLikes.length;
        res.render('views/loggedin', {images: 'plakat',likeList: likeList, allLikes: allLikes, allLikesAmount: allLikesAmount, likeListAmount: likeListAmount, likeList: likeList, amount: amount, lista: lista});
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

        let allLikes = [];
        for(let count =0; count<lista.length; count++){
            let id = lista[count].movieId;
            let likesAmount = await get_likes_value_amount(db, id, 1);
            let dislikesAmount = await get_likes_value_amount(db, id, 0);
            let likeStatus = -1;
            allLikes.push({movieId: id, likesAmount: likesAmount, dislikesAmount: dislikesAmount, likeStatus: likeStatus});

        }
        //movieId, likeValue
        let allLikesAmount = allLikes.length;

        res.render('views/loggedin_admin', {images: 'plakat', allLikes: allLikes, allLikesAmount: allLikesAmount, amount: amount, lista: lista});
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
    const sesja_bd = await get_session(db, req.session.id);
    let amount = await get_movies_amount(db);
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
    if(checkNazwaKina === 0 && nazwaKina !== "" && rank === 1){
        await insert_kino(db, nazwaKina);
        return res.redirect("/");
    } else{
        return res.redirect("/dodajKino");
    }
});


app.post('/dodajFilm', async (req, res) => {
    let sciezka = req.body.paramSciezka;
    let tytul = req.body.paramNazwaFilmu;
    let rokProdukcji = req.body.paramRokProdukcji;
    let rezyser = req.body.paramRezyser;
    let opis = req.body.paramOpis;
    //let kina = req.body.paramKina;
    let rank = await get_rank(db, req.session.id);
    let checkMovie = await check_nazwaFilmu(db, tytul);
    console.log("Dodaje Film");
    console.log(`sciezka: ${sciezka}`);
    console.log(tytul);
    console.log(rokProdukcji);
    console.log(rezyser);
    console.log(opis);
    //console.log(kina);
    console.log(rank);
    console.log(checkMovie);

    if(rank === 1 && checkMovie === 0 && tytul !== "" && rokProdukcji !== "" && rezyser !== "" && opis !== ""){
        if(sciezka===""){
            sciezka ="default.jpg";
            await insert_movie(db, tytul, rokProdukcji, rezyser, opis, sciezka);
        } else{
            await insert_movie(db, tytul, rokProdukcji, rezyser, opis, sciezka);
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
    let nazwa = "";
    let opis = "";
    let plakat = "";
    let lista=[];
    let i = 1;
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
    let session = req.session.id;
    let rank = await get_rank(db, session);
    let userId = await get_userId(db, session);
    let lista = await create_one_movie_list(db, id);
    let rezyser = await get_movie_rezyser(db, id);
    let obsada = await get_movie_actors(db, id);
    let iloscKin = lista[0].cinemaAmount;
    let czasGrania=[];
    let dni_godziny=[];
    let kinoGranie=[];
    let actorsAmount = await count_actors_in_movie(db, id);
    let kinaGodziny = [];
    let dniGodziny=[];
    let checkUlubiony = await check_isFavorite(db, userId, id);
    let likesAmount = await get_likes_value_amount(db, id, 1);
    let dislikesAmount = await get_likes_value_amount(db, id, 0);
    let checkLike = await check_like(db, userId, id);
    console.log(`check like: ${checkLike}`);
    for(let j=0; j< iloscKin; j++){
        let kinoId = await get_cinemaId(db, lista[0].cinemaList[j]);
        dniGodziny=[];
        for(let dzien=0; dzien<7; dzien++){
            let godziny = await get_playing_time(db, id, kinoId, dzien);
            // godziny {godzina, minuta}
            let godzinyIlosc = godziny.length;
            dniGodziny.push({iloscGodzin: godzinyIlosc, dzien: dzien, godziny: godziny});
            dni_godziny.push({godziny: godziny, godzinyIlosc: godzinyIlosc});

            czasGrania.push({kinoId: kinoId, dzien: dzien, dniGodziny: dni_godziny});   //TO jest zbędne, po raz kolejny układa wiersze dniami???
        }
        kinaGodziny.push({kinoId: kinoId, dniGodziny: dniGodziny});
        kinoGranie.push({kinoId: kinoId, czasGrania:czasGrania});
        //console.log(`id kina: ${kinaGodziny[j].kinoId}-${lista[0].cinemaList[j]}, dzień[0]: ${kinaGodziny[j].dniGodziny[0].dzien}, godzinyIlość: ${kinaGodziny[j].dniGodziny[0].iloscGodzin}, pokaż godzinę[0]: ${kinaGodziny[j].dniGodziny[0].godziny[0].godzina}:${kinaGodziny[j].dniGodziny[0].godziny[0].minuta}`);
    }
    if(rank === 1){
        let allCinemaId = await get_all_cinemaIds(db);
        let allCinemaNames = await get_all_cinemaNames(db);
        let allCinemaAmount = allCinemaId.length;
        let actorsAll = await get_all_actors(db);
        res.cookie("movieId", id);
        res.cookie("allCinemaAmount", allCinemaAmount);
        res.cookie("cinemaAmount", lista[0].cinemaAmount);
        res.cookie("actorsMovieAmount", obsada.length);
        res.render('views/show_movie_admin', {images: 'plakat',likeStatus: checkLike, likesAmount: likesAmount, dislikesAmount: dislikesAmount, kinaGodziny: kinaGodziny, allCinemaAmount: allCinemaAmount, allCinemaId: allCinemaId, allCinemaNames: allCinemaNames, rezyser: rezyser, obsada: obsada, kinoGranie: kinoGranie, czasGrania: czasGrania, actorsAmount: actorsAmount, actorsAll: actorsAll, lista: lista});
    } else if(rank === 0){
        res.render('views/show_movie_user', {images: 'plakat',likeStatus: checkLike, likesAmount: likesAmount, dislikesAmount: dislikesAmount, checkUlubiony: checkUlubiony, actorsAmount: actorsAmount, rezyser: rezyser, obsada: obsada, kinaGodziny: kinaGodziny, lista: lista});
    }else{
        res.render('views/show_movie', {images: 'plakat',likeStatus: -1, likesAmount: likesAmount, dislikesAmount: dislikesAmount, actorsAmount: actorsAmount,rezyser: rezyser, obsada: obsada,kinaGodziny: kinaGodziny, lista: lista});
    }
});

app.get('/ulubione', async (req, res) => {
    let session = req.session.id;
    console.log(`session: ${session}`);
    let rank = await get_rank(db, session);
    let userId = await get_userId(db, session);
    let lista =[];
    if(rank === 0){
        let id = await get_userId(db, session);
        let amount = await get_favorite_movie_amount(db, id);
        lista = await create_favorite_movie_list(db, id);
        let allLikes=[];

        let likeList = await get_all_likes_list(db, userId);
        for(let count =0; count<lista.length; count++){
            let movieId = lista[count].movieId;
            let likesAmount = await get_likes_value_amount(db, movieId, 1);
            let dislikesAmount = await get_likes_value_amount(db, movieId, 0);
            let likeStatus = await check_like(db, userId, movieId);
            allLikes.push({movieId: movieId, likesAmount: likesAmount, dislikesAmount: dislikesAmount, likeStatus: likeStatus});
        }
        let likeListAmount = likeList.length;
        let allLikesAmount = allLikes.length;
        //console.log(`movieId: ${lista[0].movieId}`);
        //console.log(`allLikes-movieId: ${allLikes[0].movieId}`);
        //console.log(`LikeListAmount: ${likeListAmount}`);
        //console.log(`allLikes.length: ${allLikes.length}`);
        //{tytul: name, opis: opis, plakat: path, cinemaAmount: cinemaAmount, movieId: movieIds[id], cinemaList: cinemaList}
        res.render('views/favorite', {images: 'plakat', allLikes: allLikes, allLikesAmount:allLikesAmount, likeList: likeList, likeListAmount: likeListAmount, amount: amount, lista: lista});
    } else{
        return res.redirect("/");
    }
});

app.post('/upload',upload.single('image'), (req, res) => {
    //console.log(`sciezka2: ${req.file.originalname}`)
    res.redirect('/dodajFilm')
});

app.post('/showMovie/upload',upload.single('image'), (req, res) => {
    //console.log(`sciezka2: ${req.file.originalname}`)
    let movieId = parseInt(req.cookies["movieId"]);
    res.redirect(`/showMovie/${movieId}`);
});


app.get('/test',  async (req, res) => {
    res.render('views/test');
});

app.get('/movieFav/:id', async (req, res) => {
    let movieId = req.params.id;
    let sesja = req.session.id;
    let userId = await get_userId(db, sesja);
    let rank = await get_rank(db, sesja);
    let isFavorite = await check_isFavorite(db, userId, movieId);
    if(rank === 0){
        if(isFavorite === 0){
            await add_isFavorite(db, userId, movieId);
        } else {
            await  remove_isFavorite(db, userId, movieId);
        }

    }
    res.redirect('/');
});

app.get('/movieFav/details/:id', async (req, res) => {
    let movieId = req.params.id;
    let sesja = req.session.id;
    let userId = await get_userId(db, sesja);
    let rank = await get_rank(db, sesja);
    let isFavorite = await check_isFavorite(db, userId, movieId);
    if(rank === 0){
        if(isFavorite === 0){
            await add_isFavorite(db, userId, movieId);
        } else {
            await  remove_isFavorite(db, userId, movieId);
        }

    }
    res.redirect(`/showMovie/${movieId}`);
});

app.get('/ulubione/movieFav/:id', async (req, res) => {
    let movieId = req.params.id;
    let sesja = req.session.id;
    let userId = await get_userId(db, sesja);
    let rank = await get_rank(db, sesja);
    let isFavorite = await check_isFavorite(db, userId, movieId);
    if(rank === 0){
        if(isFavorite === 0){
            await add_isFavorite(db, userId, movieId);
        } else {
            await  remove_isFavorite(db, userId, movieId);
        }

    }
    res.redirect('/ulubione');
});

app.get('/wszystkieFilmy/movieFav/:id', async (req, res) => {
    let movieId = req.params.id;
    let sesja = req.session.id;
    let userId = await get_userId(db, sesja);
    let rank = await get_rank(db, sesja);
    let isFavorite = await check_isFavorite(db, userId, movieId);
    if(rank === 0){
        if(isFavorite === 0){
            await add_isFavorite(db, userId, movieId);
        } else {
            await  remove_isFavorite(db, userId, movieId);
        }
    }
    res.redirect('/wszystkieFilmy');
});

app.get('/wszystkieFilmy', async (req, res) => {
    let sesja = req.session.id;
    let userId = await get_userId(db, sesja);
    let rank = await get_rank(db, sesja);
    let amount = await get_all_movie_amount(db);
    let allLikes=[];

    //let checkLike = await check_like(db, userId, id);
    //console.log(`Sprawdzam!`);
    //console.log(`Amount: ${amount}`);
    let lista = await create_all_movie_list_with_favorite(db, userId);
    let likeList = await get_all_likes_list(db, userId);
    for(let count =0; count<lista.length; count++){
        let id = lista[count].movieId;
        let likesAmount = await get_likes_value_amount(db, id, 1);
        let dislikesAmount = await get_likes_value_amount(db, id, 0);
        let likeStatus = await check_like(db, userId, id);
        allLikes.push({movieId: id, likesAmount: likesAmount, dislikesAmount: dislikesAmount, likeStatus: likeStatus});

    }
    //movieId, likeValue
    //let likeListAmount = likeList.length;
    let likeListAmount = allLikes.length;
    if(rank === -1){
        return res.redirect("/");
    } else {
        res.render('views/all_movies', {images: 'plakat', allLikes: allLikes, likeList: likeList, likeListAmount: likeListAmount, rank: rank, amount: amount, lista: lista});
    }
});

app.post('/nowyTytul',async (req, res) => {
    let rank = await get_rank(db, req.session.id);
    let movieId = parseInt(req.body.paramMovieId);
    if(rank === 1){
        let nowyTytul = req.body.paramNowyTytul;
        let url = `/showMovie/${movieId}`;
        await update_movie_name(db, movieId, nowyTytul);
        res.redirect(`/showMovie/${movieId}`);
    } else{
        return res.redirect('/');
    }
});

app.post('/nowyPlakat', async (req, res) => {
    let sciezka = req.body.paramSciezka;
    let movieId = req.body.paramMovieId;
    let rank = await get_rank(db, req.session.id);

    if(rank === 1){
        if(sciezka===""){
            sciezka ="default.jpg";
            await update_okladka(db, sciezka, movieId);
        } else{
            await update_okladka(db, sciezka, movieId);
        }
    } else{
        return res.redirect("/");
    }
    res.redirect("/");
});

app.post('/nowyOpis',async (req, res) => {
    let rank = await get_rank(db, req.session.id);
    let movieId = parseInt(req.body.paramMovieId);
    let nowyOpis = req.body.paramNowyOpis;
    if(rank === 1){
        await update_movie_describtion(db, nowyOpis, movieId);
        res.redirect(`/showMovie/${movieId}`);
    } else{
        return res.redirect('/');
    }
});

app.post('/nowyRezyser',async (req, res) => {
    let rank = await get_rank(db, req.session.id);
    let movieId = parseInt(req.body.paramMovieId);
    let nowyRezyser = req.body.paramNowyRezyser;
    if(rank === 1){
        await update_movie_director(db, nowyRezyser, movieId);
        res.redirect(`/showMovie/${movieId}`);
    } else{
        return res.redirect('/');
    }
});

app.post('/aktualizacjaKin',async (req, res) => {
    let rank = await get_rank(db, req.session.id);
    let movieId = parseInt(req.body.paramMovieId);
    let checkBox = req.body.paramCheckBox;
    //{cinemaId: cinemaId, cinemaCheckBox: value}
    //console.log(`movie id:${movieId}, id kina nr.0.: ${checkBox[0].cinemaId}, checkBox value: ${checkBox[0].cinemaCheckBox}`);
    if(rank === 1){
        let cinemaAmount=checkBox.length;
        for(let i=0; i< cinemaAmount; i++){
            let cinemaId = parseInt(checkBox[i].cinemaId);
            let check = await check_cinema_movies(db, cinemaId, movieId);
            //console.log(`Check: ${check}`);
            //console.log(`dla kina: ${cinemaId}, CheckBox: ${checkBox[i].cinemaCheckBox}`);
            if(checkBox[i].cinemaCheckBox === true){
                //console.log(`CheckBox: ${checkBox[i].cinemaCheckBox}`);
                if(check === -1) {
                    //console.log(`dodaję film z id: ${movieId} do kina: ${cinemaId}!`);
                    await insert_cinema_movie(db, cinemaId, movieId);
                }
            } else{
                if(check === 1) {
                    //console.log(`usuwam film z id: ${movieId} z kina: ${cinemaId}!`);
                    await remove_movie_from_cinema(db, cinemaId, movieId);
                    await remove_all_movie_playing_time_from_cinema(db, cinemaId, movieId);
                }
            }
        }
        let check_isPlalying = await check_isPlaying(db, movieId);
        if(check_isPlalying === -1){
            await update_isPlaying(db, 0, movieId);
        } else{
            await update_isPlaying(db, 1, movieId);
        }

        res.redirect(`/showMovie/${movieId}`);
    } else{
        return res.redirect('/');
    }
});

app.post('/aktualizacjaObsady',async (req, res) => {
    let rank = await get_rank(db, req.session.id);
    let movieId = parseInt(req.body.paramMovieId);
    let nowyAktor = req.body.paramNowyAktor;
    let usunAktorow = req.body.paramUsunAktorow;
    let boxValue = req.body.paramBoxValue;
    // usunAktorow {actorId: actorId}
    // nowyAktor {imie: splitAktor[0], nazwisko: splitAktor[1]}
    //console.log(`TEST AKTUALIZACJI AKTORÓW!`);
    //console.log(`dlugosc tablicy usunięcia aktorów: ${usunAktorow.length}`);
    //console.log(`długośc tablicy dodawania aktora: ${nowyAktor.length}`);
    //console.log(`Wartość checkBoxa: ${boxValue}`);
    if(rank === 1){
        if(usunAktorow.length > 0){
            //console.log(`Dostałem Nowego aktora do usuniecia!`);
            for(let counter=0; counter < usunAktorow.length; counter++){
                await remove_actor_from_movie(db, usunAktorow[counter].actorId, movieId);
            }
        }
        if(nowyAktor.length > 0){
            //console.log(`Dostałem Nowego aktora: ${nowyAktor[0].imie} ${nowyAktor[0].nazwisko}`);
            for(let counter=0; counter<nowyAktor.length; counter++){
                let checkActor = await check_actor(db, nowyAktor[counter].imie, nowyAktor[counter].nazwisko);
                if(checkActor === -1){
                    await insert_actor(db, nowyAktor[counter].imie, nowyAktor[counter].nazwisko);
                }
                let actorId = await get_actor_Id(db, nowyAktor[counter].imie, nowyAktor[counter].nazwisko);
                let checkActorMovie = await check_actor_in_movie(db, actorId, movieId);
                if(checkActorMovie === -1){
                    await insert_actor_in_to_movie(db, movieId, actorId);
                }
            }
        }
        res.redirect(`/showMovie/${movieId}`);
        } else{
            return res.redirect('/');
        }
});

app.post('/dodajGodzine',async (req, res) => {
    let rank = await get_rank(db, req.session.id);
    let movieId = parseInt(req.body.paramMovieId);
    let godzina = req.body.paramGodzina;
    //console.log(`Próbuję dodać godzine!`);
    //console.log(`movieId: ${movieId}`);
    //console.log(`Godzina.length: ${godzina.length}`);
    //console.log(`${godzina.length}`);
    if(rank === 1){
        if(godzina.length>0){
            for(let counter=0; counter<godzina.length; godzina++){
               //console.log(`dodaję do: ${godzina[counter].cinemaName}, dzień: ${godzina[counter].dzien}`);
                //console.log(`Nowa Godzina: ${godzina[counter].godzina}:${godzina[counter].minuta}`);
                let cinemaName = godzina[counter].cinemaName;
                let cinemaId = await get_cinemaId(db, cinemaName);
                let dzien = godzina[counter].dzien;
                let nowaGodzina = godzina[counter].godzina;
                let nowaMinuta = godzina[counter].minuta;
                let check = await check_movie_time(db, cinemaId, movieId, dzien, nowaGodzina, nowaMinuta);
                //console.log(`CHECK czas: ${check}`);
                if(check === -1){
                    await insert_playing_time(db, cinemaId, movieId, dzien, nowaGodzina, nowaMinuta);
                    //console.log(`Nowa godzina dodana!`);
                }
            }
        }
        res.redirect(`/showMovie/${movieId}`);
    } else{
        return res.redirect('/');
    }
});

app.get('/usunGodzine/:movieId/:cinemaId/:day/:hour/:minutes', async (req, res) => {
    let sesja = req.session.id;
    let movieId = req.params.movieId;
    let cinemaId = req.params.cinemaId;
    let day = req.params.day;
    let godzina = req.params.hour;
    let minuta = req.params.minutes;
    let rank = await get_rank(db, sesja);
    if(rank === 1){
        await remove_one_playing_time(db, cinemaId, movieId, day, godzina, minuta);
        return res.redirect(`/showMovie/${movieId}`);
    } else {
        return res.redirect("/");
    }
});

app.post('/like',async (req, res) => {
    let sesja = req.session.id;
    let rank = await get_rank(db, sesja);
    let movieId = parseInt(req.body.paramMovieId);
    let userId = await get_userId(db, sesja);
    let value = 1;
    if(rank === 0){
        let check = await check_like(db, userId, movieId);
        //console.log(`sprawdzam like: userId: ${userId}, film: ${movieId}, check: ${check}`);
        if(check === -1){
            await add_like_value(db, userId, movieId, value);
        } else if(check === value){
            await remove_like(db, userId, movieId);
        } else {
            await update_like_value(db, userId, movieId, value);
        }
    }
});

app.get('/wszystkieFilmy/like/:movieId', async (req, res) => {
    let sesja = req.session.id;
    let movieId = req.params.movieId;
    let value = 1;
    let rank = await get_rank(db, sesja);
    let userId = await get_userId(db, sesja);
    if(rank === 0){
        let check = await check_like(db, userId, movieId);
        //console.log(`sprawdzam like: userId: ${userId}, film: ${movieId}, check: ${check}`);
        if(check === -1){
            await add_like_value(db, userId, movieId, value);
        } else if(check === value){
            await remove_like(db, userId, movieId);
        } else {
            await update_like_value(db, userId, movieId, value);
        }
    }
    if(rank === -1){
        return res.redirect("/");
    } else {
        return res.redirect("/wszystkieFilmy");
    }
});

app.get('/wszystkieFilmy/dislike/:movieId', async (req, res) => {
    let sesja = req.session.id;
    let movieId = parseInt(req.params.movieId);
    let value = 0;
    let rank = await get_rank(db, sesja);
    let userId = await get_userId(db, sesja);
    if(rank === 0){
        let check = await check_like(db, userId, movieId);
        //console.log(`sprawdzam like: userId: ${userId}, film: ${movieId}, check: ${check}`);
        if(check === -1){
            await add_like_value(db, userId, movieId, value);
        } else if(check === value){
            await remove_like(db, userId, movieId);
        } else {
            await update_like_value(db, userId, movieId, value);
        }
    }
    if(rank === -1){
        return res.redirect("/");
    } else {
        return res.redirect("/wszystkieFilmy");
    }
});

app.get('/ulubione/like/:movieId', async (req, res) => {
    let sesja = req.session.id;
    let movieId = req.params.movieId;
    let value = 1;
    let rank = await get_rank(db, sesja);
    let userId = await get_userId(db, sesja);
    if(rank === 0){
        let check = await check_like(db, userId, movieId);
        //console.log(`sprawdzam like: userId: ${userId}, film: ${movieId}, check: ${check}`);
        if(check === -1){
            await add_like_value(db, userId, movieId, value);
        } else if(check === value){
            await remove_like(db, userId, movieId);
        } else {
            await update_like_value(db, userId, movieId, value);
        }
    }
    if(rank === -1){
        return res.redirect("/");
    } else {
        return res.redirect("/ulubione");
    }
});

app.get('/ulubione/dislike/:movieId', async (req, res) => {
    let sesja = req.session.id;
    let movieId = parseInt(req.params.movieId);
    let value = 0;
    let rank = await get_rank(db, sesja);
    let userId = await get_userId(db, sesja);
    if(rank === 0){
        let check = await check_like(db, userId, movieId);
        //console.log(`sprawdzam like: userId: ${userId}, film: ${movieId}, check: ${check}`);
        if(check === -1){
            await add_like_value(db, userId, movieId, value);
        } else if(check === value){
            await remove_like(db, userId, movieId);
        } else {
            await update_like_value(db, userId, movieId, value);
        }
    }
    if(rank === -1){
        return res.redirect("/");
    } else {
        return res.redirect("/ulubione");
    }
});

app.get('/dislike/:movieId', async (req, res) => {
    let sesja = req.session.id;
    let movieId = parseInt(req.params.movieId);
    let value = 0;
    let rank = await get_rank(db, sesja);
    let userId = await get_userId(db, sesja);
    if(rank === 0){
        let check = await check_like(db, userId, movieId);
        //console.log(`sprawdzam like: userId: ${userId}, film: ${movieId}, check: ${check}`);
        if(check === -1){
            await add_like_value(db, userId, movieId, value);
        } else if(check === value){
            await remove_like(db, userId, movieId);
        } else {
            await update_like_value(db, userId, movieId, value);
        }
    }
    return res.redirect("/");
});

app.get('/like/:movieId', async (req, res) => {
    let sesja = req.session.id;
    let movieId = parseInt(req.params.movieId);
    let value = 1;
    let rank = await get_rank(db, sesja);
    let userId = await get_userId(db, sesja);
    if(rank === 0){
        let check = await check_like(db, userId, movieId);
        //console.log(`sprawdzam like: userId: ${userId}, film: ${movieId}, check: ${check}`);
        if(check === -1){
            await add_like_value(db, userId, movieId, value);
        } else if(check === value){
            await remove_like(db, userId, movieId);
        } else {
            await update_like_value(db, userId, movieId, value);
        }
    }
    return res.redirect("/");
});



app.post('/dislike',async (req, res) => {
    let sesja = req.session.id;
    let rank = await get_rank(db, sesja);
    let movieId = parseInt(req.body.paramMovieId);
    let userId = await get_userId(db, sesja);
    let value = 0;
    if(rank === 0){
        let check = await check_like(db, userId, movieId);
        if(check === -1){
            await add_like_value(db, userId, movieId, value);
        } else if(check === value){
            await remove_like(db, userId, movieId);
        } else {
            await update_like_value(db, userId, movieId, value);
        }
    }
});




