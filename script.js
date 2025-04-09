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
    const currentUsername = localStorage.getItem("username");

    onChildAdded(ref(db, "messages"), (snapshot) => {
        const data = snapshot.val();
        const messageId = snapshot.key;

        const container = document.createElement("div");
        container.classList.add("message-container");
        container.classList.add(data.username === currentUsername ? "sent" : "received");

        const wrapper = document.createElement("div");
        wrapper.classList.add("message-wrapper");

        // Circle with First Letter of Username
        const letterCircle = document.createElement("div");
        letterCircle.classList.add("letter-circle");
        letterCircle.textContent = data.username.charAt(0).toUpperCase();

        const textWrapper = document.createElement("div");

        const name = document.createElement("div");
        name.classList.add("username");
        name.textContent = data.username;

        const msg = document.createElement("div");
        msg.textContent = data.message;

        textWrapper.appendChild(name);
        textWrapper.appendChild(msg);

        wrapper.appendChild(letterCircle);
        wrapper.appendChild(textWrapper);

        if (data.username === currentUsername) {
            const delImg = document.createElement("img");
            delImg.src = "delete.png"; // 👈 yahan apni image ka path do
            delImg.classList.add("delete-icon");
            delImg.title = "Delete message";

            delImg.addEventListener("click", () => {
                const confirmDelete = confirm("Do you really want to delete this message?");
                if (confirmDelete) {
                    remove(ref(db, `messages/${messageId}`))
                        .then(() => container.remove())
                        .catch(error => alert("Error deleting message: " + error.message));
                }
            });

            wrapper.appendChild(delImg);
        }

        container.appendChild(wrapper);
        chatBox.appendChild(container);
        chatBox.scrollTop = chatBox.scrollHeight;
    });
};





// Expose Functions to Window (for button clicks)
window.signup = signup;
window.login = login;
window.googleSignIn = googleSignIn;
window.enterChat = enterChat;
window.sendMessage = sendMessage;


const themeToggleBtn = document.getElementById("themeToggleBtn");
    let isDark = false;
    themeToggleBtn.addEventListener("click", () => {
        if (isDark) {
            document.body.style.backgroundColor = "white";
            document.body.style.color = "black";
        } else {
            document.body.style.backgroundColor = "black";
            document.body.style.color = "white";
        }
        isDark = !isDark;
    });
