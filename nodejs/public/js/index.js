window.onload = async function () {
    loadMenu();
    getOrderDetail();
    document.querySelectorAll('.single-menu').forEach(function (e) {
        e.addEventListener('click', function () {

        });
    });
}



let socket;

function initWebSocket() {
    socket = new WebSocket("ws://localhost:8000/ws");

    socket.onopen = function (event) {
        console.log("WebSocket connection opened:", event);
    };

    socket.onmessage = function (event, type) {
        console.log("WebSocket message received:", event);
        const message = JSON.parse(event.data);
        if (message.type === type) {
            console.log('Received text message: ' + message.data);
        }
    };

    socket.onerror = function (event) {
        console.error("WebSocket error:", event);
    };

    socket.onclose = function (event) {
        console.log("WebSocket connection closed:", event);
        // Reconnect after a delay
        setTimeout(initWebSocket, 5000);
    };
}

function promiseOnmessage(type) {
    return new Promise((resolve, reject) => {
        socket.onmessage = function (event) {
            console.log("WebSocket message received:", event);
            const message = JSON.parse(event.data);
            if (message.type === type) {
                console.log('Received text message: ' + message.data);
                resolve(message.data);
            }
        }
        socket.onerror = function (error) {
            reject(error);
        }
    });
}



async function sendVoiceBlob(blob) {
    try {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        const base64Data = await new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
        });
        const message = JSON.stringify({ type: 'voice', data: base64Data });
        await socket.send(message);
    } catch (error) {
        console.error("Failed to send audioBlob:", error);
    }
}
async function sendTextMessage(text, type) {
    try {
        if (socket && socket.readyState === WebSocket.OPEN) {
            await socket.send(JSON.stringify({ type: type, data: text }));
        } else {
            console.log("Can't send message, the WebSocket connection isn't open");
        }
    } catch (error) {
        console.error("Failed to send message:", error);
    }
}

initWebSocket();
console.log("Attempting to connect to WebSocket server at ws://localhost:8000/ws");
console.log("socket:", socket);

socket.onmessage = function (event) {
    console.log("WebSocket message received:", event);
    const message = JSON.parse(event.data);
    if (message.type === 'whisper_response') {
        console.log('Received text message: ' + message.data);
    }
};

const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const voiceChatbox = document.querySelector(".voice-chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
let userMessage = null;
const inputInitHeight = chatInput.scrollHeight;


const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">person</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}
const generateResponse = async (chatElement, type) => {
    try {
        const messageElement = chatElement.querySelector("p");
        sendTextMessage(userMessage, 'user_message');
        messageElement.textContent = await promiseOnmessage(type);
        console.log(`Fm generate Fun : ${messageElement.textContent}`);
        chatbox.scrollTo(0, chatbox.scrollHeight)
    } catch {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }
}
const generateResponseVoice = async (chatElement, type) => {
    try {
        const messageElement = chatElement.querySelector("p");
        messageElement.textContent = await promiseOnmessage(type);
        console.log(`Fm generate respond voice Fun : ${messageElement.textContent}`);
        // chatbox.scrollTo(0, chatbox.scrollHeight)
    } catch {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi, 'chatgpt_response_chatbox');
    }, 600);
}
// userMessageFmVoice = async () => {
//     await promiseOnmessage('whisper_response');
//     console.log(`Fm handle Fun : ${userMessageFmVoice}`);
// }

const handleVoiceChat = async () => {

    // const incomingVoiceLi = createChatLi("Listening...", "incoming");
    // voiceChatbox.appendChild(incomingVoiceLi);

    // await new Promise(resolve => setTimeout(resolve, 600));
    const incomingVoiceLi = createChatLi("Listening...", "incoming");
    userMessageFmVoice = await promiseOnmessage('whisper_response');
    voiceChatbox.appendChild(createChatLi(userMessageFmVoice, "outgoing"));
    console.log(`Fm handle Fun : ${userMessageFmVoice}`);
    userMessage = userMessageFmVoice;
    generateResponseVoice(incomingVoiceLi, 'chatgpt_response_voice-chatbox');
    voiceChatbox.appendChild(incomingVoiceLi);

}
// document.querySelector("#recordButtonChatbox").addEventListener("click", handleVoiceChat);

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        if (!e.shiftKey) {
            handleChat();
        } else {
            chatInput.value += "\n";
        }
    }
});


sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));



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
            handleVoiceChat()
            const audioBlob = new Blob(audioChunks);
            try {
                await sendVoiceBlob(audioBlob);

            } catch (err) {
                console.log("Stop recode fail:", err);
            }
        });
    }
}






// socket.onopen = function (event) {
//     console.log("WebSocket connection opened:", event);
//     socket.send(JSON.stringify({ source: 1, type: 'text', data: 'Hello, server!' }));
//     // socket.send(JSON.stringify({ source: 'A', type: 'text', data: "test1" }))
//     sendTextMessageA('Hello, server from .sendA !')
// };

