
function logowanie(){

    var user = '{{request.user}}';
    const element_loguj=document.getElementById('loguj');
    if(element_loguj){
        element_loguj.addEventListener('click', function(event) {
            let username=document.getElementById('wsp_login').value;
            let password=document.getElementById('wsp_haslo').value;
            const http = new XMLHttpRequest()
            http.open("POST", "http://localhost:3000/login/potwierdz");
            //http.open("GET", `http://localhost:3000/login/potwierdz/${username}/${password}`);
            //http.send();
            //http.open("POST", "http://localhost:3000/tajneCiastko");
            //http.send();
            http.setRequestHeader('Content-type', 'application/json')
            var params = new Object();
            params.paramLogin = username;
            params.paramPassword = password;
            //http.send(params);
            http.send(JSON.stringify(params));
            //window.location=`http://localhost:3000/login/potwierdz/${username}/${password}`;
            //http.onload = () => console.log(http.responseText);
            window.location="http://localhost:3000/sesja";
            //window.location="http://localhost:3000/json";
            //window.location=`http://localhost:3000/login/potwierdz/${username}/${password}`;
            http.onload = () => console.log(http.responseText);
        });
    }

    const element_wyloguj=document.getElementById('wyloguj');
    if(element_wyloguj){
        element_wyloguj.addEventListener('click', function(event){
            const http = new XMLHttpRequest()
            http.open("GET", "http://localhost:3000/");
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


}