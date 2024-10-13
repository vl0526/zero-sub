from flask import Flask, request, jsonify, render_template
import subprocess
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_subtitles', methods=['POST'])
def generate_subtitles():
    if 'video' not in request.files:
        return jsonify({'subtitles': 'No video file provided.'}), 400

    video_file = request.files['video']
    video_path = os.path.join('uploads', video_file.filename)
    video_file.save(video_path)

    # Sử dụng subprocess để gọi một công cụ tạo phụ đề, ví dụ như `autosub`
    # Thay đổi dòng dưới đây với lệnh cụ thể của bạn để tạo phụ đề
    # Giả sử bạn đã cài đặt autosub
    try:
        subprocess.run(['autosub', video_path], check=True)
        
        # Giả sử phụ đề được tạo thành file .srt
        subtitle_file = video_path.replace('.mp4', '.srt')  # Thay đổi tùy theo định dạng video

        with open(subtitle_file, 'r') as f:
            subtitles = f.read()

        os.remove(video_path)  # Xóa video sau khi xử lý
        os.remove(subtitle_file)  # Xóa file phụ đề sau khi đọc
        return jsonify({'subtitles': subtitles})
    except Exception as e:
        return jsonify({'subtitles': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
