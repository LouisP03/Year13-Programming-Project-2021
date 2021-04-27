//function definition
function getForm() {
    //retrieves the usernaem and radio input from the user
    var username = String(document.getElementById('usernameEntry').value);
    var radio = String(document.querySelector('input[name="room"]:checked').value);

    //if username length is greater than 12...
    if (username.length > 12) {
        //...break out of function/do nothing
        return false;
    }
    //form the query string 
    var queryString = `?roomID=${radio}&username=${username}`;
    var URL = 'https://compsci-project-2021.herokuapp.com/app.html'+queryString;
    window.location.replace(URL);
    //document.getElementById('test').innerText = String(username) + " " + String(radio);
}

