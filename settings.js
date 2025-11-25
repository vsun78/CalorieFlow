// DOM vars

const usernameButton = document.getElementById("usernameButton");
const passwordButton = document.getElementById("passwordButton");
const deleteButton = document.getElementById("deleteButton");
const userEmail = localStorage.getItem('userEmail');

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