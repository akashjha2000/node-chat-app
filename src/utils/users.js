const users=[]

//now creating four functions
//1.addUser-allowing us to track a new user
//2.removeUser-allowing us to stop tracking a user when a user leave the room
//3.getUser-allowing us to fetch an existing user
//4.getUsersInRoom-allowing us to get complete list of users in a specific room

const addUser=({id,username,room})=>{
    //clean the data(convert to lowercase and also trim them)
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    
    //validate the data
    if(!username||!room){
        return {
            error:'Username and Room are required!'
        }
    }

    //check for existing user
    const existingUser=users.find((user)=>{
        return user.room===room &&user.username===username
    })

    //validate user
    if(existingUser){
        return {
            error:'Username is in use!'
        }
    }

    //store user
    const user={id,username,room}
    users.push(user)
    return {user}
}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })
    if(index!==-1)
    {
        return users.splice(index,1)[0]
    }
}


const getUser=(id)=>{
    return users.find((user)=>user.id===id
    )
}

const getUsersInRoom=(room)=>{
    room:room.trim().toLowerCase()
    return users.filter((user)=>user.room===room)
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}