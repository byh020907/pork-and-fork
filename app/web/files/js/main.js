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

        Auth.login(socket, id.value, password.value, (result, error) => {
            if (result) {
                switchSection(getCurrentSection(), document.getElementById("room-section"));
            } else {
                alert("Login Failed");
            }
        });

        for (let element of parameters) {
            element.value = "";
        }
    });

    document.getElementById("show-register-link").addEventListener("click", (e) => {
        switchSection(getCurrentSection(), document.getElementById("register-section"));
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
    
        Auth.register(socket, id.value, password.value, name.value, (result, error) => {
            if (result) {
                switchSection(getCurrentSection(), document.getElementById("login-section"));
            } else {
                alert("Register Failed");
            }
        });

        for (let element of parameters) {
            element.value = "";
        }
    });

    document.getElementById("create-room-button").addEventListener("click", (e) => {
        Room.create(socket, prompt("Enter Your Room Name"), (result, error) => {
            if (result) {
                switchSection(getCurrentSection(), document.getElementById("chat-section"));
            } else {
                alert("Failed To Create New Room");
            }
        });
    });
            
    document.getElementById("join-room-button").addEventListener("click", (e) => {
        Room.join(socket, prompt("Enter Anther Room Name"), (result, error) => {
            if (result) {
                switchSection(getCurrentSection(), document.getElementById("chat-section"));
            } else {
                alert("Failed To Join Another Room");
            }
        });
    });

    document.getElementById("chat-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const { message } = e.target.elements;
        
        if (message.value.length > 0) {
            Room.chat(socket, message.value, (result, error) => {
                if (result) {
                    appendText(document.getElementById("chat-list"), `me: ${ message.value }`, "left");
                } else {
                    alert("Failed To Chat Message");
                }

                message.value = "";
            });
        }
    });

    document.getElementById("quit-room-button").addEventListener("click", (e) => {
        if (confirm("Do You Want To Quit Room?")) {
            Room.quit(socket, (result, error) => {
                if (result) {
                    switchSection(getCurrentSection(), document.getElementById("room-section"));
                } else {
                    alert("Failed To Quit Current Room");
                }
            });
        }
    });

    socket.on("room.join", (frame) => {
        const { member } = frame;
        appendText(document.getElementById("chat-list"), `${ member } was join room`, "left");
    });

    socket.on("room.quit", (frame) => {
        const { member } = frame;
        appendText(document.getElementById("chat-list"), `${ member } was quit room`, "left");
    });

    socket.on("room.chat", (frame) => {
        const { message, sender } = frame;
        appendText(document.getElementById("chat-list"), `${ sender }: ${ message }`, "left");
    });

    socket.on("disconnect", () => {
        switchSection(getCurrentSection(), document.getElementById("login-section"));
    });
});

function getCurrentSection() {
    const section = Array.from(document.getElementsByTagName("section")).filter((section) => {
        return section.style.display !== "none";
    });

    return section[0];
}

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