let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection")
  const getToyForm = document.querySelector('.add-toy-form')

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch('http://localhost:3000/toys')
  .then(res => res.json())
  .then(function (jsonArray) {
  for(let i = 0; i < jsonArray.length; i++) {
    turnToysIntoHTMLElementsInCollection(jsonArray[i])
    }
  })

  function turnToysIntoHTMLElementsInCollection(jsonObj) {
    const getToys = document.createElement('div');
          getToys.classList.add('card')

    const toySpan = document.createElement('span')
    
    const toyName = document.createElement('h2')
          toyName.innerText = jsonObj.name
    
    const toyImage = document.createElement('img')
          toyImage.src = jsonObj.image 
          toyImage.classList.add('toy-avatar')
    
    const toyLikes = document.createElement('p')
          toyLikes.innerText = jsonObj.likes 

    const toyLikesButton = document.createElement('button')
          toyLikesButton.classList.add('like-btn')
          toyLikesButton.innerText = 'Like <3'

    toySpan.append(toyName, toyImage, toyLikes, toyLikesButton)
    getToys.append(toySpan)
    toyCollection.append(getToys);
    
    toyLikesButton.addEventListener("click", function(evt){
      evt.preventDefault()

      fetch(`http://localhost:3000/toys/${jsonObj.id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json'
        },
        body: JSON.stringify({
          'likes' : jsonObj.likes + 1
        })
      })
        .then (response => response.json())
        .then(function(updatedObj) {
          jsonObj = updatedObj
          toyLikes.innerText = updatedObj.likes
        })
    })
  
  }

  getToyForm.addEventListener('submit', function(evt) {
    evt.preventDefault()
    const newToyName = evt.target.name.value
    const newToyImage = evt.target.image.value
    
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        "name": `${newToyName}`,
        "image": `${newToyImage}`,
        "likes": 0
      })
    })
    .then(res => res.json())
    .then(function (newObj){ 
      turnToysIntoHTMLElementsInCollection(newObj)
    })
  })
});


