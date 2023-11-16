from datetime import datetime
from openai import OpenAI
# import whisper
import base64
import numpy as np
import asyncio
from sanic.response import json as sanic_json
import json
from sanic import Sanic 
from routes import routes
from dotenv import load_dotenv
import os
import langchain
from langchain.llms import OpenAI

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
print(f"{api_key=}")
client = OpenAI(
    api_key=api_key
    # base_url="https://api.gpt.tecky.ai/v1"
)




app = Sanic("BAD_project_team7_2023_11_05")

app = Sanic(__name__)
# app.config.CORS_ORIGINS = "http://localhost:8080"
# Extend(app)


print("Sanic app created")
async def websocket_handler(request, ws):
    print("WebSocket handler started for path:", ws)
    while True:
        print("Waiting for message...")
        

        try:
           
            message = await ws.recv()
            print("Received WebSocket message:", message)
            data = json.loads(message)
            
            if data['type'] == 'voice':
                base64_data = data['data']
                text = await process_with_whisper(base64_data)
                print (f"whisper respond :{text}")
                await ws.send(json.dumps({'type': 'whisper_response', 'data': text}))
                print("whisper response sent")
                chatgpt_response = process_with_chatgpt(text)
                print(f"gpt respond fm whisper :{chatgpt_response}")
                await ws.send(json.dumps({'type': 'chatgpt_response_voice-chatbox', 'data': chatgpt_response}))

            elif data['type'] == 'user_message':
                print(data['data'])
                chatgpt_response = process_with_chatgpt(data['data'])
                print(f"gpt respond :{chatgpt_response}")
                await ws.send(json.dumps({'type': 'chatgpt_response_chatbox', 'data': chatgpt_response}))

        except json.JSONDecodeError:
            print("Received non-JSON message:", message)
        except Exception as e:
            print(f"An error occurred: {e}")

async def process_with_whisper(base64_data):
    base64_data = base64_data.split(",")[1]
    audio_data = base64.b64decode(base64_data)
    with open("received_audio.wav", "wb") as audio_file:
        audio_file.write(audio_data)
    audio_file = open("received_audio.wav", "rb")
    transcript = client.audio.transcriptions.create(
    model="whisper-1", 
    file=audio_file, 
    response_format="text"
    )
    print(f"result :{transcript}")
    stt_tran = user_message_record(transcript)
    print(f"stt_tran :{stt_tran}")
    return stt_tran

def user_message_record(transcript):
    try:
        with open("user_message_json.json", "r") as json_file:
            data = json.load(json_file)
    except (json.JSONDecodeError, FileNotFoundError):
        data = []
    timestamp = datetime.now().isoformat()
    formatted_timestamp = datetime.fromisoformat(timestamp).strftime("%Y-%m-%d %H:%M:%S")
    data.append({
    "user_message": transcript,
    "timestamp": formatted_timestamp
    })
    with open("user_message_json.json", "w", encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False)
        return transcript
    
def process_with_chatgpt(text):
    respond =  client.chat.completions.create(
        messages=[
            {   
                "role": "user",
                "content": text,
            }
        ],
        model="gpt-3.5-turbo-1106",
    )
    return respond.choices[0].message.content

   

# conversation_histories = {}

# MAX_HISTORY_LENGTH = 5  # Adjust this number based on your requirements

# def trim_conversation_history(history):
#     return history[-MAX_HISTORY_LENGTH:]

# def get_conversation_history(session_id):
#     return conversation_histories.get(session_id, [])

# def generate_response(user_id, user_message):
#     history = get_conversation_history(user_id)
#     trimmed_history = trim_conversation_history(history)

#     response = client.chat.completions.create(
#         messages=trimmed_history + [{"role": "user", "content": user_message}],
#         model="gpt-3.5-turbo-1106",
#     )
#     bot_message = response.choices[0].message.content
#     update_conversation_history(user_id, user_message, bot_message)

#     return bot_message

# def update_conversation_history(session_id, user_message, model_message):
#     if session_id not in conversation_histories:
#         conversation_histories[session_id] = []
#     conversation_histories[session_id].append({"role": "user", "content": user_message})
#     conversation_histories[session_id].append({"role": "assistant", "content": model_message})

# def generate_response(session_id, user_message):
#     history = get_conversation_history(session_id)
#     history.append({"role": "user", "content": user_message})

#     response = client.chat.create(
#         model="gpt-3.5-turbo",  # Use the appropriate model
#         messages=history[-MAX_HISTORY_LENGTH:]  # Limit the history length
#     )

#     model_message = response.choices[0].message.content
#     update_conversation_history(session_id, user_message, model_message)
#     return model_message


# tools = [
  
# ]

# agent_kwargs = {
#     "extra_prompt_messages": [MessagesPlaceholder(variable_name="memory")],
#     "system_message": system_message,
# }
# memory = ConversationSummaryBufferMemory(
#     memory_key="memory", return_messages=True, llm=llm, max_token_limit=1000)

# agent = initialize_agent(
#     tools,
#     llm,
#     agent=AgentType.OPENAI_FUNCTIONS,
#     verbose=True,
#     agent_kwargs=agent_kwargs,
#     memory=memory,
# )




# app.blueprint(routes)
app.add_websocket_route(websocket_handler, '/ws')
if __name__ == "__main__":
    print("Starting server") 
    
    app.run(host="0.0.0.0", port=8000, debug= False)
