const taskContainer = document.querySelector('.task-container'),
    input = document.querySelector('input'),
    createBtn = document.querySelector('.create-button'),
    form = document.querySelector('.form'),
    overlay = document.querySelector('.overlay'),
    modal = document.querySelector('.modal'),
    updateContainer = document.querySelector('.update-contianer'),
    updateInput = document.querySelector('.update-input'),
    updateBtn = document.querySelector('.update-btn'),
    taskDone = document.querySelector('.task-done'),
    stats = document.querySelector('.stats'),
    statsContent = document.querySelector('.stats-content'),
    statsContainer = document.querySelector('.stats-container'),
    complateMessage = document.querySelector('.complate-message')

let taskList = []

if(!localStorage.getItem('tasks')) localStorage.setItem('tasks', JSON.stringify(taskList))
else taskList = JSON.parse(localStorage.getItem('tasks'))

function taskDoneFunction() {
    let completedTasks = taskList.filter(item => item.taskComplate === true)
    if (completedTasks.length !== taskList.length || taskList.length === 0) {
        stats.classList.remove('hidden')
        statsContent.classList.remove('hidden')
        taskDone.innerHTML = `${completedTasks.length}/${taskList.length}`
        if(!complateMessage.classList.contains('hidden')) complateMessage.classList.add('hidden')
    }
    else {
        stats.classList.add('hidden')
        statsContent.classList.add('hidden')
        complateMessage.classList.remove('hidden')
    }
}
taskDoneFunction()

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const value = input.value.trim()
    if (value.length > 0) {
        taskList.push({
            taskId: Date.now(),
            taskName: value,
            taskComplate: false
        })
        e.target.reset()
    }
    else {
        input.focus()
        input.style.borderColor = 'red'
        setTimeout(() => {
            input.style.borderColor = 'transparent'
        }, 2000);
    }
    taskDoneFunction()
    getTasks()
    localStorage.setItem('tasks', JSON.stringify(taskList))
})

function taskComplated(id) {
    taskList = taskList.map(item => {
        if (item.taskId == id) {
            return {
                ...item,
                taskComplate: !item.taskComplate
            }
        }
        else {
            return item
        }
    })
    getTasks()
    taskDoneFunction()
    localStorage.setItem('tasks', JSON.stringify(taskList))
}

function deleteTask(id) {
    taskList = taskList.filter(item => item.taskId != id)
    getTasks()
    localStorage.setItem('tasks', JSON.stringify(taskList))
}

overlay.addEventListener('click', () => {
    modal.classList.add('hidden')
})

let updatingTaskId = 0

function updatingTask(id) {
    updatingTaskId = id;
    modal.classList.remove('hidden')
    updateInput.value = taskList.find(item => item.taskId == id)
        .taskName
    updateInput.focus()
}

updateContainer.addEventListener('submit', (e) => {
    e.preventDefault()

    const value = updateInput.value.trim()
    if (value.length > 0) {
        taskList = taskList.map(item => {
            if (item.taskId != updatingTaskId) return item
            else return {
                ...item,
                taskName: value
            }
        })
    }
    else {
        input.focus()
        input.style.borderColor = 'red'
        setTimeout(() => {
            input.style.borderColor = 'transparent'
        }, 2000);
    }
    modal.classList.add('hidden')
    getTasks()
    localStorage.setItem('tasks', JSON.stringify(taskList))
})

function getTasks() {
    taskContainer.innerHTML = ''
    taskList.map((item, index) => {
        taskContainer.innerHTML += `
        <div class="text-white flex justify-between items-center p-[10px] border-[1px] border-gray-400 rounded-md">
            <div class="flex items-center gap-[5px]">
                <i onClick="taskComplated(${item.taskId})" class="fa-solid fa-circle text-green-500 text-[22px] cursor-pointer ${item.taskComplate ? '' : 'hidden'}"></i>
                <i onClick="taskComplated(${item.taskId})" class="fa-regular fa-circle text-green-500 text-[22px] cursor-pointer ${item.taskComplate ? 'hidden' : ''}"></i>
                <p class="text-[20px] ${item.taskComplate ? 'line-through text-gray-500' : ''}">${item.taskName}</p>
            </div>
            <div class="text-[22px]">
                <button onClick="updatingTask(${item.taskId})"><i class="fa-regular fa-pen-to-square hover:scale-[1.05] active:scale-[0.98] duration-200"></i></button>
                <button onClick="deleteTask(${item.taskId})"><i class="fa-regular fa-trash-can hover:scale-105 active:scale-[0.98] duration-200"></i></button>
            </div>
        </div>
    `
    })
}
getTasks()