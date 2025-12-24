// DOM vars

const usernameButton = document.getElementById("usernameButton");
const passwordButton = document.getElementById("passwordButton");
const deleteButton = document.getElementById("deleteButton");
const userEmail = localStorage.getItem('userEmail');

const bannerContainer = document.getElementById('bannerContainer');
const achievementsJson = localStorage.getItem('achievementsList');

const currentEmailDisplay = document.getElementById('current-email');
const currentUsernameDisplay = document.getElementById('current-username');
const currentGroupDisplay = document.getElementById('current-group');
const groupID = localStorage.getItem('currentGroupId');

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

async function loadUserInfo() {
    if (!userEmail) {
        currentEmailDisplay.textContent = 'Email: Not logged in';
        currentUsernameDisplay.textContent = 'Username: N/A';
        currentGroupDisplay.textContent = 'Group: N/A';
        return;
    }

    try {
        const backendUrl = "https://calorieflow-production.up.railway.app/api/users/get";
        const params = new URLSearchParams({ email: userEmail });
        const fullUrl = `${backendUrl}?${params.toString()}`;

        const response = await fetch(fullUrl, { method: 'GET' });
        if (response.ok) {
            const userData = await response.json();
            
            const email = userData.email || (userData.present ? userData.value?.email : null);
            const username = userData.username || (userData.present ? userData.value?.username : null);
            const userGroupID = userData.groupID || (userData.present ? userData.value?.groupID : null);
            
            currentEmailDisplay.textContent = `Email: ${htmlEscape(email || userEmail)}`;
            currentUsernameDisplay.textContent = `Username: ${htmlEscape(username || 'N/A')}`;

            if (userGroupID) {
                const groupUrl = "https://calorieflow-production.up.railway.app/api/groups/getGroup";
                const groupParams = new URLSearchParams({ groupID: userGroupID });
                const groupFullUrl = `${groupUrl}?${groupParams.toString()}`;

                try {
                    const groupResponse = await fetch(groupFullUrl, { method: 'GET' });
                    if (groupResponse.ok) {
                        const groupName = await groupResponse.text();
                        currentGroupDisplay.textContent = `Group: ${htmlEscape(groupName)}`;
                    } else {
                        currentGroupDisplay.textContent = `Group: ID ${userGroupID}`;
                    }
                } catch (groupError) {
                    currentGroupDisplay.textContent = `Group: ID ${userGroupID}`;
                }
            } else {
                currentGroupDisplay.textContent = 'Group: Not in a group';
            }
        } else {
            currentEmailDisplay.textContent = `Email: ${htmlEscape(userEmail)}`;
            currentUsernameDisplay.textContent = 'Username: Error loading';
            currentGroupDisplay.textContent = 'Group: Error loading';
        }
    } catch (error) {
        console.error("Error loading user info:", error);
        currentEmailDisplay.textContent = `Email: ${htmlEscape(userEmail)}`;
        currentUsernameDisplay.textContent = 'Username: Network error';
        currentGroupDisplay.textContent = 'Group: Network error';
    }
}

document.addEventListener('DOMContentLoaded', loadUserInfo);

usernameButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const newUsername = prompt("Enter your new username:");
    if (!newUsername) {
        return;
    }

    try {
        const getUserUrl = "https://calorieflow-production.up.railway.app/api/users/get";
        const getUserParams = new URLSearchParams({ email: userEmail });
        const getUserFullUrl = `${getUserUrl}?${getUserParams.toString()}`;

        const userResponse = await fetch(getUserFullUrl, { method: 'GET' });
        if (!userResponse.ok) {
            throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        
        const passwordHash = userData.passwordHash || (userData.present ? userData.value?.passwordHash : null);
        if (!passwordHash) {
            throw new Error("Could not retrieve current password hash");
        }

        const updateUrl = "https://calorieflow-production.up.railway.app/api/users/update";
        const updateParams = new URLSearchParams({
            email: userEmail,
            username: newUsername,
            password: passwordHash
        });
        const updateFullUrl = `${updateUrl}?${updateParams.toString()}`;

        const updateResponse = await fetch(updateFullUrl, { method: 'PUT' });
        if (updateResponse.ok) {
            alert("Username updated successfully!");
            loadUserInfo();
        } else {
            const errorData = await updateResponse.json();
            throw new Error(errorData.message);
        }
    } catch (error) {
        console.error("Error updating username:", error);
        alert(`Error updating username: ${error.message}`);
    }
});

passwordButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const newPassword = prompt("Enter your new password:");
    if (!newPassword) {
        return;
    }

    try {
        const getUserUrl = "https://calorieflow-production.up.railway.app/api/users/get";
        const getUserParams = new URLSearchParams({ email: userEmail });
        const getUserFullUrl = `${getUserUrl}?${getUserParams.toString()}`;

        const userResponse = await fetch(getUserFullUrl, { method: 'GET' });
        if (!userResponse.ok) {
            throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        
        const username = userData.username || (userData.present ? userData.value?.username : null);
        if (!username) {
            throw new Error("Could not retrieve current username");
        }

        const updateUrl = "https://calorieflow-production.up.railway.app/api/users/update";
        const updateParams = new URLSearchParams({
            email: userEmail,
            username: username,
            password: newPassword
        });
        const updateFullUrl = `${updateUrl}?${updateParams.toString()}`;

        const updateResponse = await fetch(updateFullUrl, { method: 'PUT' });
        if (updateResponse.ok) {
            alert("Password updated successfully!");
        } else {
            const errorData = await updateResponse.json();
            throw new Error(errorData.message);
        }
    } catch (error) {
        console.error("Error updating password:", error);
        alert(`Error updating password: ${error.message}`);
    }
});

deleteButton.addEventListener("click", (e) =>{
    e.preventDefault();
    deleteUser(userEmail)});

function deleteUser(email)
{   

    const userData= {
        email: email
    }
    
    const backendUrl = "https://calorieflow-production.up.railway.app/api/users/delete";
    const params = new URLSearchParams(userData);
    const fullUrl = `${backendUrl}?${params.toString()}`;

    fetch(fullUrl,{
        method: `DELETE`
    })
    .then(response =>{
        if(response.ok)
        {
            localStorage.removeItem('userEmail');
            alert("Account successfully deleted, goodbye!");
            window.location.href="signup.html";
        }
        else{
            return response.json().then(errorData =>{
                throw new Error(errorData.message);
            })
        }
    })
    .catch(error =>{
        console.error("Error during account deletion:", error);
        alert(error.message);
    })
}

const achievementTextMap = {
    'banner10': '10 Day Challenge Winner!',
    'banner30': '30 Day Challenge Winner!',
    'banner100': '100 Day Challenge Winner!',
    'banner365': '365 Day Challenge Winner!'
};


 // checks local storage for an achievement and displays the corresponding banner image.

function displayAchievementBanner() {
    if (!achievementsJson) {
        return;
    }

    try {
        // parse the JSON string back into a JavaScript array
        const achievementsList = JSON.parse(achievementsJson);

        if (!Array.isArray(achievementsList) || achievementsList.length === 0) {
            return;
        }

        let badgesHTML = '<div id="badges-wrapper">'; // Open the wrapper
        
        // loop through all achieved badges and generate HTML for each
        achievementsList.forEach(key => {
            const altText = achievementTextMap[key];
            const filename = `${key}.png`;
            
            if (altText) {
                // Each badge gets its own div
                badgesHTML += `
                    <div class="achievement-badge">
                        <img src="images/${filename}" alt="${altText}">
                        <p>${altText}</p>
                    </div>
                `;
            }
        });
        
        badgesHTML += '</div>'; // Close the wrapper

        bannerContainer.innerHTML = '<h2>Achievements:</h2>' + badgesHTML;

    } catch (e) {
        console.error("Error parsing achievements from localStorage:", e);
    }
}

document.addEventListener('DOMContentLoaded', displayAchievementBanner);

