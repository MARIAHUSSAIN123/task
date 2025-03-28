import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,  signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getDatabase,ref,push,onChildAdded,remove 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDrrtaBVZsXdOewYAZpno57CaDUXnfLPZI",
    authDomain: "chatapp-assignment-e6c47.firebaseapp.com",
    databaseURL: "https://chatapp-assignment-e6c47-default-rtdb.firebaseio.com",
    projectId: "chatapp-assignment-e6c47",
    storageBucket: "chatapp-assignment-e6c47.app",
    messagingSenderId: "917567801196",
    appId: "1:917567801196:web:506da5c572971f18f81549",
    measurementId: "G-CQE6927414"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// Signup Function
function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    createUserWithEmailAndPassword(auth, email, password)
        .then(() => { window.location.href = "popup.html"; })
        .catch(error => alert(error.message));
}

// Login Function
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
        .then(() => { window.location.href = "popup.html"; })
        .catch(error => alert(error.message));
}

// Google Sign-In
function googleSignIn() {
    signInWithPopup(auth, provider)
        .then(() => { window.location.href = "popup.html"; })
        .catch(error => alert(error.message));
}

// Enter Chat Function
function enterChat() {
    const username = document.getElementById("popupUsername").value;
    localStorage.setItem("username", username);
    window.location.href = "chatApp.html";
}

// Send Message Function
function sendMessage() {
    const message = document.getElementById("message").value;
    const username = localStorage.getItem("username");
    if (message.trim() === "") return; // Empty message handling

    push(ref(db, "messages"), { username, message })
        .then(() => {
            document.getElementById("message").value = "";
        })
        .catch(error => alert("Error sending message: " + error.message));
}

// Delete Message Function
function deleteMessage(messageId, messageElement) {
    remove(ref(db, `messages/${messageId}`))
        .then(() => {
            messageElement.remove(); // UI se bhi remove karega
        })
        .catch(error => alert("Error deleting message: " + error.message));
}

window.onload = function () {
    const chatBox = document.getElementById("chat-box");
    const currentUser = localStorage.getItem("username");

    onChildAdded(ref(db, "messages"), (snapshot) => {
        const data = snapshot.val();
        const messageId = snapshot.key;

        // Create message container
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container");

        // Username (Upar Show Hoga)
        const usernameElement = document.createElement("span");
        usernameElement.textContent = data.username;
        usernameElement.classList.add("username");

        // Message Text
        const messageText = document.createElement("span");
        messageText.textContent = data.message;
        messageText.classList.add("message");

        // Delete Button
        const deleteButton = document.createElement("span");
        deleteButton.innerHTML = "🗑️";
        deleteButton.classList.add("delete-btn");
        deleteButton.onclick = () => deleteMessage(messageId, messageContainer);

        // Wrap Message + Delete Button
        const messageWrapper = document.createElement("div");
        messageWrapper.classList.add("message-wrapper");
        messageWrapper.appendChild(messageText);
        messageWrapper.appendChild(deleteButton);

        // Add to Message Container
        messageContainer.appendChild(usernameElement);  // Pehly username
        messageContainer.appendChild(messageWrapper);   // Neeche message + delete

        // Align Message Left-Right
        if (data.username === currentUser) {
            messageContainer.classList.add("sent");
        } else {
            messageContainer.classList.add("received");
        }

        chatBox.appendChild(messageContainer);
        chatBox.scrollTop = chatBox.scrollHeight;
    });
};




// Expose Functions to Window (for button clicks)
window.signup = signup;
window.login = login;
window.googleSignIn = googleSignIn;
window.enterChat = enterChat;
window.sendMessage = sendMessage;
