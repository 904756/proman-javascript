/* "Given my application server is started,
 When I open the root url (/),
  Then ensure that there is a register link on the page,
// And ensure if I click on it, I see a registration page with a form where I can input my chosen username and password,
// And ensure if I click on the submit button, my username and password gets stored so I can login with these later."
*/

//`
let registrationBox = document.getElementById('registration');
let signInBox = document.getElementById('sign_in');
let registrationButton = document.getElementById('submit_button');
let logInButton = document.getElementById('sign_in_button');
let registration = '/registration';
let signUp = '/sign-in';
let count = 0;
let newBoardButton = document.getElementById('newBoard');
newBoardButton.onclick = function () {
    let allBoards = document.getElementById('boards');
    count += 1;
    let board = '<div class ="board"> <button class="expand" onclick="expand(this.parentElement)">v</button>Board number' + count + '</div>';
    allBoards.innerHTML += board
};

function expand(div) {
    div.innerHTML += boxContent;
    let closeButtons = document.getElementsByClassName('close');
    for (let button of closeButtons) {
        button.onclick = function () {
            closeDiv(button.parentNode);
            console.log(button.parentNode)
        }
    }
}

let boxContent = '<div id="opened"><button class="close">^</button><table><tr><td>AAAAA</td><td>AAAAA</td><td>AAAAA</td><td>AAAAA</td></tr>' +
    '<tr><td>BBBBB</td><td>BBBBB</td><td>BBBBB</td><td>BBBBB</td></tr>' +
    '<tr><td>CCCCC</td>CCCCC<td></td>CCCCC<td>CCCCC</td></tr>' +
    '<tr><td>DDDDD</td>DDDDD<td></td>DDDDD<td>DDDDD</td></tr>' +
    '</table></div>';

function closeDiv(div) {
    div.innerHTML = '';
}

registrationButton.addEventListener("click", function (event) {
    event.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    sendUserInfo(username, password, registration);
    hideElement(registrationBox)
});
logInButton.addEventListener("click", function (event) {
    event.preventDefault();
    let username = document.getElementById('usernameSI').value;
    let password = document.getElementById('passwordSI').value;
    sendUserInfo(username, password, signUp, setSessionUser);
    hideElement(signInBox)
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
        callback(username);
    }
}

function setSessionUser(user) {
    sessionStorage.setItem('username', user);
    let header = document.getElementById('head');
    header.innerHTML = '';
    header.innerHTML = '<a href="#">' + user + '</a>' + '   ' + '<a href="/log-out" onclick="logOut()">Sign out</a>'
}

function logOut() {
    sessionStorage.removeItem('username');
    let header = document.getElementById('head');
    header.innerHTML = '';
    header.innerHTML = '<a href="#">Sign in</a>' + "  " +
        '<a href="#">Sign up</a>'
}

function showElement(element) {
    element.style.display = 'flex';
}

function hideElement(element) {
    element.style.display = 'none';
}