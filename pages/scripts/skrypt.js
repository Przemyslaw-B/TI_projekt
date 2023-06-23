
function logowanie(){

    var user = '{{request.user}}';

    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    const element_loguj=document.getElementById('loguj');
    if(element_loguj){
        element_loguj.addEventListener('click', function(event) {
            let username=document.getElementById('wsp_login').value;
            let password=document.getElementById('wsp_haslo').value;
            const http = new XMLHttpRequest()
            http.open("POST", "http://localhost:3000/login/potwierdz");
            http.setRequestHeader('Content-type', 'application/json')
            var params = new Object();
            params.paramLogin = username;
            params.paramPassword = password;
            http.send(JSON.stringify(params));
            window.location="http://localhost:3000/sesja";
            http.onload = () => console.log(http.responseText);
        });
    }

    const element_wyloguj=document.getElementById('wyloguj');
    if(element_wyloguj){
        element_wyloguj.addEventListener('click', function(event){
            const http = new XMLHttpRequest()
            http.open("GET", "http://localhost:3000/logout");
            http.send();
            window.location="http://localhost:3000/";
            http.onload = () => console.log(http.responseText);
        });
    }

    const element_rejestracja=document.getElementById('rejestruj');
    if(element_rejestracja){
        element_rejestracja.addEventListener('click', function(event){
            const http = new XMLHttpRequest()
            http.open("GET", "http://localhost:3000/");
            http.send();
            window.location="http://localhost:3000/rejestracja";
            http.onload = () => console.log(http.responseText);
        });
    }

    const element_zatwierdz_rejestracje=document.getElementById('potwierdz_rejestracje');
    if(element_zatwierdz_rejestracje){
        element_zatwierdz_rejestracje.addEventListener('click', function(event) {
            let username=document.getElementById('rejestracja_uzytkownik').value;
            let password=document.getElementById('rejestracja_haslo').value;
            let passwordRep=document.getElementById('rejestracja_powt_haslo').value;
            let email=document.getElementById('rejestracja_mail').value;
            const http = new XMLHttpRequest()
            http.open("POST", "http://localhost:3000/rejestracja");
            http.setRequestHeader('Content-type', 'application/json')
            var params = new Object();
            params.paramLogin = username;
            params.paramPassword = password;
            params.paramPasswordRep = passwordRep;
            params.paramEmail = email;
            http.send(JSON.stringify(params));
            //window.location="http://localhost:3000/";
            http.onload = () => console.log(http.responseText);
        });
    }

    const element_zatwierdz_kino=document.getElementById('ok');
    if(element_zatwierdz_kino){
        element_zatwierdz_kino.addEventListener('click', function(event) {
            let nazwaKina=document.getElementById('dodaj_kino').value;
            const http = new XMLHttpRequest()
            http.open("POST", "http://localhost:3000/dodajKino");
            http.setRequestHeader('Content-type', 'application/json')
            var params = new Object();
            params.paramNazwaKina = nazwaKina;
            http.send(JSON.stringify(params));
            //window.location="http://localhost:3000/";
            http.onload = () => console.log(http.responseText);
            window.location.reload();
        });
    }

    const element_dodaj_film=document.getElementById('ok_film');
    if(element_dodaj_film){
        element_dodaj_film.addEventListener('click', function(event) {
            let sciezka = "";
            let plik = document.getElementById('file');
            if(plik.files[0]) {
                sciezka = plik.files[0].name;
            }
            let nazwaFilmu=document.getElementById('dodaj_tytul').value;
            let rokProdukcji=document.getElementById('dodaj_rok').value;
            let rezyser=document.getElementById('dodaj_rezyser').value;
            let opis=document.getElementById('dodaj_opis').value;
            //let kina = document.getElementById('dodaj_kina').value;
            const http = new XMLHttpRequest()
            http.open("POST", "http://localhost:3000/dodajFilm");
            http.setRequestHeader('Content-type', 'application/json')
            var params = new Object();
            params.paramNazwaFilmu = nazwaFilmu;
            params.paramRokProdukcji = rokProdukcji;
            params.paramRezyser = rezyser;
            params.paramOpis = opis;
            //params.paramKina = kina;
            params.paramSciezka = sciezka;

            http.send(JSON.stringify(params));
            //window.location="http://localhost:3000/";
            http.onload = () => console.log(http.responseText);
        });
    }

    const aktualizuj_tytul=document.getElementById('ok_zmiana_tytulu');
    if(aktualizuj_tytul){
        aktualizuj_tytul.addEventListener('click', function(event) {
            let nowyTytul = document.getElementById('dodaj_tytul').value;
            let url = window.location.href;
            let text = url.split("/");
            let filmId = text[text.length-1];

            const http = new XMLHttpRequest()
            http.open("POST", "http://localhost:3000/nowyTytul");
            http.setRequestHeader('Content-type', 'application/json')
            var params = new Object();

            params.paramNowyTytul = nowyTytul;
            params.paramMovieId = filmId;

            http.send(JSON.stringify(params));
            //window.location=`http://localhost:3000/showMovie/${movieId}`;
            http.onload = () => console.log(http.responseText);
            window.location.reload();

        });
    }

    const aktualizuj_okladke=document.getElementById('ok_zmiana_okladki');
    if(aktualizuj_okladke){
        aktualizuj_okladke.addEventListener('click', function(event) {
            let sciezka = "";
            let url = window.location.href;
            let text = url.split("/");
            let filmId = text[text.length-1];
            let plik = document.getElementById('file');
            if(plik.files[0]) {
                sciezka = plik.files[0].name;
            }
            const http = new XMLHttpRequest()
            http.open("POST", "http://localhost:3000/nowyPlakat");
            http.setRequestHeader('Content-type', 'application/json')
            var params = new Object();
            params.paramMovieId = filmId;
            params.paramSciezka = sciezka;
            http.send(JSON.stringify(params));
            //window.location="http://localhost:3000/";
            http.onload = () => console.log(http.responseText);
            window.location.reload();
        });
    }

    const aktualizuj_opis=document.getElementById('ok_zmiana_opisu');
    if(aktualizuj_opis){
        aktualizuj_opis.addEventListener('click', function(event) {
            let url = window.location.href;
            let text = url.split("/");
            let filmId = text[text.length-1];
            let nowyOpis = document.getElementById('dodaj_nowy_opis').value;

            const http = new XMLHttpRequest()
            http.open("POST", "http://localhost:3000/nowyOpis");
            http.setRequestHeader('Content-type', 'application/json');
            var params = new Object();
            params.paramMovieId = filmId;
            params.paramNowyOpis = nowyOpis;
            http.send(JSON.stringify(params));
            //window.location="http://localhost:3000/";
            http.onload = () => console.log(http.responseText);
            window.location.reload();
        });
    }

    const aktualizuj_kina=document.getElementById('ok_zmiana_kin');
    if(aktualizuj_kina){
        aktualizuj_kina.addEventListener('click', function(event) {
            let url = window.location.href;
            let text = url.split("/");
            let filmId = text[text.length-1];
            let allCinemaAmount = getCookie("allCinemaAmount");
            let cinemaCheckBox=[];
            //cinemaCheckBox.push({cinemaId: allCinemaAmount, cinemaCheckBox: allCinemaAmount});
            if(allCinemaAmount !== ""){
                for(let counter=0; counter<parseInt(allCinemaAmount); counter++){
                    let value = document.getElementById(`horns_${counter}`).checked;
                    let cinemaId= document.getElementById(`horns_${counter}`).value;
                    cinemaCheckBox.push({cinemaId: cinemaId, cinemaCheckBox: value});
                    //cinemaCheckBox.push({cinemaId: cinemaId, cinemaCheckBox: cinemaId});
                }
            }

            const http = new XMLHttpRequest()
            http.open("POST", "http://localhost:3000/aktualizacjaKin");
            http.setRequestHeader('Content-type', 'application/json');
            var params = new Object();
            params.paramMovieId = filmId;
            params.paramCheckBox = cinemaCheckBox;
            http.send(JSON.stringify(params));
            //window.location="http://localhost:3000/";
            http.onload = () => console.log(http.responseText);
            window.location.reload();
        });
    }

    const aktualizuj_aktora=document.getElementById('ok_dodaj_aktora');
    if(aktualizuj_aktora){
        aktualizuj_aktora.addEventListener('click', function(event) {
            let url = window.location.href;
            let text = url.split("/");
            let filmId = text[text.length-1];
            let movieActorsAmount = getCookie("actorsMovieAmount");
            let aktor = document.getElementById('dodaj_aktora').value;
            let splitAktor = aktor.split(" ");
            let nowyAktor = []
            let checkBoxValue;
            if(aktor !== ""){
                if(splitAktor.length===2){
                    nowyAktor.push({imie: splitAktor[0], nazwisko: splitAktor[1]});
                }
            }
            let usunAktorow =[];
            if(parseInt(movieActorsAmount) > 0){
                for(let counter=0; counter<parseInt(movieActorsAmount); counter++){
                    let value = document.getElementById(`horns_actor_${counter}`).checked;
                    checkBoxValue = value;
                    let actorId= document.getElementById(`horns_actor_${counter}`).value;
                    if(value === false){
                        usunAktorow.push({actorId: actorId});
                    }
                }
            }
            const http = new XMLHttpRequest()
            http.open("POST", "http://localhost:3000/aktualizacjaObsady");
            http.setRequestHeader('Content-type', 'application/json');
            var params = new Object();
            params.paramMovieId= filmId;
            params.paramNowyAktor = nowyAktor;
            params.paramUsunAktorow = usunAktorow;
            params.paramBoxValue = checkBoxValue;
            http.send(JSON.stringify(params));
            //window.location="http://localhost:3000/";
            http.onload = () => console.log(http.responseText);
            window.location.reload();
        });
    }

    const aktualizuj_godzine=document.getElementById('ok_dodaj_godzine_box');
    if(aktualizuj_godzine){
        aktualizuj_godzine.addEventListener('click', function(event) {
            let url = window.location.href;
            let text = url.split("/");
            let filmId = text[text.length-1];
            let cinemaAmount = parseInt(getCookie("cinemaAmount"));
            let value  = -1;
            let godzina=[];
            let dzien= -1;
            let name = -1;
            let czas;
            for(let counter=0; counter<cinemaAmount; counter++){
                for(let counterDay=0; counterDay<7; counterDay++){
                    value = document.getElementById(`dodaj_nowa_godzine_${counter}_${counterDay}`).value;
                    czas = value.split(":");
                    name = document.getElementById(`dodaj_nowa_godzine_${counter}_${counterDay}`).name;
                    dzien=counterDay;
                    if(czas.length === 2){
                        godzina.push({cinemaName: name, dzien: dzien, godzina: parseInt(czas[0]), minuta: parseInt(czas[1])});
                    }
                }
            }
            const http = new XMLHttpRequest()
            http.open("POST", "http://localhost:3000/dodajGodzine");
            http.setRequestHeader('Content-type', 'application/json');
            var params = new Object();
            params.paramMovieId= filmId;
            params.paramGodzina = godzina;
            http.send(JSON.stringify(params));
            //window.location="http://localhost:3000/";
            http.onload = () => console.log(http.responseText);
            window.location.reload();
        });
    }

    const dodaj_like=document.getElementById('button_like');
    if(dodaj_like){
        dodaj_like.addEventListener('click', function(event) {
            let url = window.location.href;
            let text = url.split("/");
            let filmId = text[text.length-1];

            const http = new XMLHttpRequest()
            http.open("POST", "http://localhost:3000/like");
            http.setRequestHeader('Content-type', 'application/json');
            var params = new Object();
            params.paramMovieId= filmId;
            http.send(JSON.stringify(params));
            http.onload = () => console.log(http.responseText);
            window.location.reload();
        });
    }

    const dodaj_dislike=document.getElementById('button_dislike');
    if(dodaj_dislike){
        dodaj_dislike.addEventListener('click', function(event) {
            let url = window.location.href;
            let text = url.split("/");
            let filmId = text[text.length-1];

            const http = new XMLHttpRequest()
            http.open("POST", "http://localhost:3000/dislike");
            http.setRequestHeader('Content-type', 'application/json');
            var params = new Object();
            params.paramMovieId= filmId;
            http.send(JSON.stringify(params));
            http.onload = () => console.log(http.responseText);
            window.location.reload();
        });
    }




}