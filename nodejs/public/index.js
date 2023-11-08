// Create a new SpeechRecognition object
const recognition = new window.SpeechRecognition();

// Set up the onresult event
recognition.onresult = function(event) {
    // Get the transcript of the user's voice input
    var transcript = event.results[0][0].transcript;

    // Log the transcript
    console.log(transcript);

    // Here you can add the fetch API call to send `transcript` to your Python backend
    fetch('http://your-python-backend-url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: transcript }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
        console.error('Error:', error);
    });
};

// Start the speech recognition
recognition.start();
