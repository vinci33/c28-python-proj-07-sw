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
    # Get the text from the request body
    text = request.json.get('text')

    # Use the OpenAI API to convert the text to speech
    response = openai.TextCompletion.create(engine="text-davinci-002", prompt=text, max_tokens=5)

    # Return the response from the OpenAI API
    return json({'response': response.choices[0].text.strip()})

app.blueprint(routes)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, workers=1)