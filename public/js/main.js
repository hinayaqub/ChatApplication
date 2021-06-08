const socket = io();
const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const {username, room} = Qs.parse(location.search,
    {ignoreQueryPrefix: true }
)


socket.on('roomUsers', ({room, users})=>{
    outputRoomName(room);
    outputUserList(users)
})


socket.emit('joinRoom', {username, room});
socket.on('message', msg=>{
   console.log(`${msg}`)
   outputMessage(msg)
   chatMessage.scrollTop = chatMessage.scrollHeight
})

chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg)
    e.target.elements.msg.value ='';
    e.target.elements.msg.focus();
})



function outputMessage(message)
{
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
     ${message.text}
  </p>`
  document.querySelector('.chat-messages').appendChild(div)
}


function outputRoomName(room)
{
    roomName.innerText = room
}


function outputUserList(users)
{
    userList.innerHTML = `
    ${users.map(user=>`<li>${user.username}</li>`).join('')}`
}