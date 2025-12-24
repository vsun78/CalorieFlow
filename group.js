// dom vars

const groupNameInput = document.getElementById("groupNameInput");
const onePersonInput = document.getElementById("addPeopleInput");
const groupButton = document.getElementById("create-group-button");
const userEmail = localStorage.getItem('userEmail'); // current user signed in
const addPersonButton = document.getElementById("add-person");
const newMembers = []; // array to hold new members added
const moreMembers = document.getElementById("more-members");
let memberCount = 0; // to increment id

function htmlEscape(str) {
    if (typeof str !== 'string') {
        return str;
    }
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;');
}


// functions
groupButton.addEventListener("click",(e)=>{
    e.preventDefault();
    makeGroup(userEmail,groupNameInput.value)
})

function makeGroup(email, groupName)
{
    const allMemberEmails = [email, ...newMembers];

    const backendUrl = "http://localhost:8080/api/groups/create";
    const params = new URLSearchParams();
    params.append('groupName', groupName);
    allMemberEmails.forEach(memberEmail =>{
        params.append('memberEmails', memberEmail);
    });
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

        localStorage.setItem('currentGroupId', data.id);
        window.location.href="punishment-creation.html";

        
    })
    .catch(error=>{
        console.error("Error during group creation:", error);
        alert(htmlEscape(error.message));
    });
}

// add people to the array
addPersonButton.addEventListener("click",(e)=>{
    e.preventDefault();
    let currentInput;
    if(memberCount === 0)
    {
        currentInput = onePersonInput;
    }else{
        currentInput = document.getElementById(`newEmail_${memberCount}`)
    }
    if (currentInput) {
        try{
            addPerson(currentInput.value);
        }
        catch(error)
        {
            alert(htmlEscape(error.message));
        }
    } else {
        alert("Error: Input field not found.");
    }
});

// validate if that email is unique
function addPerson(email)
{
    if(newMembers.includes(email))
    {
        throw new Error("This person has already been added!");
    }
    if(newMembers.length >= 3)
    {
        throw new Error("Maximum of 4 people per group!");
    }
    if(email === userEmail)
    {
        throw new Error("You are already in the group!");
    }

    const backendUrl = "http://localhost:8080/api/users/get";
    const params = new URLSearchParams({email: email});
    const fullUrl = `${backendUrl}?${params.toString()}`;

    fetch(fullUrl, {method: `GET`})
    .then(response => {
        if(response.ok)
        {
            return response.json();
        }
        else{
            return response.json().then(errorData =>{
                throw new Error(errorData.message);
            })
        }
    })
    .then(data =>{ // email entered is valid
        newMembers.push(email);
        console.log(`Successfully added ${data.username} to the staging list.`)
        console.log(newMembers);


        // add the inputs
        let inputToClear;
        if(memberCount === 0)
        {
            inputToClear = onePersonInput;
        }
        else{
            inputToClear = document.getElementById(`newEmail_${memberCount}`);
        }
        if(inputToClear)
        {
            //inputToClear.value = ""; // Clear only after success
            inputToClear.disabled = true; // prevent re-editing the confirmed email
        }
        
        if(newMembers.length < 3)
        {
            memberCount++;
            moreMembers.insertAdjacentHTML('beforeend', `
            <section class = "form-section">
                    <label for="newEmail_${memberCount}">Add member ${memberCount+1}</label>
                    <input type="email" id="newEmail_${memberCount}" required placeholder="Enter person">
            </section>  `);
        }
        else
        {
            addPersonButton.style.display = 'none';
        }
        

    })
    .catch(error =>{
        alert(htmlEscape(error.message));
    })

    

    

}