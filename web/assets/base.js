import * as params from '@params';

window.addEventListener('load', anyPageLoaded);
document.getElementById('login_form').addEventListener('submit', function(event) {
    login(event);
});


function anyPageLoaded() {
    if (window.location.pathname === '/') {
        addLoginOpenPopupButton();
    }
}

function addLoginOpenPopupButton() {
    let loginButton = document.createElement('button');
    loginButton.setAttribute('id', 'login_open_popup');
    loginButton.addEventListener("click", loginPopupButtonClicked);
    loginButton.innerText = 'login';
    document.getElementById('headerright').prepend(loginButton);
}

function loginPopupButtonClicked(event) {
    //TODO: Add popup window
    console.log('FUNCS_URL: ' + params.FUNCS_URL);
    let popup = document.getElementById('login_popup');
    let button = event.target;
    if (button.innerText === 'login') {
        button.innerText = 'close';
        popup.style.display = "block";
        return;
    }
    button.innerText = 'login';
    popup.style.display = "none";
};


function login(event) {
    console.log('FUNCS_URL: ' + params.FUNCS_URL);
    event.preventDefault();
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
        console.log('credentials ok');
        let token = data['token'];
        let loggedAs = data['loggedAs'];
        let userRole = data['userRole'];
        if (userRole == null) userRole = 'user';
        console.log('userRole: ' + userRole);
        
        // TODO: set expiration date dynamically
        document.cookie = `jwt=${token}; secure; sameSite=Lax; expires=Mon, 31 Dec 2030 23:59:59 UTC;`;
        document.cookie = `loggedAs=${loggedAs}; secure; sameSite=Lax; expires=Mon, 31 Dec 2030 23:59:59 UTC;`;
        document.cookie = `userRole=${userRole}; secure; sameSite=Lax; expires=Mon, 31 Dec 2030 23:59:59 UTC;`;
        
        console.log('cookies set');
        report.innerText = 'Successfully logged in!';
        let redirectUrl = data['redirectUrl'];
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
        return;
    }
    console.log('wrong credentials, data: ' + JSON.stringify(data));
    report.innerText = 'Wrong credentials, please try again.'
};

function handleDisabledProfileClick(url) {
    // Check if user is logged in by looking for the jwt cookie
    const cookies = document.cookie.split(';');
    const jwtCookie = cookies.find(cookie => cookie.trim().startsWith('jwt='));
    
    if (jwtCookie) {
        // User is logged in, redirect to the empty profile page
        window.location.href = url;
    } else {
        // User is not logged in, do nothing
        console.log('User not logged in, cannot access disabled profile');
    }
}

// Make function globally available for onclick attributes
window.handleDisabledProfileClick = handleDisabledProfileClick;
