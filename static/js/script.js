window.onload = function () {
    loadExistingBoards()


};



//Display Board Functions


function loadExistingBoards() {
    fetch('/all-boards').then((response) => {
            return response.json()
        }
    ).then((data) => {
            let boards = document.getElementById('boards');
            for (let elem of data) {
                let deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.addEventListener('click', function (event) {
                    fetch('/delete', {
                        method: 'POST',
                        credentials: "include",
                        body: JSON.stringify({'board': elem['board_id']}),
                        cache: "no-cache",
                        headers: new Headers({'content-type': 'application/json'})
                    }).then((res) => res.json()).then((data) => {console.log(data); window.location.reload()} )
                });
                let div = document.createElement('div');
                let button = document.createElement('button');
                button.className = 'expand';
                button.innerText = 'v';
                div.innerText = elem['board_name'];
                div.appendChild(button);
                let storiesDiv = document.createElement('div');
                button.onclick = function () {
                    loadExistingStories(elem, storiesDiv)
                };
                let closeButton = document.createElement('button');
                closeButton.innerText = '^';
                closeButton.onclick = function () {
                    closeDiv(storiesDiv)
                };
                div.appendChild(closeButton);
                div.appendChild(deleteButton);
                div.appendChild(storiesDiv);
                div.className = 'story';
                boards.appendChild(div);

            }
        }
    )
}

let newCardForm = document.getElementById('card');

function divideStoriesInColumns(data, div, board) {
    let newCard = document.createElement('button');
    newCard.innerText = 'Add';
    newCard.addEventListener('click', function (event) {
        event.preventDefault();
        showElement(newCardForm);
    });
    let createCardButton = document.getElementById('createNewCard');
    createCardButton.addEventListener('click', function (event) {
        // event.preventDefault();
        let cardName = document.getElementById('newCard').value;
        createNewCard(cardName, board['board_id']);
        console.log(cardName);
    });
    div.appendChild(newCard);
    let colHeaders = ['New', 'In progress', 'Testing', 'Done'];
    for (let header of colHeaders) {
        let head = document.createElement('div');
        head.innerText = header;
        head.className = 'header';
        for (let story of Object.values(data)) {
            if (story['column_name'] === header && story['board_id'] === board['board_id']) {
                let cardDiv = document.createElement('div');
                cardDiv.innerText = story['story_name'];
                head.appendChild(cardDiv);
            }
        }

        div.appendChild(head);
    }

}

function loadExistingStories(board, div) {
    fetch('/all-stories').then((response) => {
            return response.json()
        }
    ).then((data) => {
        divideStoriesInColumns(data, div, board)
    })
}

function createNewCard(name, board_id) {
    let cardInfo = {
        'name': name,
        'board_id': board_id,
        'col': 'New'
    };
    fetch('/new-card', {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify(cardInfo),
        cache: "no-cache",
        headers: new Headers({'content-type': 'application/json'})
    }).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data)
    })
}


function closeDiv(div) {
    div.innerHTML = '';
}


//Create New Board Function
let newBoardButton = document.getElementById('newBoard');
let boardForm = document.getElementById('create');
let button = document.getElementById('createNewBoard');
button.addEventListener('click', function (event) {
    saveBoard()
});

function saveBoard() {
    let boardName = document.getElementById('newBoard');
    fetch('/new-board', {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify({'name': boardName.value}),
        cache: "no-cache",
        headers: new Headers({'content-type': 'application/json'})
    }).then((response) => {
        return response.json()
    }).then((data) => {
        console.log(data)
    })
}


//User related functions
let registrationBox = document.getElementById('registration');
let signInBox = document.getElementById('sign_in');
let registrationButton = document.getElementById('submit_button');
let logInButton = document.getElementById('sign_in_button');
let registration = '/registration';
let signUp = '/sign-in';
let count = 0;

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

function showElement(element) {
    element.style.display = 'flex';
}

function hideElement(element) {
    element.style.display = 'none';
}

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