function getUsername() {
  let username = localStorage.getItem("username");

  if (!username) {
    username = prompt("Create a username");
    localStorage.setItem("username", username);
  }

  return username;
}
