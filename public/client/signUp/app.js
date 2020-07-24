var formMain = document.getElementById('form');
var nameField = document.getElementById('name');
var emailField = document.getElementById('email');
var passwordField = document.getElementById('password');
var password2 = document.getElementById('password2');
var backBtn = document.getElementById('backBtn');

function showError(input, msg){
    const formControl = input.parentElement;
    formControl.className = 'form-control error'
    const small = formControl.querySelector('small');
    small.innerText = msg;
}

function showSuccess(input){
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

function check(inputArr){
    inputArr.forEach((input) => {
        if (input.value.trim() === ''){
            if (input.id === 'password2'){
                showError(input, 'Password is required');
                return false
            } else {
                showError(input, getFieldName(input) + 'is required');
                return false
            }
        } else {
            showSuccess(input);
        }
    });
    return true
}

function getFieldName(input){
    return input.id.charAt(0).toUpperCase() + input.id.slice(1) + " ";
}

function checkEmail(input){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(input.value.trim())){
        showSuccess(input);
        return true
    } else{
        showError(input, 'Email is not valid');
        return false
    }
}

function checkLength(input, min, max){
    
    if(input.value.length < min){
        showError(input, `${getFieldName(input)} must be at least ${min} characters`)
        return false
    } else if(input.value.length > max){
        showError(input, `${getFieldName(input)} must be less than ${max} characters`)
        return false
    }
    return true
}

function checkPassMatch(input1, input2){
    if(input1.value !== input2.value){
        showError(input2, 'Passwords do not match');
        return false
    }
    return true
}

function setCookie(token){
    document.cookie = `token=${token}; path=/`;
    console.log("from function" + document.cookie)
}

backBtn.addEventListener('click', function(e){
    e.preventDefault();
    window.location = '/';
})

formMain.addEventListener('submit', function(e){
    e.preventDefault();
    if (check([nameField, emailField, passwordField, password2]) && checkLength(nameField, 3, 15) && checkLength(passwordField, 3, 25) &&  checkEmail(emailField) &&  checkPassMatch(passwordField, password2)) {
        console.log("went in")
        const email = emailField.value;
        const name = nameField.value;
        const password = passwordField.value;

        const body = {
            name,
            email,
            password
        }

        fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(body),
            headers:{
                'Content-Type' : 'application/json'
            }
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
            throw res;
        }).then(user => {
            setCookie(user.token)
            console.log("From .then "+document.cookie)
            window.location = '/user';
        })
     }
});