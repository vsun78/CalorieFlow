const groupID = localStorage.getItem('currentGroupId');
const currentUserEmail = localStorage.getItem('userEmail');
const backendUrl = "http://localhost:8080/api/groups/get";
const params = new URLSearchParams({groupID: groupID});
const fullUrl = `${backendUrl}?${params.toString()}`;
const punishmentForm = document.getElementById("create-punishment-form");
const punishmentDisplay = document.getElementById("punishment-group");

fetch(fullUrl, {method: `GET`})
.then(response =>{
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
.then(data =>{
    // data is the List<User>
    renderPunishmentPage(data);
})
.catch(error =>{
    alert(error.message);
});

function renderPunishmentPage(membersList)
{   
    let count = 1;
    let inputHTML = '';
    membersList.forEach(member =>{
        if(member.email !== currentUserEmail)
        {
            const inputId = `punishment-input-${count}`;
            count++;

            inputHTML += `
            <section class = "person-section">
                <label for="${inputId}">Enter a punishment for ${member.username}</label>
                <input type="text" id="${inputId}" required>
            </section>`;
        }
    })

    punishmentDisplay.innerHTML = `
            <h1>Assign Punishments for the group</h1>
            ${inputHTML}
        `;
}





