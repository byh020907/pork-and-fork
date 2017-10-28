const socket = io.connect("http://localhost:5000");

socket.on("connect", () => {
    socket.on("room.join", (frame) => {
        const { member } = frame;
        appendText(`${ member } was joined room`, "left");
    });

    socket.on("room.chat", (frame) => {
        const { message, sender } = frame;
        appendText(`${ sender } : ${ message }`, "left");
    });

    socket.on("room.quit", (frame) => {
        const { member } = frame;
        appendText(`${ member } was quited room`, "left");
    });
});

const chatMsgForm = document.getElementById("chat-message-form");

chatMsgForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let { message } = e.target.elements;
    
    if (message.value) {
        chat(message.value);
    }

    message.value = "";
});

function chat(message) {
    socket.emit("room.chat", { message }, (result) => {
        if (result) {
            appendText(`Me : ${ message }`, "right");
        } else {
            alert("Failed to send message");
        }
    });
}

function appendText(text, align) {
    const item = document.createElement("li");
    item.classList.add("chat-message-list-item");

    item.innerText = text;
    item.style.textAlign = align;

    const chatMsgList = document.getElementById("chat-message-list");
    chatMsgList.appendChild(item);

    chatMsgList.scrollTop = chatMsgList.scrollHeight;
}