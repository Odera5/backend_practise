document.addEventListener("DOMContentLoaded", () => {
  const messages = document.querySelectorAll(".flash-message");

  messages.forEach((message) => {
    setTimeout(() => {
      message.remove();
    }, 5000);
  });
});
