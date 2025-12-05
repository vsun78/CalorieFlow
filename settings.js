// DOM vars

const usernameButton = document.getElementById("usernameButton");
const passwordButton = document.getElementById("passwordButton");
const deleteButton = document.getElementById("deleteButton");
const userEmail = localStorage.getItem('userEmail');

const bannerContainer = document.getElementById('bannerContainer');
const achievementsJson = localStorage.getItem('achievementsList'); // array string

// functions

deleteButton.addEventListener("click", (e) =>{
    e.preventDefault();
    deleteUser(userEmail)});

function deleteUser(email)
{   

    const userData= {
        email: email
    }

    const backendUrl = "http://localhost:8080/api/users/delete";
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

// Execute the banner display logic when settings.js runs
document.addEventListener('DOMContentLoaded', displayAchievementBanner);

