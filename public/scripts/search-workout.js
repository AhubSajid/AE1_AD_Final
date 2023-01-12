
const handleSave = async (id) => {
  await fetch('/api/saved-workout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: id})
  })
};


const gymView = (gym) => `

<div class="col-12">
    <div class="card">
        <h5 class="card-header"> ${gym.title} <strong>(search match: ${gym.score})</strong></h5>
        <div class="card-body">
         <p class="card-text">${gym.description}</p>
          <ul class="list-group">
               <li class="list-group-item">Friend: ${gym.friend_name}</li>
                <li class="list-group-item">Time: ${gym.time}</li>
                <li class="list-group-item">Calories: ${gym.calories}</li>
                <li class="list-group-item">Rep: ${gym.rep}</li>
          </ul>
        </div>
        <a href="#" class="btn btn-primary" onclick="handleSave('${gym._id}')">Save</a>
      </div>
 </div>
`;


const handleClick = async () => {
    const searchVal = document.querySelector("#searchInput").value;
    const gymDomRef = document.querySelector("gymItems")
    try {
        const ref = await fetch(`/api/search-workouts/?search=${searchVal}`);
        const searchResults = await ref.json();
        let gymHtml = [];
        searchResults.forEach(gym => {
           gymHtml.push(gymView(gym));
        });
        gymDomRef.innerHTML = gymHtml.join(""); 
    } catch (e) {
        console.log(e);
        console.log('could not search api');
    }
  
}