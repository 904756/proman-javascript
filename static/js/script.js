/* "Given my application server is started,
 When I open the root url (/),
  Then ensure that there is a register link on the page,
// And ensure if I click on it, I see a registration page with a form where I can input my chosen username and password,
// And ensure if I click on the submit button, my username and password gets stored so I can login with these later."
*/

//`

let registrationButton = document.getElementById('submit_button');
let logInButton = document.getElementById('sign_in_button');
let registration = '/registration';
let signUp = '/sign-in';

registrationButton.addEventListener("click", function (event) {
    event.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    sendUserInfo(username, password, registration);
});
logInButton.addEventListener("click", function (event) {
    event.preventDefault();
    let username = document.getElementById('usernameSI').value;
    let password = document.getElementById('passwordSI').value;
    sendUserInfo(username, password, signUp, setSessionUser);
});

function sendUserInfo(username, password, string, callback) {

    fetch(string, {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify({'username': username, 'password': password}),
        cache: "no-cache",
        headers: new Headers({'content-type': 'application/json'})
    }).then(function (response) {
        console.log(response);
        return response.json()
    }).then(function (message) {
            window.alert(message.response);
        }
    );
    if (callback) {
                callback(username)
            }
}

function setSessionUser(user) {
    sessionStorage.setItem('username', user)
}