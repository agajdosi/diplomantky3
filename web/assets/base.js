import * as params from '@params';

window.addEventListener('load', anyPageLoaded);
document.getElementById("login_submit").onclick = login;

function anyPageLoaded() {
    if (window.location.pathname === '/') {
        addLoginOpenPopupButton();
    }
}

function addLoginOpenPopupButton() {
    let loginButton = document.createElement('button');
    loginButton.setAttribute('id', 'login_open_popup');
    loginButton.addEventListener("click", loginPopupButtonClicked);
    loginButton.innerText = 'LOGIN';
    document.getElementById('header').appendChild(loginButton);
}

function loginPopupButtonClicked(event) {
    //TODO: Add popup window
    let popup = document.getElementById('login_popup');
    let button = event.target;
    if (button.innerText === 'LOGIN') {
        button.innerText = 'CLOSE';
        popup.style.display = "block";
        return;
    }
    button.innerText = 'LOGIN';
    popup.style.display = "none";
};


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
        let loggedAs = data['loggedAs'];
        document.cookie = `jwt=${token}; secure; sameSite=Lax; expires=Sun, 1 Jan 2025 00:00:00 UTC;`; //TODO: set expiration date
        document.cookie = `loggedAs=${loggedAs}; secure; sameSite=Lax; expires=Sun, 1 Jan 2025 00:00:00 UTC;`; //TODO: set expiration date
        report.innerText = 'Successfully logged in!';
        let redirectUrl = data['redirectUrl'];
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
        return;
    }
    report.innerText = 'Wrong credentials, please try again.'
};
