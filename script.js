import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDrrtaBVZsXdOewYAZpno57CaDUXnfLPZI",
    authDomain: "chatapp-assignment-e6c47.firebaseapp.com",
    databaseURL: "https://chatapp-assignment-e6c47-default-rtdb.firebaseio.com",
    projectId: "chatapp-assignment-e6c47",
    storageBucket: "chatapp-assignment-e6c47.firebasestorage.app",
    messagingSenderId: "917567801196",
    appId: "1:917567801196:web:506da5c572971f18f81549",
    measurementId: "G-CQE6927414"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    createUserWithEmailAndPassword(auth, email, password)
        .then(() => { window.location.href = "popup.html"; })
        .catch(error => alert(error.message));
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
        .then(() => { window.location.href = "popup.html"; })
        .catch(error => alert(error.message));
}

function googleSignIn() {
    signInWithPopup(auth, provider)
        .then(() => { window.location.href = "popup.html"; })
        .catch(error => alert(error.message));
}

function enterChat() {
    const email = document.getElementById("popupEmail").value;
    const username = document.getElementById("popupUsername").value;
    localStorage.setItem("username", username);
    window.location.href = "chatApp.html";
}

function sendMessage() {
    const message = document.getElementById("message").value;
    const username = localStorage.getItem("username");
    push(ref(db, "messages"), { username, message });
    document.getElementById("message").value = "";
}

window.onload = function() {
    const chatBox = document.getElementById("chat-box");
    onChildAdded(ref(db, "messages"), (snapshot) => {
        const data = snapshot.val();
        const messageElement = document.createElement("div");
        messageElement.textContent = `${data.username}: ${data.message}`;
        chatBox.appendChild(messageElement);
    });
}
window.signup = signup;
window.login = login;
window.googleSignIn = googleSignIn;
window.enterChat = enterChat;
window.sendMessage = sendMessage;
