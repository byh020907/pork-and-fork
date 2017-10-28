const signUpForm = document.getElementById("sign-up-form");

signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const { id, password, name } = e.target.elements;

    signUp(id.value, password.value, name.value, (status) => {
        if (status === 201) {
            location.href = "/signin";
        } else {
            alert("Failed to sign up");
        }
    });
});

function signUp(id, password, name, callback) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = (e) => {
        if (e.target.readyState === 4) {
            callback(e.target.status);
        }
    };

    xhr.open("POST", "http://localhost:5000/api/auth/signup", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.send(`id=${ id }&password=${ password }&name=${ name }`);
}