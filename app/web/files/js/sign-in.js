const signInForm = document.getElementById("sign-in-form");

signInForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const { id, password } = e.target.elements;
    
    signIn(id.value, password.value, (status) => {
        if (status === 200) {
            location.href = "/";
        } else {
            alert("Cannot match id or password");
        }
    });
});

function signIn(id, password, callback) {
    const xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = (e) => {
        if (e.target.readyState === 4) {
            callback(e.target.status);
        }
    };

    xhr.open("POST", "http://localhost:5000/api/auth/signin", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.send(`id=${ id }&password=${ password }`);
}