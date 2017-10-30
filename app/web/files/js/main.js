const chatMsgForm = document.getElementById("chat-message-form");

chatMsgForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let { message } = e.target.elements;
    
    message.value = "";
});