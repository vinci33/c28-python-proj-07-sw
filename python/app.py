import openai
import whisper
import json
import asyncio
import websockets

from sanic import Sanic 
from sanic_ext import Extend
from sanic.response import json
from routes import routes
from dotenv import load_dotenv
import os

load_dotenv()
openai.api_base = "https://api.gpt.tecky.ai/v1"
openai.api_key = os.getenv("OPENAI_API_KEY")
print(openai.api_key)

# app = Sanic("BAD_project_team7_2023_11_05")

app = Sanic(__name__)
app.config.CORS_ORIGINS = "http://localhost:8080"
Extend(app)

async def websocket_handler(websocket, path):
    print("WebSocket handler started")
    while True:
       

        try:
            message = await websocket.recv()
            data = json.loads(message) 
            print(message ,data)
            if data['type'] == 'whisper_request':
            # Process Whisper
                whisper_response = process_with_whisper(data['data'])
                await websocket.send(json.dumps({'type': 'whisper_response', 'data': whisper_response}))
        
            elif data['type'] == 'messageTypeA':
            # Process ChatGPT request
                chatgpt_response = process_with_chatgpt(data['data'])
                await websocket.send(json.dumps({'type': 'chatgpt_response', 'data': chatgpt_response}))

            elif data['source'] == 'A':
            # Process other types of messages
            # Replace with actual processing logic
                message_from_A = data['data']
                # response = process_messageTypeB(data['data'])
                await websocket.send(json.dumps({'type': 'messageTypeB_response', 'data': message_from_A}))

        except json.JSONDecodeError:
            # Handle JSON decode error
            print("Received non-JSON message")
        except Exception as e:
            # Handle other errors
            print(f"An error occurred: {e}")

def process_with_whisper(audio_data):
    # Implement Whisper processing
    audio_file = open("received_audio.wav", "wb")
    audio_file.write(audio_data)
    audio_file.close()
    model = whisper.load_model("base")
    result = model.transcribe("received_audio.wav")
    print(result["text"])
    # Return processed text
    return result["text"]

def process_with_chatgpt(text):
    # Implement ChatGPT processing
    # Return ChatGPT response
    return "Response from ChatGPT"

def process_messageTypeB(data):
    # Implement your processing for messageTypeB
    return "Processed data for messageTypeB"


        # audio_data = await websocket.recv()
        
        # # 處理接收到的音頻數據
        # audio_file = open("received_audio.wav", "wb")
        # audio_file.write(audio_data)
        # audio_file.close()

        # # 使用 Whisper 轉換語音為文字
        # model = whisper.load_model("base")
        # result = model.transcribe("received_audio.wav")
        # await websocket.send(result["text"])


@app.route('/speech-to-text', methods=['POST'])
async def speech_to_text(request):
    audio_data = request.json.get('audio_data')

    response = openai.SpeechToText.create(audio_data=audio_data)

    return json({'response': response.text})

app.blueprint(routes)

if __name__ == "__main__":
    print("Starting server") 
    app.add_websocket_route(websocket_handler, '/ws')
    app.run(host="0.0.0.0", port=8000, workers=1)
