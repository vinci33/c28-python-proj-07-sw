async function startRecording() {
    try {
        let stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const mediaRecorder = new MediaRecorder(stream);
        let chunks = [];

        mediaRecorder.ondataavailable = function (event) {
            chunks.push(event.data);
        };

        mediaRecorder.onstop = async function () {
            let blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
            chunks = [];

            let arrayBuffer = await blob.arrayBuffer();
            let audio_data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

            try {
                // Send the audio data to the Python backend
                let response = await fetch('http://localhost:8000/speech-to-text', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ audio_data: audio_data }),
                });

                let data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        let button = document.querySelector('#start');

        button.onmousedown = button.ontouchstart = function () {
            mediaRecorder.start();
        };

        button.onmouseup = button.ontouchend = function () {
            mediaRecorder.stop();
        };
    } catch (err) {
        console.log('getUserMedia error: ', err);
    }
}

startRecording();