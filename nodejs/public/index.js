// Create a new MediaRecorder object
const mediaRecorder = new MediaRecorder(window.stream);

// Set up the ondataavailable event
mediaRecorder.ondataavailable = function(event) {
    // Get the audio data from the event
    var audio_data = event.data;

    // Log the audio data
    console.log(audio_data);

    // Send the audio data to the Python backend
    fetch('http://your-python-backend-url/speech-to-text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audio_data: audio_data }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
        console.error('Error:', error);
    });
};

// Start the MediaRecorder
mediaRecorder.start();
