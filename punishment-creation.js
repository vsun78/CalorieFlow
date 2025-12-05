const groupID = localStorage.getItem('currentGroupId');
const currentUserEmail = localStorage.getItem('userEmail');
const backendUrl = "http://localhost:8080/api/groups/get";
const params = new URLSearchParams({groupID: groupID});
const fullUrl = `${backendUrl}?${params.toString()}`;
const punishmentForm = document.getElementById("create-punishment-form");
const punishmentDisplay = document.getElementById("punishment-group");
const assignPunishmentUrl = "http://localhost:8080/api/punishments/assign";

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

    punishmentForm.addEventListener('submit', handlePunishmentSubmission);
})
.catch(error =>{
    alert(htmlEscape(error.message));
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

            const escapedUsername = htmlEscape(member.username);

            inputHTML += `
            <section class = "person-section">
                <label for="${inputId}">Enter a punishment for ${escapedUsername}</label>
                <input type="text" id="${inputId}" data-target-email ="${member.email}" required>
            </section>`;
        }
    })

    punishmentDisplay.innerHTML = `
            <h1>Assign Punishments for the group</h1>
            ${inputHTML}
        `;
}

async function handlePunishmentSubmission(e)
{
    e.preventDefault();

    const punishmentInputs = punishmentDisplay.querySelectorAll('input[type="text"]');
    const submissionTasks = [];

    for(const input of punishmentInputs){
        const targetEmail = input.getAttribute('data-target-email');
        const details = input.value.trim();

        if(details){
            submissionTasks.push(submitPunishmentTask(targetEmail, details));
        }

        
    }

    try{
            await Promise.all(submissionTasks);
            alert("Success! All punishments assigned. Going to home page");
            window.location.href="home.html";
        }
        catch(error){
            alert(`Error during assignment: ${htmlEscape(error.message)}`);
        }

}

async function submitPunishmentTask(targetEmail, details)
{
    const params = new URLSearchParams({
        assignerEmail: currentUserEmail,
        targetEmail: targetEmail,
        details: details
    })

    const fullUrl = `${assignPunishmentUrl}?${params.toString()}`;
    const response = await fetch(fullUrl, {method: 'POST'});

    if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message);

    }

    return response.json();
}




