const avatar = document.getElementById('avatar')
const profile = document.getElementById('profile')
const logout = document.getElementById('logout')
const toolBar = document.getElementById('toolbar')
const cancelBtn = document.getElementById('cancelBtn')
const saveBtn = document.getElementById('saveBtn')
const taskDescription = document.getElementById('task-description')
const errMsgLabel = document.getElementById('errMsgLabel')

var tasksArr = []

//Front-Back Intergationz

function getCookie(name) {
    var match = document.cookie.split("=");
    if (match) return match[1];
}

function updateTask(id, completed){

    const dbID = tasksArr[id]._id

    console.log(dbID)

    body = {
        completed
    }

    fetch(`/tasks/${dbID}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
            'Content-Type' : 'application/json',
            Authorization: `Bearer ${getCookie('token')}`
        }
    }).then(res => {
        if (res.ok) {
            console.log("OK")
            return res.json();
        }
        throw res;
    }).then((task) => {
        console.log(task)
    }).catch((e) => {
        console.log(e)
    });
}

function deleteTask(id){
    const dbID = tasksArr[id]._id

    console.log(dbID)

    fetch(`/tasks/${dbID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json',
            Authorization: `Bearer ${getCookie('token')}`
        }
    }).then(res => {
        if (res.ok) {
            console.log("OK")
            return res.json();
        }
        throw res;
    }).then((task) => {
        console.log(task)
    }).catch((e) => {
        console.log(e)
    });
}


function addTaskFunction(description){
    const taskEl = document.createElement('div')
    taskEl.classList.add('task')
    taskEl.id = tasksArr.length
    taskEl.innerHTML += `
    <input class="chkInput" type="checkbox">
    <span class="checkmark" id="${tasksArr.length}"><i class="fas fa-check"></i><i class="fa-remove"></i></span>
    <p class="taskTxt">${description}</p>`;

    const completed = false;

    const body = {
        description,
        completed
    }

    fetch('/tasks', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type' : 'application/json',
            Authorization: `Bearer ${getCookie('token')}`
        }
    }).then(res => {
        if (res.ok) {
            console.log("OK")
            return res.json();
        }
        throw res;
    }).then((task) => {
        tasksArr.push(task)
    }).catch((e) => {
        console.log(e)
    });


    container.appendChild(taskEl)
}

function main(user) {
    avatar.setAttribute('src', `/api/users/${user._id}/avatar`)
    profile.addEventListener('click', () => {
        window.location = "/profile"
    })
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
    });

    fetch('/tasks', {
        headers: {
            Authorization: `Bearer ${getCookie('token')}`
        }
    }).then(res => {
        if(res.ok){
            return res.json();
        }
        throw res;
    }).then((tasks) => {
        if(tasks === undefined || tasks.length == 0){
            console.log("no tasks")
        } else {
            populate(tasks)
            document.body.addEventListener('click', (e) => {
                if (e.target.id.includes('removeBtn')){
                    deleteTask(e.target.parentElement.id)
                    e.target.parentElement.remove()
                }
            })
        }
    }).catch((e) => {
        console.log(e)
    })

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
}).catch((e) => {
    console.log(e)
    window.location = "/";
});

//POPULATE UI WITH BACK END DATA

function populate(tasks){
    tasks.forEach(task => {

        var isChecked = ""
        var faCheck = ""
        if (task.completed){
            isChecked = "checked"
            faCheck = "show"
        }

        const taskEl = document.createElement('div')
        taskEl.classList.add('task')
        taskEl.id = tasksArr.length
        taskEl.innerHTML += `
        <input class="chkInput" type="checkbox">
        <span class="checkmark ${isChecked}"><i class="fas fa-check ${faCheck}"></i></span>
        <p class="taskTxt">${task.description}</p> 
        <i class="fa fa-times" id="removeBtn" aria-hidden="true"></i>`;
        container.appendChild(taskEl)
        tasksArr.push(task)
    });
}

//UI

const toggle = document.getElementById('toggle');
const checkMark = document.querySelector('.checkmark');
const mark = document.querySelector('.mark');
const container = document.querySelector('.container')
const addTask = document.querySelector('.add-task')

document.body.addEventListener('click', (e) => {
    if(e.target.className.includes('checkmark') && !e.target.className.includes('checked')){
        e.target.classList.add('checked')
        updateTask(e.target.parentNode.id, true)
        e.target.querySelector('.fa-check').classList.add('show')
    } else if(e.target.className.includes('fa-check') && !e.target.className.includes('show')){
        e.target.parentElement.classList.add('checked')
        e.target.classList.add('show')
        updateTask(e.target.parentNode.parentNode.id, true)
    } else if(e.target.className.includes('checked')){
         e.target.classList.remove('checked')
         e.target.querySelector('.fa-check').classList.remove('show')
         updateTask(e.target.parentNode.id, false)
    } else if(e.target.className.includes('show')){
        e.target.parentElement.classList.remove('checked')
        e.target.classList.remove('show')
        updateTask(e.target.parentNode.parentNode.id, false)
    }
})

toggle.addEventListener('click', ()=> document.body.classList.toggle('show-nav'));

addTask.addEventListener('click', () => {
   toolBar.classList.toggle('show')
})

saveBtn.addEventListener('click', () => {
    if (taskDescription.value.trim().length == 0){
        errMsgLabel.classList.add("show")
        setTimeout(() => {
            errMsgLabel.classList.remove("show")
        }, 3000)
    } else {
        addTaskFunction(taskDescription.value)
    }
})

cancelBtn.addEventListener('click', () => {

    taskDescription.value = "";
    toolBar.classList.remove('show')
    
})
