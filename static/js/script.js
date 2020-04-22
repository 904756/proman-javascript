window.addEventListener('load', function () {
    loadExistingBoards();
    let header = document.getElementById('head');
    if ('username' in localStorage) {
        header.innerHTML = '';
        header.innerHTML = ' <img  style="width: 180px" src="../static/logo.png" alt="">' + '<a href="#" style="color: white">' + localStorage.getItem('username') + '</a>' + '   ' + '<a href="/log-out" onclick="logOut()" style="color: white">Sign out</a>'
    } else {
        header.innerHTML = '';
        header.innerHTML =
            ' <img  style="width: 180px" src="../static/logo.png" alt="">' +
            '<a href="#" style="color: white" onclick="showElement(signInBox);hideElement(registrationBox);">Sign in</a>' + "  " +
            '<a href="#" style="color: white" onclick="showElement(registrationBox);hideElement(signInBox)">Sign up</a>'
    }
});
// window.addEventListener('change', loadExistingBoards);

//Display Board Functions


function loadExistingBoards() {
    fetch('/all-boards').then((response) => {
            return response.json()
        }
    ).then((data) => {
            let boards = document.getElementById('boards');
            if ('username' in localStorage) {
                for (let elem of data) {
                    if (elem['username'] === localStorage.getItem('username') || elem['username'] === null) {
                        let deleteButton = document.createElement('button');
                        deleteButton.style.backgroundColor = 'white';
                        deleteButton.style.border = 'none';
                        deleteButton.style.float = 'right';
                        deleteButton.classList.add('fa fa-trash');
                        deleteButton.addEventListener('click', function (event) {
                            fetch('/delete', {
                                method: 'POST',
                                credentials: "include",
                                body: JSON.stringify({'board': elem['board_id']}),
                                cache: "no-cache",
                                headers: new Headers({'content-type': 'application/json'})
                            }).then((res) => res.json()).then(() => {
                                window.location.reload()
                            })
                        });
                        let div = document.createElement('div');
                        let button = document.createElement('button');
                        button.className = 'expand';
                        button.innerHTML='<i class="fas fa-sort-down fa-lg"></i>';
                        div.innerHTML = `<h5 id="board-id-` + elem.board_id + `" contenteditable="true" onfocusout="updateBoardTitle(` + elem.board_id + `)">` + elem.board_name + `</h5>`;

                        let storiesDiv = document.createElement('div');
                        button.onclick = function () {
                            loadExistingStories(elem, storiesDiv);
                            div.style.paddingBottom = '400px';
                        };
                        let closeButton = document.createElement('button');
                        closeButton.innerHTML='<i class="fas fa-sort-up fa-lg"></i>';
                        closeButton.onclick = function () {
                            closeDiv(storiesDiv);
                            div.style.paddingBottom = '0px';
                        };
                        div.appendChild(deleteButton);
                        div.appendChild(closeButton);
                        div.appendChild(button);
                        div.appendChild(storiesDiv);
                        div.className = 'story';
                        boards.appendChild(div);

                    }
                }
            } else if (localStorage.getItem('username') === null) {
                for (let elem of data) {
                    if (elem['username'] === null) {
                        let deleteButton = document.createElement('button');
                        deleteButton.style.border = 'none';
                        deleteButton.innerHTML='<i class="fa fa-trash-o fa-2x"></i>';
                        deleteButton.style.backgroundColor = 'white';
                        deleteButton.style.marginLeft ='300px';
                        deleteButton.addEventListener('click', function (event) {
                            fetch('/delete', {
                                method: 'POST',
                                credentials: "include",
                                body: JSON.stringify({'board': elem['board_id']}),
                                cache: "no-cache",
                                headers: new Headers({'content-type': 'application/json'})
                            }).then((res) => res.json()).then(() => {
                                window.location.reload()
                            })
                        });
                        let container = document.createElement('div');
                        let div = document.createElement('div');
                        let button = document.createElement('button');
                        button.className = 'expand';
                        button.style.backgroundColor = 'white';
                        button.style.border = 'none';
                        button.innerHTML='<i class="fa fa-angle-down"></i>';
                        div.innerHTML = `<h5 id="board-id-` + elem.board_id + `"contenteditable="true" onfocusout="updateBoardTitle(` + elem.board_id + `)">` + elem.board_name + `</h5>`;
                        let line = document.createElement('div');
                        line.className = 'empty-bar-board';
                        let storiesDiv = document.createElement('div');
                        button.onclick = function () {
                            loadExistingStories(elem, storiesDiv);
                            div.style.paddingBottom = '400px';
                        };
                        let closeButton = document.createElement('button');
                        closeButton.innerHTML='<i class="fa fa-angle-up"></i>';
                        closeButton.style.border = 'none';
                        closeButton.style.backgroundColor = 'white';
                        closeButton.onclick = function () {
                            closeDiv(storiesDiv);
                            div.style.paddingBottom = '0px';

                        };

                        div.appendChild(closeButton);
                        div.appendChild(button);
                        div.appendChild(deleteButton);
                        div.appendChild(line);
                        container.appendChild(storiesDiv);
                        container.className = 'container';
                        div.appendChild(container);
                        div.className = 'story';
                        boards.appendChild(div);


                    }
                }
            }
        }
    )
}

