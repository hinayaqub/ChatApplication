const users = [];

function userJoin(id, username, room)
{
    const user = {id, username, room}
    users.push(user)
    return user
}


function getCurrentUser(id)
{
    return users.find(user=>user.id===id)
}

function leaveUser(id)
{
    const index = users.findIndex(user=>user.id===id)
    return users.splice(index, 1)[0]
}


function RoomUsers(room)
{
    return users.filter(user=>user.room)
}
module.exports = {
    userJoin,
    getCurrentUser,
    leaveUser,
    RoomUsers
}