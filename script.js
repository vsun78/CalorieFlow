// DOM variables
const budget = document.getElementById("budgetInput");
const selectList = document.getElementById("selectList");
const entryButton = document.getElementById("entry-button");
const calculateButton = document.getElementById("calculate-button");
const clearButton = document.getElementById("clear-button");

//functions

entryButton.addEventListener("click", () => addEntry(selectList.value)); 
function addEntry(stringValue)
{
    const selectedSection = document.getElementById(stringValue);

    selectedSection.innerHTML += "<p>New entry test</p>";

}