const socket = io();

const chatBox = document.getElementById("input-msg");

chatBox.addEventListener("keyup", ({ key }) => {
  if (key == "Enter") {
    socket.emit("msg_front_to_back", {
      msg: chatBox.value,
      user: 'usuario anonimo',
    });
    chatBox.value = "";
  }
});
