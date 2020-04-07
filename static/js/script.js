/* "Given my application server is started,
 When I open the root url (/),
  Then ensure that there is a register link on the page,
// And ensure if I click on it, I see a registration page with a form where I can input my chosen username and password,
// And ensure if I click on the submit button, my username and password gets stored so I can login with these later."
*/



let button = document.getElementById('submit_button');

button.addEventListener("click", function getUserInfo(event) {
    event.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
})

