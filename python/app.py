import openai
from sanic import Sanic
from sanic.response import json
from routes import routes
from dotenv import load_dotenv
import os

load_dotenv()
key = os.getenv('KEY')
print(key)


app = Sanic("BAD_project_team7_2023_11_05")


openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/speech-to-text', methods=['POST'])
async def speech_to_text(request):
    audio_data = request.json.get('audio_data')

    response = openai.SpeechToText.create(audio_data=audio_data)

    return json({'response': response.text})

app.blueprint(routes)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, workers=1)
