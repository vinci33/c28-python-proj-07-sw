
window.onload = async function () {
    if (!window.location.search.includes('table_id')) {
        window.location.search = "?table_id=1";
    }
    const urlParams = new URLSearchParams(window.location.search);
    const tableId = urlParams.get('table_id');
    console.log(tableId);
    loadMenu();
    document.querySelector('.confirmBtn').addEventListener('click', async function (e) {
        e.preventDefault();
        loadOrder()
        // console.log(orderIds);
        // postOrder();

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
const confirmButton = document.querySelector('.confirmButton');

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


confirmBtn = document.querySelector('.confirmBtn');
confirmBtn.addEventListener("mousedown", function () {
    confirmBtn.classList.add('active');
})
confirmBtn.addEventListener("touchstart", function () {
    confirmBtn.classList.add('active');
})
confirmBtn.addEventListener("touchend", function () {
    confirmBtn.classList.remove('active');
})
confirmBtn.addEventListener("mouseup", function () {
    confirmBtn.classList.remove('active');
})

async function loadMenu() {
    try {
        let res = await fetch('/loadMenu');
        let menu = await res.json();
        if (menu.length == 0) {
            throw new Error('No menu found');
        }
        for (let i = 0; i < menu.length; i++) {
            let menuDiv = document.createElement('div');
            menuDiv.classList.add('single-menu', 'col-sm-4');
            menuDiv.dataset.foodId = menu[i].id;
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
                food_id = this.querySelector('.menu-content').id;
            });
        });

    } catch (err) {
        console.log(err);
    }

}

async function getOrderDetail() {
    const singleOrders = document.querySelectorAll('.single-menu.active');
    const orderIds = Array.from(singleOrders).map(singleOrder => singleOrder.dataset.foodId);
    console.log(orderIds);
    return orderIds;
}

async function loadOrder() {
    try {
        let orderDetails = await getOrderDetail();
        console.log((orderDetails.join(',')));
        resp = await fetch(`/loadOrder?food_ids=${orderDetails.join(',')}`);
        orders = await resp.json();
        if (orders.length == 0) {
            throw new Error('No order found');
        }
        document.querySelector('.menu-container').innerHTML = ''
        document.querySelector('.order-container').innerHTML = ''
        document.querySelector('.voice-chat').innerHTML = ''
        const postOrderButton = document.createElement('button');
        postOrderButton.classList.add('post-order-button', 'btn', 'btn-outline-success');
        postOrderButton.id = 'post-order-button';
        postOrderButton.textContent = 'Confirm Order';
        for (let i = 0; i < orders.length; i++) {
            let order = orders[i][0];
            let orderDiv = document.createElement('div');
            orderDiv.classList.add('single-order', 'col-12');
            orderDiv.dataset.foodId = order.id;
            orderDiv.innerHTML = `
            <img src="${order.food_image}" alt="">
            <div class="order-content" id = ${order.id}>
                <h4 class="food_name">${order.food_name} <span class="food_price">$${order.food_price}</span></h4>
                
            </div>
            `;
            document.querySelector('.order-container').appendChild(orderDiv);
            document.querySelector('.order-container').appendChild(postOrderButton);
        }
        orderDetails = orderDetails.map(Number);
        console.log(orderDetails);
        let confirmOrderBtn = document.querySelector('#post-order-button')
        confirmOrderBtn.addEventListener('click', function () {
            postOrder(orderDetails);
            confirmOrderBtn.textContent = 'Thank you for your order!';
            setTimeout(() => {
                loadMenu();
            }, 2000);
        });

    } catch (err) {
        console.log(err);
    }
}


async function postOrder(orderDetails) {
    try {
        // const orderDetails = await getOrderDetail();

        // console.log(orderDetails);
        const orderIds = [];
        for (let food_id of orderDetails) {
            const tableId = 1;
            const response = await fetch('/postOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    table_id: tableId,
                    food_id: food_id,
                    drink_id: null,
                    quantity: 1,
                })
            });
            const orderId = await response.json();
            console.log(orderId);
            orderIds.push(orderId.id);
        }

        console.log(orderIds);
    } catch (err) {
        console.log(err);
    }
}

