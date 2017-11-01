function login(socket, id, password, callback) {
    socket.emit("auth.login", { id, password }, callback);
}

function register(socket, id, password, name, callback) {
    socket.emit("auth.register", { id, password, name }, callback);
}

function chat(socket, message, callback) {
    socket.emit("room.chat", { message }, callback);
}

const socket = io.connect("http://localhost:5000");

socket.once("connect", () => {
    document.getElementById("login-form").addEventListener("submit", (e) => {
        e.preventDefault();
    
        const { id, password } = e.target.elements;
    
        const parameters = [ id, password ];

        for (let element of parameters) {
            if (!element.value) {
                return alert("Please Write All Form Values");
            }
        }

        login(socket, id.value, password.value, (result, error) => {
            if (result) {
                switchSection(document.getElementById("login-section"), document.getElementById("chat-section"));
            } else {
                alert("Login Failed");
            }
        });

        for (let element of parameters) {
            element.value = "";
        }
    });

    document.getElementById("show-register-link").addEventListener("click", (e) => {
        switchSection(document.getElementById("login-section"), document.getElementById("register-section"));
    });

    document.getElementById("register-form").addEventListener("submit", (e) => {
        e.preventDefault();
    
        const { id, password, name } = e.target.elements;
    
        const parameters = [ id, password, name ];

        for (let element of parameters) {
            if (!element.value) {
                return alert("Please Write All Form Values");
            }
        }
    
        register(socket, id.value, password.value, name.value, (result, error) => {
            if (result) {
                switchSection(document.getElementById("register-section"), document.getElementById("login-section"));
            } else {
                alert("Register Failed");
            }
        });

        for (let element of parameters) {
            element.value = "";
        }
    });

    document.getElementById("chat-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const { message } = e.target.elements;
        
        message.value = "";
    });
});

function switchSection(oldSection, newSection) {
    oldSection.style.display = "none";
    newSection.style.display = "block";
}

function appendText(list, text, alignment) {
    const item = document.createElement("li");
    
    item.innerText = text;
    item.style.textAlign = alignment;
    
    list.appendChild(item);
}