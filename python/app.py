import openai
from sanic import Sanic
from sanic.response import json
from routes import routes
from dotenv import load_dotenv
import os

# Load the environment variables
load_dotenv()
key = os.getenv('KEY')
print(key)


app = Sanic("BAD_project_team7_2023_11_05")

# Set up the OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/speech-to-text', methods=['POST'])
async def speech_to_text(request):
    # Get the audio data from the request body
    audio_data = request.json.get('audio_data')

    # Use the OpenAI API to convert the audio data to text
    response = openai.SpeechToText.create(audio_data=audio_data)

    # Return the response from the OpenAI API
    return json({'response': response.text})

app.blueprint(routes)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, workers=1)
