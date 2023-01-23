const FUNCS_URL = "https://faas-fra1-afec6ce7.doserverless.co/api/v1/web/fn-528256f2-9971-460f-9817-4f448375181f"

function login() {
    let data = {
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value,
    }
    fetch(FUNCS_URL + '/core/json_response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify(data),
    })

    .then((response) => response.json())
    .then((data) => console.log(data));
    //HERE SHOW LOGGED IN MESSAGE
    //OR SHOW TRY AGAIN MESSAGE
  }