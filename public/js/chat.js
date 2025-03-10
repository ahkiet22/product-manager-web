import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";
    }
  });
}
// End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const chatMessages = document.querySelector(".chat .chat-messages");

  const div = document.createElement("div");
  let htmlFullName = "";

  if (myId == data.userId) {
    div.classList.add("sent");
  } else {
    htmlFullName = `<div class"inner-name">${data.fullName}</div>`;
    div.classList.add("received");
  }
  div.innerHTML = `
    ${htmlFullName}
    <div class="message-wrapper">
      <div class="message-content">
        <div class="message-bubble">${data.content}</div>
        <div class="message-time">10:30 AM</div>
      </div>
    </div>
  `;

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
// SERVER_RETURN_MESSAGE

// Scroll Chat to bottom
const bodyChatMessages = document.querySelector(".chat .chat-messages");
if (bodyChatMessages) {
  bodyChatMessages.scrollTop = bodyChatMessages.scrollHeight;
}
// End Scroll Chat to bottom

// show icon chat
// show popup
const buttonIcon = document.querySelector(".button-icon");
const tooltip = document.querySelector(".tooltip");
Popper.createPopper(buttonIcon, tooltip);

buttonIcon.onclick = () => {
  tooltip.classList.toggle("shown");
};
// End show popup

// Insert Icon to input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  const inputChat = document.querySelector(
    ".chat .chat-input .inner-form input[name='content']"
  );
  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;
  });
}
// End Insert Icon to input
// End show icon chat
