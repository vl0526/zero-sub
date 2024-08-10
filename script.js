function handleFileSelect(event) {
    const file = event.target.files[0];
    const uploadArea = document.getElementById('uploadArea');

    if (file) {
        uploadArea.textContent = file.name;
    }
}

function processVideo() {
    const language = document.getElementById('languageSelect').value;
    
    // Giả lập URL đã tạo phụ đề với ngôn ngữ đã chọn
    const baseUrl = 'https://dubbing.speechify.com/hA2Fkgzw6QEQnCgWTqqLNm/studio/translate';
    const generatedUrl = `${baseUrl}?lang=${language}`;
    
    // Chèn URL vào iframe để hiển thị
    const videoIframe = document.getElementById('videoIframe');
    videoIframe.src = generatedUrl;
    videoIframe.style.display = 'block';
}