// socket.onmessage = function (event) {
//     console.log("WebSocket message received:", event);
//     const message = JSON.parse(event.data);
//     if (message.type === 'messageTypeA_response') {
//         console.log('Received text message: ' + message.data);
//     }
// };


// function sendTextMessage(text, source) {
//     socket.send(JSON.stringify({ source: source, type: 'text', data: text }));
// }
// // sendTextMessage('Hello, server from .send !', 'A');

// function sendTextMessageA(text) {
//     socket.send(JSON.stringify({ source: 'A', type: 'text', data: text }));
// }
// ;

// socket.onmessage = function (event) {
//     console.log("WebSocket message received:", event);
//     const message = JSON.parse(event.data);
//     if (message.type === 'messageTypeA_response') {
//         console.log('Received text message: ' + message.data);
//     }
// };

// async function sendVoiceBlob(blob) {
//     const arrayBuffer = await blob.arrayBuffer();
//     socket.send(arrayBuffer);
// }

// socket.onerror = function (event) {
//     console.error("WebSocket error:", event);
// };

// sendTextMessageA('Hello, server from .sendA !');

{/* <div class="single-menu col-sm-4">
<img src="../../asset/dish5.jpg" alt="">
<div class="menu-content">
    <h4>chicken fried salad <span>$45</span></h4>
    <p>Lorem ipsum dolor sit met.</p>
</div>
</div> */}

document.querySelectorAll('.single-menu').forEach(function (singleMenu) {
    singleMenu.addEventListener('mousedown', function () {
        this.classList.add('transform'); // Add transform class to the clicked .single-menu element
    });

    singleMenu.addEventListener('mouseup', function () {
        this.classList.remove('transform'); // Remove transform class when the mouse button is released
        this.classList.toggle('active'); // Add active class to the clicked .single-menu element
    });
});

async function loadMenu() {
    try {
        let res = await fetch('/loadMenu');
        let menu = await res.json();
        console.log(menu);
        if (menu.length == 0) {
            throw new Error('No menu found');
        }
        for (let i = 0; i < menu.length; i++) {
            let menuDiv = document.createElement('div');
            menuDiv.classList.add('single-menu', 'col-sm-4');
            menuDiv.innerHTML = `
            <img src="${menu[i].food_image}" alt="">
            <div class="menu-content" id = ${menu[i].id}>
                <h4>${menu[i].food_name} <span>$${menu[i].food_price}</span></h4>
                <p>${menu[i].food_category}</p>
            </div>
            `;
            document.querySelector('.menu-container').appendChild(menuDiv);
            getOrderDetail();


        }

    } catch (err) {
        console.log(err);
    }

}
const confirmOrderBtn = document.querySelector('.confirm-order')
confirmOrderBtn.addEventListener('click', postOrder);


document.querySelectorAll('.single-menu').forEach(function (singleMenu) {
    singleMenu.addEventListener('mousedown', function () {
        this.classList.add('transform'); // Add transform class to the clicked .single-menu element
    });

    singleMenu.addEventListener('mouseup', function () {
        this.classList.remove('transform'); // Remove transform class when the mouse button is released
        this.classList.toggle('active'); // Add active class to the clicked .single-menu element
    });
});



async function getOrderDetail() {
    try {
        document.querySelectorAll('.single-menu').forEach(function (singleMenu) {
            singleMenu.addEventListener('mousedown', function () {
                this.classList.add('transform'); // Add transform class to the clicked .single-menu element
            });

            singleMenu.addEventListener('mouseup', function () {
                this.classList.remove('transform'); // Remove transform class when the mouse button is released
                this.classList.toggle('active'); // Add active class to the clicked .single-menu element
            });
        });

    } catch (err) {
        console.log(err);
    }

    async function postOrder() {
        try {
            id = confirmOrderBtn.getAttribute('id');

            const orderDetails = getOrderDetail();
            const orderId = await fetch('/postOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    foodId: "",
                    drinkId: "",
                    quantity: "",
                })
            });
            return orderId



            // for (let i = 0; i < menu.length; i++) {
            //     let menuDiv = document.createElement('div');
            //     menuDiv.classList.add('single-menu', 'col-sm-4');
            //     menuDiv.innerHTML = `
            //     <img src="../../asset/dish5.jpg" alt="">
            //     <div class="menu-content">
            //         <h4>${menu[i].name} <span>$${menu[i].price}</span></h4>
            //         <p>${menu[i].description}</p>
            //     </div>
            //     `;
            //     document.querySelector('.menu-container').appendChild(menuDiv);
            // }
        } catch (err) {
            console.log(err);
        }
    }