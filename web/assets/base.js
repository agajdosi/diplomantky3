import * as params from '@params';


document.getElementById("login_open_popup").onclick = show_login_popup;
document.getElementById("login_submit").onclick = login;
document.getElementById("edit_button").onclick = edit;
document.getElementById("save_button").onclick = save;
window.onload = documentLoaded;


function login() {
    let data = {
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value,
    };
    fetch(params.FUNCS_URL + '/core/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => validate_login_response(data));
};


function validate_login_response(data) {
    let report = document.getElementById("login_report");
    if (data['result'] === 'ok'){
        let token = data['token'];
        let canEditURL = data['canEditURL'];
        document.cookie = `jwt=${token}; secure; sameSite=Lax; expires=Sun, 1 Jan 2025 00:00:00 UTC;`; //TODO: set expiration date
        document.cookie = `canEditURL=${canEditURL}; secure; sameSite=Lax; expires=Sun, 1 Jan 2025 00:00:00 UTC;`; //TODO: set expiration date
        report.innerText = 'Successfully logged in!';
        return
    }
    report.innerText = 'Wrong credentials, please try again.'
};


function show_login_popup() {
    let popup = document.getElementById('login_popup');
    if (popup.style.display === "block") {
        popup.style.display = "none";
        return
    }

    popup.style.display = "block";
};


function edit(){
    console.log('edit')
}


function save() {
    let jwt = document.cookie.split('; ').find(row => row.startsWith('jwt=')).split('=')[1];
    let data = {
        "token": jwt,
    };
    fetch(params.FUNCS_URL + '/core/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => { 
        console.log(data)
    });
}


function documentLoaded() {
    console.log("DOCUMENT LOADED")
}
