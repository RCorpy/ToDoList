const taskForm = document.getElementById("input-form")
const taskList = document.querySelector(".taskList")
const save = document.querySelector(".save")

const socket = io();

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const description = event.target.elements.description.value
    const date = event.target.elements.date.value

    let task = {description: description, date:date}

    outputTask(task)
    console.log("sent")
})

function outputTask(task, finished){
    const div = document.createElement('div')
    div.classList.add('task')
    if(finished){div.classList.add("finished")}
    div.addEventListener('click', () => {if(div.classList.contains("finished")){
        div.classList.remove("finished")}
    else{
        div.classList.add("finished")
    }})
    div.addEventListener('dblclick', () => {div.remove()})
    div.innerHTML = `<p>${task.description} <span>${task.date}</span></p>`
    taskList.appendChild(div)
}

socket.on('sendTasks', data =>{
    data.split("//").slice(0,-1).forEach(element =>{
        let splittedTask = element.split(",")
        let description = splittedTask[0]
        let date = splittedTask[1]
        let task = {description:description, date:date}
        let finished = splittedTask[2]
        outputTask(task, finished)
    })
    console.log("retrieved data", data)
})

save.addEventListener('click', () => {
    let toSend = ""
    for(let i = 0; i<taskList.childNodes.length; i++){
        if(taskList.childNodes[i].className == "task finished"){
            toSend +=taskList.childNodes[i].innerHTML.slice(3,-11).split(" <span>").join(",")+",finished"+"//"
        }
        if(taskList.childNodes[i].className == "task"){
            toSend +=taskList.childNodes[i].innerHTML.slice(3,-11).split(" <span>").join(",")+"//"
        }
    }
    socket.emit("updateList", toSend)

})