const avatar =  document.getElementById('avatar')
const profilePic = document.getElementById('profilePic')
const name = document.getElementById('name')
const email = document.getElementById('email')
const age = document.getElementById('age')
const date = document.getElementById('date')
const setAvatar = document.getElementById('setAvatar')

function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

function main(user) {
    avatar.setAttribute('src', `/api/users/${user._id}/avatar`)
    profilePic.setAttribute('src', `/api/users/${user._id}/avatar`)
    name.textContent += ` ${user.name}`
    email.textContent += ` ${user.email}`
    age.textContent += ` ${user.age}`
    date.textContent += ` ${user.createdAt.slice(0,10)}`

    logout.addEventListener('click', () =>{
        fetch('/api/users/logout', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getCookie('token')}`
            }
        }).then(res => {
            if(res.ok) {
                window.location = "/"
            }
        })
    })

    taskBtn.addEventListener('click', () => {
        window.location = "/user"
    })

}

async function uploadPic(data){
    const settings = {
        method: 'POST',
        body: data,
        headers: {
            Authorization: `Bearer ${getCookie('token')}`
        }
    };

    try {
        const fetchResponse = await fetch(`/api/users/me/avatar`, settings);
        const data = await fetchResponse.json();
        return data;
    } catch (e) {
        return e;
    }    

}

fetch('/api/users/me', {
    headers: {
        Authorization: `Bearer ${getCookie('token')}`
    }
}).then(res => {
    if (res.ok) {
        return res.json();
    }
    throw res;
}).then((user) => {
    main(user);
}).catch(() => {
    window.location = "/";
});

const toggle = document.getElementById('toggle');
const taskBtn = document.getElementById('Task-Manager');

toggle.addEventListener('click', ()=> document.body.classList.toggle('show-nav'));

setAvatar.addEventListener('change', async () => {
    const file = setAvatar.files[0];
    
    const data = new FormData()

    data.append("upload", file)

    await uploadPic(data)
    location.reload(true)
    
})
