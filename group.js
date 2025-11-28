// dom vars

const groupNameInput = document.getElementById("groupNameInput");
const onePersonInput = document.getElementById("addPeopleInput");
const groupButton = document.getElementById("create-group-button");
const userEmail = localStorage.getItem('userEmail');

// functions
groupButton.addEventListener("click",(e)=>{
    e.preventDefault();
    makeGroup(userEmail,groupNameInput.value)
})

function makeGroup(email, groupName)
{
    const userData = {
        email: email,
        groupName: groupName 
    }

    const backendUrl = "http://localhost:8080/api/groups/create";
    const params = new URLSearchParams(userData);
    const fullUrl = `${backendUrl}?${params.toString()}`;

    fetch(fullUrl,{
        method: 'POST'
    })
    .then(response =>{
        if(response.ok)
        {
            return response.json();
        }
        else{
            return response.json().then(errorData =>{
                throw new Error(errorData.message);
            });
        }
    })
    .then(data=>{
        console.log("Group creation successful!", data)

        window.location.href="login.html"; // for now
    })
    .catch(error=>{
        console.error("Error during group creation:", error);
        alert(error.message);
    });
}