const socket = io.connect("http://localhost:5000/socket.io");

socket.on("connection", () => {
    console.log("connected!");
});