let newCardForm = document.getElementById('card');

function divideStoriesInColumns(data, div, board) {
    let countCard = 1;
    let newCard = document.createElement('button');
    newCard.innerHTML='<i class="fa fa-plus-circle fa-3x"></i>';
    newCard.className = 'addbtn';
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
    let colHeaders = ['New', 'Progress', 'Testing', 'Done'];
    for (let header of colHeaders) {
        let head = document.createElement('div');
        head.innerHTML = '<h3 class="headers">' + header + '</h3>';
        let empty = document.createElement('div');
        empty.className = 'empty-bar';
        head.appendChild(empty);
        head.className = 'header';
        head.classList.add(header);
        head.ondrop = function (event) {
            drop(event, head.classList[1])
        };
        head.ondragover = function (event) {
            allowDrop(event);
            console.log("il primesc");
        };
        for (let story of Object.values(data)) {
            if (story['column_name'] === header && story['board_id'] === board['board_id']) {
                let cardDiv = document.createElement('div');
                cardDiv.innerText = story['story_name'];
                cardDiv.id = (countCard).toString();
                countCard++;
                cardDiv.style.border = '1px black solid';
                cardDiv.style.fontSize = '25px';
                cardDiv.style.width = '150px';
                cardDiv.style.margin = '10px 0px 0px 10px';

                cardDiv.setAttribute('draggable', true);
                cardDiv.ondragstart = function (event) {
                    drag(event)
                };
                head.appendChild(cardDiv);
            }
            // else{
            //     let br = document.createElement('br');
            //     head.appendChild(br);
            // }
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
    }).then(() => {
        // loadExistingStories(this.parent.parent, this.parent)
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
    let boardInfo = {
        'name': boardName.value,
        'username': localStorage.getItem('username')
    };
    fetch('/new-board', {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify(boardInfo),
        cache: "no-cache",
        headers: new Headers({'content-type': 'application/json'})
    }).then((response) => {
        return response.json()
    }).then(() => {
        loadExistingBoards();
    })
}

function updateBoardTitle(boardId) {
    let elementToSelect = "board-id-" + boardId;
    let titleValue = document.getElementById(elementToSelect);
    console.log(titleValue);

    let data = {
        'board_id': boardId,
        'new_name': titleValue.innerText,
    };

    let settings = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data),
    };

    fetch('/update-board', settings)
        .then((serverResponse) => {
            return serverResponse.json();
        })
        .then(() => {
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
            console.log(message.response);
        }
    );
    if (callback) {
        callback(username);
    }
}

function setSessionUser(user) {
    localStorage.setItem('username', user);
    let header = document.getElementById('head');
    header.innerHTML = '';
    header.innerHTML = '<a href="#">' + user + '</a>' + '   ' + '<a href="/log-out" onclick="logOut()">Sign out</a>'
}

function logOut() {
    localStorage.removeItem('username');
    let header = document.getElementById('head');
    header.innerHTML = '';
    header.innerHTML = '<a href="#">Sign in</a>' + "  " + "   " +
        '<a href="#">Sign up</a>'
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event, header) {
    event.preventDefault();
    let data = event.dataTransfer.getData("text");
    console.log(header);
    event.target.appendChild(document.getElementById(data));
    fetch(
        '/update-status', {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify({
                'storyName': document.getElementById(data).innerText,
                'columnName': header
            }),
            cache: "no-cache",
            headers: new Headers({'content-type': 'application/json'})
        }
    ).then((res) => {
        return res.json()
    });

}

function allowDrop(event) {
    event.preventDefault();
}