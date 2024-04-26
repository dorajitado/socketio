const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const messageList = room.querySelector('ul');

let roomName;
room.hidden = true;


function showRoom(){
    welcome.hidden =  true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const roForm = room.querySelector('form');
    roForm.addEventListener("submit",handleRoomMsgSubmit );
}


function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("room",input.value, showRoom);
    roomName = input.value;
    input.value = "";
}




function printMessage(message)
{
    const li = document.createElement("li");
    li.innerText = message;
    messageList.appendChild(li);
}


function handleRoomMsgSubmit(event){
    event.preventDefault();
    const input = room.querySelector("input");
    const value = input.value;
    socket.emit("message", input.value, roomName, ()=>{printMessage(`You : ${value}`)});
    input.value="";
    
}
form.addEventListener("submit", handleRoomSubmit)

socket.on("welcome", ()=>{
    printMessage("Join");
})

socket.on("bye", ()=>{
    printMessage("bye");
})

socket.on("message", (value)=>{
    console.log(value)
    printMessage(value);
})