const FUNCS_URL = "https://faas-fra1-afec6ce7.doserverless.co/api/v1/web/fn-528256f2-9971-460f-9817-4f448375181f"

function login() {
    let data = {
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value,
    };
    fetch(FUNCS_URL + '/core/login_json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => validate_response(data));
}

function validate_response(data) {
    let report = document.getElementById("login_report");
    if (data['result'] === 'logged in'){
        report.innerText = 'Successfully logged in!';
        return
    }
    report.innerText = 'Wrong credentials, please try again.'
}


function show_login_popup() {
    let popup = document.getElementById('login_popup');
    if (popup.style.display === "block") {
        popup.style.display = "none";
        return
    }

    popup.style.display = "block";
}
