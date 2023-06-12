
function logowanie(){

    var user = '{{request.user}}';

    var amount = async function getAmount(){
        var il = await getMovieAmount(db);
        return il;
        let file = document.getElementById('output'); //????
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
        });
    }

    const element_dodaj_film=document.getElementById('ok_film');
    if(element_dodaj_film){
        element_dodaj_film.addEventListener('click', function(event) {
            let nazwaFilmu=document.getElementById('dodaj_tytul').value;
            let rokProdukcji=document.getElementById('dodaj_rok').value;
            let rezyser=document.getElementById('dodaj_rezyser').value;
            let opis=document.getElementById('dodaj_opis').value;
            let kina = document.getElementById('dodaj_kina').value;
            const http = new XMLHttpRequest()
            http.open("POST", "http://localhost:3000/dodajFilm");
            http.setRequestHeader('Content-type', 'application/json')
            var params = new Object();
            params.paramNazwaFilmu = nazwaFilmu;
            params.paramRokProdukcji = rokProdukcji;
            params.paramRezyser = rezyser;
            params.paramOpis = opis;
            params.paramKina = kina;
            http.send(JSON.stringify(params));
            //window.location="http://localhost:3000/";
            http.onload = () => console.log(http.responseText);
        });
    }

    function getMovieAmount(){
        var amount=3;
        let cookieName = "userData";
        //amount=document.cookie.get
        return amount;
    }

    const getCookie = (name) => {
        return document.cookie.split("; ").reduce((r, v) => {
            res.cookies.userData;
            const parts = v.split("=");
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, "");
    };



}