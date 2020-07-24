const username = document.getElementById('email')
const pass = document.getElementById('pass')
const login = document.getElementById('login')
const form = document.querySelector('form')
const msg = document.getElementById('msg-container')
const signUp = document.getElementById('signUp')

signUp.addEventListener('click', async (e) => {
    e.preventDefault()
    window.location = '/signUp';
})

login.addEventListener('click', async (e) =>{
    e.preventDefault()
    const email = username.value;
    const password = pass.value;
    const body = {
        email,
        password
    }
    fetch('/api/users/login', {
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
    })
    .then(user => {
        document.cookie = `token=${user.token}`;
        window.location = '/user';
    }).catch(e => {
        msg.style.display = "block"
        setTimeout(() => {
            msg.style.display ="none"
        }, 3000)
    })
})