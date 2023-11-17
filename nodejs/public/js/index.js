window.onload = async function () {
    loadMenu();
    document.querySelector('.confirmBtn').addEventListener('click', function (e) {
        e.preventDefault();
        // getOrderDetail()
        postOrder();

        console.log("confirmBtn press ");
    })


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





// document.querySelectorAll('.single-menu').forEach(function (singleMenu) {
//     singleMenu.addEventListener('mousedown', function () {
//         this.classList.add('transform'); // Add transform class to the clicked .single-menu element	
//     });


//     singleMenu.addEventListener('mouseup', function () {
//         this.classList.remove('transform'); // Remove transform class when the mouse button is released	
//         this.classList.toggle('active'); // Add active class to the clicked .single-menu element	
//     });
// });


// document.querySelector('.confirmBtn').addEventListener('click', function (e) {
//     e.preventDefault();
//     postOrder();
// })

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
                <h4 class="food_name">${menu[i].food_name} <span class="food_price">$${menu[i].food_price}</span></h4>
                <p class="food_category">${menu[i].food_category}</p>
            </div>
            `;
            document.querySelector('.menu-container').appendChild(menuDiv);
        }
        document.querySelectorAll('.single-menu').forEach(function (singleMenu) {
            singleMenu.addEventListener('mousedown', function () {
                this.classList.add('transform');
            });


            singleMenu.addEventListener('mouseup', function () {
                this.classList.remove('transform');
                this.classList.toggle('active');
            });
        });

    } catch (err) {
        console.log(err);
    }

}
// async function loadMenu() {
//     try {
//         let res = await fetch('/loadMenu');
//         let menu = await res.json();
//         console.log(menu);
//         if (menu.length == 0) {
//             throw new Error('No menu found');
//         }
//         for (let i = 0; i < menu.length; i++) {
//             let menuDiv = document.createElement('div');
//             menuDiv.classList.add('single-menu', 'col-sm-4');
//             menuDiv.dataset.id = menu[i].id; // Store the food id in a data attribute
//             menuDiv.dataset.quantity = 0; // Initialize the quantity to 0
//             menuDiv.innerHTML = `
//             <img src="${menu[i].food_image}" alt="">
//             <div class="menu-content">
//                 <h4 class="food_name">${menu[i].food_name} <span class="food_price">$${menu[i].food_price}</span></h4>
//                 <p class="food_category">${menu[i].food_category}</p>
//             </div>
//             <div class="quantity-control">
//                 <button class="decrease">-</button>
//                 <span class="quantity">0</span>
//                 <button class="increase">+</button>
//             </div>
//             `;
//             document.querySelector('.menu-container').appendChild(menuDiv);
//         }
//         document.querySelectorAll('.single-menu').forEach(function (singleMenu) {
//             const reduceBtn = singleMenu.querySelector(".decrease");
//             const addBtn = singleMenu.querySelector(".increase");
//             const quantityEle = singleMenu.querySelector(".quantity");

//             if (!reduceBtn || !addBtn || !quantityEle) {
//                 throw new Error("Missing button elements");
//             }

//             let quantity = parseInt(quantityEle.dataset.quantity);
//             reduceBtn.addEventListener("click", () => {
//                 if (quantity > 0) {
//                     quantity--;
//                     quantityEle.innerHTML = quantity;
//                     singleMenu.dataset.quantity = quantity;
//                 }
//             });

//             addBtn.addEventListener("click", () => {
//                 quantity++;
//                 quantityEle.innerHTML = quantity;
//                 singleMenu.dataset.quantity = quantity;
//             });
//         });

//     } catch (err) {
//         console.log(err);
//     }
// }


let orderStaging = [];
console.log(orderStaging);

async function getOrderDetail() {
    console.log(orderStaging);
    confirmBtn = document.querySelector('.confirmBtn');
    document.querySelectorAll('.single-menu').forEach(function (e) {
        let orderId = e.querySelector('.menu-content').id;
        if (e.classList.contains('active')) {
            if (!orderStaging.includes(orderId)) {
                orderStaging.push(orderId);
            }
        } else {
            orderStaging = orderStaging.filter(function (id) {
                return id !== orderId;
            });
        }
        e.classList.remove('active');

    });
    // console.log(orderStaging);
    return orderStaging;
}


async function postOrder() {
    try {
        const orderDetails = await getOrderDetail();
        const orderIds = [];
        // console.log(`in post Order ${orderDetails}`);
        for (let food_id of orderDetails) {
            const response = await fetch('/postOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    food_id: food_id,
                    drink_id: 1,
                    quantity: 1,
                })
            });
            const orderId = await response.json();
            orderIds.push(orderId.id);
        }
        console.log(orderIds);
    } catch (err) {
        console.log(err);
    }
}