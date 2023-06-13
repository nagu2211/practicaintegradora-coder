const socket = io();

const chatBox = document.getElementById("input-msg");
const vaciarChat = document.getElementById("vaciarChat");

let emailIngresado = "";

async function main() {
  const { value: email } = await Swal.fire({
    title: "Enter your email",
    input: "text",
    inputLabel: "Your email",
    inputValue: "",
    showCancelButton: false,
    allowOutsideClick: false,
    inputValidator: (value) => {
      if (!value) {
        return "You need to write something!";
      }
    },
  });
  emailIngresado = email;
}
main();

chatBox.addEventListener("keyup", ({ key }) => {
  if (key == "Enter") {
    socket.emit("msg_front_to_back", {
      message: chatBox.value,
      user: emailIngresado,
    });
    chatBox.value = "";
  }
});

socket.on("listado_de_msgs", (msgs) => {
  const chatmsg = document.getElementById("div-msgs");
  let formato = "";
  msgs.forEach((msg) => {
    formato = formato + "<p>Email " + msg.user + ": " + msg.message + "</p>";
  });
  chatmsg.innerHTML = formato;
  vaciarChat.addEventListener("click", function () {
    chatmsg.innerHTML = "";
    socket.emit("vaciar_chat");
  });
});
