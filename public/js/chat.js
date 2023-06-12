const socket = io();

const chatBox = document.getElementById("input-msg");
const vaciarChat = document.getElementById("vaciarChat")

let usuarioIngresado = "";


async function main() {
  const { value: nombre } = await Swal.fire({
    title: "Enter your name",
    input: "text",
    inputLabel: "Your name",
    inputValue: "",
    showCancelButton: false,
    allowOutsideClick: false,
    inputValidator: (value) => {
      if (!value) {
        return "You need to write something!";
      }
    },
  });
  usuarioIngresado = nombre;
}
main();

chatBox.addEventListener("keyup", ({ key }) => {
  if (key == "Enter") {
    socket.emit("msg_front_to_back", {
      msg: chatBox.value,
      user: usuarioIngresado,
    });
    chatBox.value = "";
  }
});

socket.on("listado_de_msgs", (msgs) => {
  const chatmsg = document.getElementById("div-msgs");
  let formato = "";
  msgs.forEach((msg) => {
    formato = formato + "<p>User " + msg.user + ": " + msg.msg + "</p>";
  });
  chatmsg.innerHTML = formato;
  vaciarChat.addEventListener("click", function(){
    chatmsg.innerHTML = "";
    socket.emit("vaciar_chat");
  })
});
