import * as params from '@params';


document.getElementById("login_open_popup").onclick = show_login_popup;
document.getElementById("login_submit").onclick = login;

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
    .then((data) => validate_response(data));
};

function validate_response(data) {
    let report = document.getElementById("login_report");
    if (data['result'] === 'ok'){
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
