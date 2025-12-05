// DOM variables
const budget = document.getElementById("budgetInput");
const selectList = document.getElementById("selectList");
const entryButton = document.getElementById("entry-button");
const calculateButton = document.getElementById("calculate-button");
const clearButton = document.getElementById("clear-button");
const outputSection = document.getElementById("output"); // This is now the gauge container
let remainingCalories;
const simulateButton = document.getElementById("simulate-button");
const dailyResultsModal = document.querySelector('.dailyResults');
const showResults = document.getElementById("show-results");
const closeResults = document.getElementById("close-daily-results");

const punishmentListModal = document.querySelector('.punishmentList');
const showPunishmentResults = document.getElementById("show-punishment-results");
const closePunishmentResults = document.getElementById("close-p-results");

const loseCase = document.querySelector('.loseCase');
const closeAndRestart = document.getElementById("go-restart");

const userEmail = localStorage.getItem('userEmail');
const groupID = localStorage.getItem('currentGroupId');

const backendUrl = "http://localhost:8080/api/groups/get";
const params = new URLSearchParams({groupID: groupID});
const fullUrl = `${backendUrl}?${params.toString()}`;

let survive = false;
let allMembersData = null;

const backendUrlP = "http://localhost:8080/api/punishments/retreive";


const consumedGauge = outputSection.querySelector('.circle-gauge.consumed');
const budgetGauge = outputSection.querySelector('.circle-gauge.budget');
const remainingGauge = outputSection.querySelector('.circle-gauge.remaining');


// input sanitization
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

//functions

entryButton.addEventListener("click", () => addEntry(selectList.value)); 
function addEntry(stringValue)
{
    const selectedSection = document.getElementById(stringValue);


    selectedSection.insertAdjacentHTML("beforeend", `
        <div class="newEntry">
        <label for="nameInput">Name:</label>
        <input type="text" id="nameInput" required/>

        <label for="calInput">Calories:</label>
        <input type="number" min ="0" id="calInput" required/>
        </div>
    `);

}

calculateButton.addEventListener("click",calculateCalories);
function calculateCalories(e){
    e.preventDefault(); // prevent page refresh as its unneeded

    // get all the input calories for calculations
    const breakfastNumberInputs = document.querySelectorAll("#breakfast input[type='number']");
    const lunchNumberInputs = document.querySelectorAll("#lunch input[type='number']");
    const dinnerNumberInputs = document.querySelectorAll("#dinner input[type='number']");
    const snacksNumberInputs = document.querySelectorAll("#snacks input[type='number']");
    const exerciseNumberInputs = document.querySelectorAll("#exercise input[type='number']");

    const breakfastTotalCalories = getCalories(breakfastNumberInputs);
    const lunchTotalCalories = getCalories(lunchNumberInputs);
    const dinnerTotalCalories = getCalories(dinnerNumberInputs);
    const snacksTotalCalories = getCalories(snacksNumberInputs);
    const exerciseTotalCalories = getCalories(exerciseNumberInputs);

    const dailyBudget = Number(budget.value);
    const totalConsumed = breakfastTotalCalories + lunchTotalCalories + dinnerTotalCalories + snacksTotalCalories;
    const totalExpenditure = exerciseTotalCalories;


    if(isValidInput(budget.value))
    {   
        alert("Enter a valid budget please!")
        return;
    }
    // remaining calories calculation
    remainingCalories = dailyBudget + totalExpenditure - totalConsumed;

    // Update the visual gauges
    updateCalorieGauges(dailyBudget, totalConsumed, remainingCalories);

}

// get total calories
function getCalories(listOfInputs)
{
    let result = 0;

    for(const inputElement of listOfInputs)
    {   

        if(isValidInput(inputElement.value))
        {       
            alert("Invalid input");
            return 0;
        }

        result += Number(inputElement.value); // cause value is string

        
    }

    return result;
}

//  update the circular gauges
function updateCalorieGauges(dailyBudget, totalConsumed, remainingCalories) {
        
    if (!consumedGauge || !budgetGauge || !remainingGauge) return;

    // The goal is the daily budget. Use 1 to avoid division by zero if budget is 0.
    const totalGoal = dailyBudget > 0 ? dailyBudget : 1; 

    // Update Consumed Gauge
    const consumedValueEl = consumedGauge.querySelector('.gauge-value');
    let consumedPercentage = Math.min(100, (totalConsumed / totalGoal) * 100);
    let consumedColor = consumedPercentage > 100 ? '#ef4444' : '#f39c12'; // Red if over 100%

    consumedValueEl.textContent = totalConsumed;
    consumedGauge.style.background = `conic-gradient(
        ${consumedColor} 0% ${consumedPercentage}%, 
        #e9ecef ${consumedPercentage}% 360deg
    )`;
    consumedGauge.style.color = consumedColor;
    

    // Update Budget Gauge
    const budgetValueEl = budgetGauge.querySelector('.gauge-value');
    budgetValueEl.textContent = dailyBudget;

    // Update Remaining Gauge
    const remainingValueEl = remainingGauge.querySelector('.gauge-value');
    let remainingPercentage;
    let remainingColor;

    if (remainingCalories >= 0) {
        // Remaining progress based on how much is left
        remainingPercentage = Math.min(100, (remainingCalories / totalGoal) * 100);
        remainingColor = '#3498db'; // Blue for on/under budget
    } else {
        // Negative remaining calories. Fill the circle completely and show red.
        remainingPercentage = 100; 
        remainingColor = '#e74c3c'; // Red for over budget
    }

    remainingValueEl.textContent = remainingCalories;
    remainingGauge.style.background = `conic-gradient(
        ${remainingColor} 0% ${remainingPercentage}%, 
        #e9ecef ${remainingPercentage}% 360deg
    )`;
    remainingGauge.style.color = remainingColor;
    
}


