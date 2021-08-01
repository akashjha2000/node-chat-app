const socket=io()
//Elements
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $sendLocationButton=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')

//Templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationMessageTemplate=document.querySelector('#location-message-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//eventlistner

//Auto scrolling
const autoscrool=()=>{
    //New message element
    $newMessage=$messages.lastElementChild

    //Height of the new message
    const newMessagesStyle=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessagesStyle.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight=$messages.offsetHeight
    //height of mesages container
    const containerHeight=$messages.scrollHeight

    //How far have i scrolled?
    const scroolOffset=$messages.scrollTop + visibleHeight

    if(containerHeight-newMessageHeight <=scroolOffset){
        $messages.scrollTop=$messages.scrollHeight
    }
}

socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscrool()
})


//Options
const {username,room}=Qs.parse(location.search,{ ignoreQueryPrefix:true })


//eventlistner
socket.on('locationMessage',(message)=>{
    console.log(message)
    const html=Mustache.render(locationMessageTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscrool()
})


socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML=html
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    
    //disable
    $messageFormButton.setAttribute('disabled','disabled')

    
    const message=e.target.elements.message.value
    socket.emit('sendMessage',message,(error)=>{

        //enable
        $messageFormButton.removeAttribute('disabled','disabled')

        $messageFormInput.value=''
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }
        console.log('Message delivered')
    })
})


$sendLocationButton.addEventListener('click',()=>{

    if(!navigator.geolocation){
        return alert('Geolocation is not supportded by your Browser.') 
    }

    $sendLocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})

socket.emit('join',{ username,room},(error)=>{
    if(error)
    {
        alert(error)
        location.href='/'
    }
})