// DOM variables
const emailSignupInput = document.getElementById("emailSignupInput");
const usernameSignupInput = document.getElementById("usernameSignupInput");
const passwordSignupInput = document.getElementById("passwordSignupInput");
const signupForm = document.getElementById("signup-form");

// functions

signupForm.addEventListener("submit",(e) => {
    e.preventDefault(); // ensures fetch logic runs without page refresh interruption
    registerUser(emailSignupInput.value,usernameSignupInput.value,passwordSignupInput.value)});

function registerUser(email, username, password)
{
    // prepare the Request Body

    const userData = {
        email: email,
        username: username,
        password: password
    }

    // make the HTTP POST Request with fetch

    
    const backendUrl = "http://localhost:8080/api/users/register";
    // since the backend uses @RequestParam, Spring Boot looks for the values of email, username, etc in the URL query string, not in the request body
    const params = new URLSearchParams(userData); // transform the JS object into a URL query string
    const fullUrl = `${backendUrl}?${params.toString()}`;

    fetch(fullUrl,{
        method: 'POST'
    })
    

    // handle the response

    //this first .then block is triggered as soon as the browser receives an HTTP response
    // from the server
    .then(response =>{
        if(response.ok) // check if status is 200-299 (success range)
        {
            return response.json(); // the user object
            // this also returns a brand new promise because parsin the data
            // also takes time
        }
        else{
            return response.json().then(errorData =>{
                // get the error message from the server's body
                throw new Error(errorData.message || "Registration failed");
            });
        }
    })
    .then(data=>{ // this .then is only reached if the first one completed successfully
        // and returned the result of response.json()
        console.log("Registration successful!", data);

        window.location.href="home.html"; // redirect the user

    })
    .catch(error =>{
        console.error("Error during registration:", error);
        alert(error.message || "Could not connect to the server");
    });
}