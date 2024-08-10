document.getElementById('dubbingForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của form

    const fileInput = document.getElementById('videoFile');
    const languageSelect = document.getElementById('language');
    const dubbedVideo = document.getElementById('dubbedVideo');

    if (fileInput.files.length === 0) {
        alert('Please upload a video file.');
        return;
    }

    const videoFile = fileInput.files[0];
    const language = languageSelect.value;

    try {
        const formData = new FormData();
        formData.append('file', videoFile);
        formData.append('language', language);

        const response = await fetch('https://dubbing.speechify.com/api/v1/dub-with-subtitles', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer mIYyRvA0J1CSVlgh7W7Q3XqJX7JG7rdpeL1sUCfV2U0='
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error: ${errorText}`);
        }

        const result = await response.json();

        if (result.dubbedVideoUrl) {
            dubbedVideo.src = result.dubbedVideoUrl;
            dubbedVideo.style.display = 'block';
        } else {
            throw new Error('No video URL returned from the API.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Failed to dub the video and add subtitles: ${error.message}`);
    }
});
