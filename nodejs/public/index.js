const socket = new WebSocket('ws://localhost:8000/ws');
console.log("Attempting to connect to WebSocket server at ws://localhost:8000/ws");
console.log("socket:", socket);
console.log("Attempting to connect to WebSocket server at ws://localhost:8000/ws");
console.log("socket:", socket);

const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
let userMessage = null; // Variable to store user's message

const API_KEY = "PASTE-YOUR-API-KEY"; // Paste your API key here
const inputInitHeight = chatInput.scrollHeight;


const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">person</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}
const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");
    // Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }],
        })
    }
    // Send POST request to API, get response and set the reponse as paragraph text
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content.trim();
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}
const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;
    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}
chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});
chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});
sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));


// async function startRecording() {
//     try {
//         let stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
//         const mediaRecorder = new MediaRecorder(stream);
//         let chunks = [];

//         mediaRecorder.ondataavailable = function (event) {
//             chunks.push(event.data);
//         };

//         mediaRecorder.onstop = async function () {
//             let blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
//             chunks = [];

//             let arrayBuffer = await blob.arrayBuffer();
//             let audio_data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

//             try {
//                 // Send the audio data to the Python backend
//                 let response = await fetch('http://localhost:8000/speech-to-text', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ audio_data: audio_data }),
//                 });

//                 let data = await response.json();
//                 console.log(data);
//             } catch (error) {
//                 console.error('Error:', error);
//             }
//         };

//         let button = document.querySelector('#start');

//         button.onmousedown = button.ontouchstart = function () {
//             mediaRecorder.start();
//         };

//         button.onmouseup = button.ontouchend = function () {
//             mediaRecorder.stop();
//         };
//     } catch (err) {
//         console.log('getUserMedia error: ', err);
//     }
// }



const recordButton = document.querySelector("#recordButton");
const recordButtonChatbox = document.querySelector("#recordButtonChatbox");
recordButton.addEventListener("touchstart", startRecording);
recordButton.addEventListener("touchend", stopRecording);
recordButton.addEventListener("mousedown", startRecording);
recordButton.addEventListener("mouseup", stopRecording);
let mediaRecorder;
let audioChunks = [];
let isRecording = false;


async function startRecording() {
    if (!isRecording) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            isRecording = true;
            recordButton.classList.add("active");
            audioChunks = [];
            mediaRecorder.addEventListener("dataavailable", e => {
                audioChunks.push(e.data);
            });
        } catch (err) {
            console.log("Start recording fail:", err);
        }
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        recordButton.classList.remove("active");
        mediaRecorder.addEventListener("stop", async () => {
            const audioBlob = new Blob(audioChunks);
            try {
                await sendDataToServer(audioBlob);
            } catch (err) {
                console.log("Stop recode fail:", err);
            }
        });
    }
}

async function sendDataToServer(blob) {
    try {
        const formData = new FormData();
        formData.append("audio", blob);
        const response = await fetch("/upload-audio", {
            method: "POST",
            body: formData
        });
        const data = await response.text();
        document.getElementById("message").innerText = "接收到的訊息: " + data;
        return data;
    } catch (err) {
        console.log("Data to server failed :", err);
        throw err;
    }
}

// startRecording();




socket.onopen = function (event) {
    console.log("WebSocket connection opened:", event);
    socket.send(JSON.stringify({ id: 1, type: 'text', data: 'Hello, server!' }));
};

socket.onerror = function (event) {
    console.error("WebSocket error:", event);
};

// function sendTextMessage(text, source) {
//     socket.send(JSON.stringify({ source: source, type: 'text', data: text }));
// }
// // sendTextMessage('Hello, server from .send !', 'A');

// function sendTextMessageA(text) {
//     socket.send(JSON.stringify({ source: 'A', type: 'text', data: text }));
// }
// // sendTextMessageA('Hello, server from .sendA !');

// socket.onmessage = function (event) {
//     console.log("WebSocket message received:", event);
//     const message = JSON.parse(event.data);
//     if (message.type === 'textFromServer') {
//         console.log('Received text message: ' + message.data);
//     }
// };

// async function sendVoiceBlob(blob) {
//     const arrayBuffer = await blob.arrayBuffer();
//     socket.send(arrayBuffer);
// }
