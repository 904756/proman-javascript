let registrationBox = document.getElementById('registration');
let signInBox = document.getElementById('sign_in');
let registrationButton = document.getElementById('submit_button');
let logInButton = document.getElementById('sign_in_button');
let registration = '/registration';
let signUp = '/sign-in';
let count = 0;
let newBoardButton = document.getElementById('newBoard');

window.onload = function () {
    loadExistingBoards()


};

function loadExistingStories(board, div) {
    fetch('/all-stories').then((response) => {
            return response.json()
        }
    ).then((data) => {
            for (let story of Object.values(data)) {
                if (story['board_id'] === board['board_id']) {
                    let boardDiv = document.createElement('div');
                    boardDiv.className = 'stories';
                    boardDiv.innerText = story['story_name'];
                    div.appendChild(boardDiv)
                }
            }
        }
    )
}

function loadExistingBoards() {
    fetch('/all-boards').then((response) => {
            return response.json()
        }
    ).then((data) => {
            let boards = document.getElementById('boards');
            for (let elem of data) {
                let div = document.createElement('div');
                let button = document.createElement('button');
                button.className = 'expand';
                button.innerText = 'v';
                div.innerText = elem['board_name'];
                div.appendChild(button);
                let storiesDiv = document.createElement('div');
                button.onclick = function() {
                loadExistingStories(elem, storiesDiv)};
                let closeButton = document.createElement('button');
                closeButton.innerText = '^';
                closeButton.onclick = function(){closeDiv(storiesDiv)};
                boards.appendChild(closeButton);
                div.appendChild(storiesDiv);
                boards.appendChild(div);

            }
        }
    )
}


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