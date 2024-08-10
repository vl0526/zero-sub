document.getElementById('dubbingForm').addEventListener('submit', async function(event) {
    event.preventDefault();

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

        // Thực hiện yêu cầu POST tới API của Speechify để tạo phụ đề và lồng tiếng
        const response = await fetch('https://dubbing.speechify.com/api/v1/dub-with-subtitles', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer mIYyRvA0J1CSVlgh7W7Q3XqJX7JG7rdpeL1sUCfV2U0='
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error in dubbing process.');
        }

        const result = await response.json();
        
        // Giả sử API trả về URL của video đã được lồng tiếng và thêm phụ đề
        dubbedVideo.src = result.dubbedVideoUrl;
        dubbedVideo.style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to dub the video and add subtitles.');
    }
});