// clear button function (reset button doesnt clear entries)
clearButton.addEventListener("click", clearAll);

function clearAll()
{
    budget.value = ""; // clear the budget input

    // list of section ids to clear using innerHTML
    const sections = ["breakfast", "lunch", "dinner", "snacks", "exercise"];

    for(const id of sections)
    {
        const section = document.getElementById(id);
        if(section)
        {
            section.innerHTML = "";
        }
    }

    // Reset the gauge display
    const initialBudget = 0;
    remainingCalories = 0; // Reset global remaining calories
    updateCalorieGauges(initialBudget, 0, initialBudget);

    
}

// validate input
function isValidInput(str){

    if(str === "")
    {
        return true;
    }
    const regex = /\d+e\d+/i;

    return str.match(regex);
}

// simulate the end of the day to see if the user met their caloric goals
simulateButton.addEventListener("click", showDailyResults);

async function showDailyResults()
{   
    // 1. Update current user's status first (MUST be done before fetching the list)
    const currentUserPassed = remainingCalories >= 0;
    updateUserStatus(userEmail, currentUserPassed);
    
    // 2. Fetch all group members
    showResults.innerHTML = '<p>Loading group results...</p>';
    dailyResultsModal.classList.add('show-modal');
    
    let friendsStatusHTML = 'Could not load friends status.';
    
    try {
        const response = await fetch(fullUrl, { method: `GET` });
        if (response.ok) {
            allMembersData = await response.json(); // Set global data
            
            // Set survival status
            checkSurvival(allMembersData); 
            
            // Render the friends status
            friendsStatusHTML = renderFriendsStatus(allMembersData, userEmail);
            
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
    } catch (error) {
        console.error("Error fetching group data for results:", error.message);
        friendsStatusHTML = `<p style="color:red;">Error fetching group data: ${error.message}</p>`;
    }

    // 3. Populate modal content
    const userPassMessage = currentUserPassed 
        ? "Congrats! You met your daily caloric goal!" 
        : "Oops! You fell short of your caloric goal.";
    
    const friendsIntroMessage = currentUserPassed
        ? "Let's see if your friends were as disciplined:"
        : "Let's see if your friends clutch up:";

    showResults.innerHTML = `
        <p>${userPassMessage}</p>
        <br>
        <p>${friendsIntroMessage}</p>
        <br>
        ${friendsStatusHTML}
    `;

    closeResults.textContent = "View Punishment";
}

closeResults.addEventListener("click", handleModalButtonAction);

async function handleModalButtonAction(){
    
    // Close the current modal
    dailyResultsModal.classList.remove('show-modal'); 

    if(closeResults.textContent === "View Punishment"){
        
        // Use the globally stored data from showDailyResults
        const data = allMembersData; 

        if(!data){
            alert("Error: Group data was not loaded in the previous step.");
            return;
        }

        // Re-run checkSurvival on the latest data just before deciding the flow
        checkSurvival(data);
        
        if(survive)
        {   
            // group survived (at least one met caloric goal)
            punishmentListModal.classList.add('show-modal');
            showPunishmentResults.innerHTML = await displayPunishmentList(data);

            // update days (update b4 get)
            const updateDaysSurvivedUrl = "http://localhost:8080/api/groups/updateDays";
            const updateDaysParam = new URLSearchParams({groupID: groupID});
            const updateDaysFullUrl = `${updateDaysSurvivedUrl}?${updateDaysParam.toString()}`;

            try{
                const updateDaysResponse = await fetch(updateDaysFullUrl,{method: `PUT`});
                if(updateDaysResponse.ok)
                {
                    const updateDaysData = await updateDaysResponse.json();
                    
                    // update method?
                }
                else{
                    const errorData = await updateDaysResponse.json();
                    console.error("Error fetching days survived:", errorData.message);
                }
            }
            catch(error){
                console.log("Error: ", error.message);
            }


            // check if group earned an accolade with days survived
            const daysSurvivedUrl = "http://localhost:8080/api/groups/getDays";
            const daysParam = new URLSearchParams({groupID: groupID});
            const daysFullUrl = `${daysSurvivedUrl}?${daysParam.toString()}`;

            try{
                const daysResponse = await fetch(daysFullUrl,{method: `GET`});
                if(daysResponse.ok)
                {
                    const daysData = await daysResponse.json();
                    
                    // method to check accolades requirements met
                    metDaysRequirements(daysData);
                }
                else{
                    const errorData = await daysResponse.json();
                    console.error("Error fetching days survived:", errorData.message);
                }
            }
            catch(error){
                console.log("Error: ", error.message);
            }

            
        }
        else{
            // group lost the challenge, go back to login
            loseCase.classList.add('show-modal');

            // call group deletion, punishment deletion, and redirect to login
        }
    }
}

function metDaysRequirements(numDays)
{   

    // array to hold all badges the user has earned
    const achievementsList = [];

    if(numDays >= 10)
    {
        achievementsList.push('banner10');
    }
    if(numDays >= 30)
    {
        achievementsList.push('banner30');
    }
    if(numDays >= 100){
       achievementsList.push('banner100');
    }
    if(numDays >= 365)
    {
        achievementsList.push('banner365');
    }

    if(achievementsList.length > 0)
    {
        localStorage.setItem('achievementsList', JSON.stringify(achievementsList));
        console.log("new achievement unlocked!")
    }
    else
    {
        localStorage.removeItem('achievementsList');
    }
}

closePunishmentResults.addEventListener("click", () =>{punishmentListModal.classList.toggle('show-modal');});

function checkSurvival(membersList)
{
    survive = false; // Reset global flag
    membersList.forEach(member =>{
        // Only set survive to true if a member explicitly passed (underBudget === true)
        if(member.underBudget === true) 
        {
            survive = true;
        }
    })
}

// Renders the list of friends with their status and hover stamp
function renderFriendsStatus(membersList, currentUserEmail) {
    let friendsHTML = '<div class="friends-status-list">';
    // Filter out the current user, as their status is already displayed
    const friends = membersList.filter(member => member.email !== currentUserEmail);

    if (friends.length === 0) {
        return '<p>No other members in the group.</p>';
    }

    friends.forEach(member => {
        const hasPassed = member.underBudget === true;
        const statusText = hasPassed ? 'Passed' : (member.underBudget === false ? 'Failed' : 'Status Pending');
        const stampImage = hasPassed ? 'images/passStamp.jpg' : 'images/failStamp.jpg';
        
        const escapedUsername = htmlEscape(member.username);

        friendsHTML += `
            <div class="friend-status-item">
                <div class="profile-and-name">
                    <img src="images/profile-icon.png" alt="Profile Picture" class="friend-profile-picture" />
                    <p class="friend-name">${escapedUsername}</p>
                </div>
                <div class="stamp-container">
                    <img src="${stampImage}" alt="${statusText} Stamp" class="status-stamp" />
                </div>
            </div>
        `;
    });
    friendsHTML += '</div>';
    return friendsHTML;
}


async function displayPunishmentList(membersList)
{       
    //.map > foreach because of async
    const punishmentPromises = membersList.map(async member =>{
        if(member.underBudget === false || member.underBudget === null)
        {
            let paramsP = new URLSearchParams({targetEmail: member.email});
            let fullUrlP = `${backendUrlP}?${paramsP.toString()}`;

            const response = await fetch (fullUrlP, {method: `GET`});

            if(response.ok)
            {
                const data = await response.json();
                return{
                    username: member.username,
                    details: data.details,
                    metGoal: false
                }
            }
        }
        return {
            username: member.username,
            details: "Met Goal! (No punishment assigned)",
            metGoal: true
        };
    })
    

    const results = await Promise.all(punishmentPromises); 

    let punishmentListHTML = '';

    results.forEach(result => {
        const statusClass = result.metGoal ? 'pass-status' : 'fail-status';

        const escapedUsername = htmlEscape(result.username);
        const escapedDetails = htmlEscape(result.details);   

        const punishmentMessage = result.metGoal 
            ? `<span class="${statusClass}">Met Goal! No punishment assigned.</span>` 
            : `<span class="${statusClass}">Punishment:</span> ${escapedDetails}`;

        punishmentListHTML += `
            <div class="punishment-entry">
                <h3>${escapedUsername}</h3>
                <p class="punishment-details">${punishmentMessage}</p>
            </div>
        `;
    });
    
    return punishmentListHTML;
}

// update user underBudget status

async function updateUserStatus(email, underBudget)
{
    const backendUrl = "http://localhost:8080/api/users/updateStatus";
    const params = new URLSearchParams({
        email: email,
        underBudget: underBudget
    });
    const fullUrl = `${backendUrl}?${params.toString()}`;

    try {
        // use PUT method to update the status
        const response = await fetch(fullUrl, { method: 'PUT' }); 
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        console.log(`Status updated successfully: underBudget = ${underBudget}`);
    } catch (error) {
        console.error("Error updating user status:", error.message);
        
        alert(`Error communicating with server to save status: ${error.message}`); 
    }
}