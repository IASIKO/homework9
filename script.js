let mainWraperPosts = document.getElementById('main-block')
let overlay = document.getElementById('overlay-block')
let content = document.getElementById('content')
let closeIcon = document.getElementById('close')
let addButton = document.getElementById('add')
let postOverlayAdd = document.getElementById('postoverlay')
let form = document.getElementById('form')

function ajaxFunction(url, callback) {
    let request = new XMLHttpRequest()
    request.open('GET',url)
    request.addEventListener('load', function () {
        let dataInfoJs = JSON.parse(request.responseText)
        callback(dataInfoJs)
    })
    request.send()
}

ajaxFunction('https://jsonplaceholder.typicode.com/posts', function(dataInfoJs){
    dataInfoJs.forEach(element => {
        createPost(element)
    });
})

function createPost(item) {
    let divwraper = document.createElement('div')
    divwraper.classList.add('posts')
    divwraper.setAttribute('data-id',item.id)

    let h3Tag = document.createElement('h3')
    h3Tag.textContent = item.id
    h3Tag.classList.add('titleid')

    let h2Tag = document.createElement('h2')
    h2Tag.textContent = item.title
    h2Tag.classList.add('titlepost')

    let deleteButton = document.createElement('button')
    deleteButton.textContent = 'Delete Post'
    deleteButton.classList.add('deletepost')
    deleteButton.setAttribute('data-id', item.id)

    divwraper.appendChild(h3Tag)
    divwraper.appendChild(h2Tag)
    divwraper.appendChild(deleteButton)

    divwraper.addEventListener('click', function(event){
        let id = event.target.getAttribute('data-id')

        overlay.classList.add('active')
        let url = `https://jsonplaceholder.typicode.com/posts/${id}`
        ajaxFunction(url, function(dataInfoJs){
            overlayFunction(dataInfoJs)
        })
    })

    deleteButton.addEventListener('click', function(event){
        event.stopPropagation();
        let id = event.target.getAttribute('data-id')
        let url = `https://jsonplaceholder.typicode.com/posts/${id}`
        fetch(url, {
            method:'DELETE'
        })
        .then( () => divwraper.remove())
    })

    mainWraperPosts.appendChild(divwraper)
}
addButton.addEventListener('click', function(){
    postOverlayAdd.classList.add('addPost')
})

form.addEventListener('submit', function(event){
    event.preventDefault();
    let formData = {
        title: event.target[0].value,
        body: event.target[1].value
    }
    fetch(`https://jsonplaceholder.typicode.com/posts`, {
    method: 'POST',
    body: JSON.stringify({formData}),
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
    },
})
    .then((response) => response.json())
    .then((newpost) => afrerPostSave(newpost))
})

function afrerPostSave(newpost) {
    createPost(newpost);
    postOverlayAdd.classList.remove('addPost')
}


function overlayFunction(item) {
    let description = document.createElement('p')
    description.textContent = item.body
    description.classList.add('descr')

    
    content.appendChild(description)
}

closeIcon.addEventListener('click', function(){
    overlay.classList.remove('active')
    content.innerHTML = ''
})