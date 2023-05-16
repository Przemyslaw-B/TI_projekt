
function logowanie(){

    var user = '{{request.user}}';
    let element=document.getElementById('loguj');
    element.addEventListener('click', function(event) {
        let login=document.getElementById('wsp_login').value;
        let haslo=document.getElementById('wsp_haslo').value;
        const http = new XMLHttpRequest()

        http.open("GET", "http://localhost:8080/users/1")
        http.send()

        http.onload = () => console.log(http.responseText)
    });
}