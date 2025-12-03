// DOM variables
const budget = document.getElementById("budgetInput");
const selectList = document.getElementById("selectList");
const entryButton = document.getElementById("entry-button");
const calculateButton = document.getElementById("calculate-button");
const clearButton = document.getElementById("clear-button");
const outputSection = document.getElementById("output");
let remainingCalories;
const simulateButton = document.getElementById("simulate-button");
const dailyResultsModal = document.querySelector('.dailyResults');
const showResults = document.getElementById("show-results");
const closeResults = document.getElementById("close-daily-results");

const punishmentListModal = document.querySelector('.punishmentList');
const showPunishmentResults = document.getElementById("show-punishment-results");
const closePunishmentResults = document.getElementById("close-p-results");

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

    if(isValidInput(budget.value))
    {   
        alert("Enter a valid budget please!")
        return;
    }
    // remaining calories calculation
    remainingCalories = Number(budget.value) + exerciseTotalCalories - breakfastTotalCalories - 
    lunchTotalCalories - dinnerTotalCalories - snacksTotalCalories;

    output(remainingCalories);

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


// output function for the output at the bottom of the page
function output(calRemaining)
{   
    outputSection.innerHTML = ``; // reset so output doesnt stack

    if(calRemaining >= 0)
    {
        outputSection.innerHTML += `<fieldset id="fs-remaining">
        <h2>${calRemaining} calories remaining </h2>
        </fieldset>`;
    }
    else{
        outputSection.innerHTML += `<fieldset id="fs-excess">
        <h2>${calRemaining} calories in excess</h2>
        </fieldset>`;
    }
    
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

    outputSection.innerHTML = "";
    
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
simulateButton.addEventListener("click", () => {showDailyResults()});

function showDailyResults()
{   
    showResults.innerHTML = ``;

    dailyResultsModal.classList.toggle('show-modal');

    // determine if the calories are met or not
    if(remainingCalories >= 0) // goals are met
    {
        showResults.innerHTML = `
        <p>Congrats! You met your daily caloric goal!</p>
        <br>
        <p>Let's see if your friends were as disciplined:</p>
        <br>
        <img src="images/profile-icon.png" alt="Profile Picture" id="profile-picture" />
        <p>person 1</p>
        <img src="images/profile-icon.png" alt="Profile Picture" id="profile-picture" />
        <p>person 2</p>
        <img src="images/profile-icon.png" alt="Profile Picture" id="profile-picture" />
        <p>person 3</p>
        `; 

        closeResults.textContent = "Close";
        
    }
    else{
        showResults.innerHTML = `
        <p>Oops! You fell short of your caloric goal.</p>
        <br>
        <p>Let's see if your friends clutch up:</p>
        <br>
        <img src="images/profile-icon.png" alt="Profile Picture" id="profile-picture" />
        <p>person 1</p>
        <img src="images/profile-icon.png" alt="Profile Picture" id="profile-picture" />
        <p>person 2</p>
        <img src="images/profile-icon.png" alt="Profile Picture" id="profile-picture" />
        <p>person 3</p>
        `; 

        closeResults.textContent = "View Punishment";
	}

        
    

}

closeResults.addEventListener("click", handleModalButtonAction);

function handleModalButtonAction(){
    if(closeResults.textContent === "View Punishment"){
        dailyResultsModal.classList.toggle('show-modal');
        punishmentListModal.classList.toggle('show-modal');
        
        
    }
    else{
        dailyResultsModal.classList.toggle('show-modal');
    }
}

closePunishmentResults.addEventListener("click", () =>{punishmentListModal.classList.toggle('show-modal');});



