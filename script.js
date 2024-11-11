function showLoginForm() {
    const loginForm = document.getElementById("loginForm");
    loginForm.style.display = "flex"; // Define o display como flex para mostrar o formulário
    const googleButton = document.getElementById("google-button");
    googleButton.style.display = "none"; // Define o display como flex para mostrar o formulário
}

function showPopup() {
    alert("Parabéns, informe a senha 951264 para mim e receberá o presente!");
    const loginForm = document.getElementById("loginForm");
    loginForm.style.display = "none"; // Define o display como flex para mostrar o formulário
    const senha = document.getElementById("senha");
    senha.style.display = "flex"; // Define o display como flex para mostrar o formulário
    const message = document.getElementById("sub-message");
    message.style.display = "none";
    const messageElement = document.querySelector(".message");
    messageElement.innerHTML = "Resta apenas 1 presente...";

}