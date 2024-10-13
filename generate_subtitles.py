import os
import subprocess
from flask import Flask, request, jsonify

app = Flask(__name__)

def create_app():
    app = Flask(__name__)

    @app.route('/api/generate_subtitles', methods=['POST'])
    def generate_subtitles():
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided.'}), 400

        video_file = request.files['video']
        video_path = os.path.join('/tmp', video_file.filename)
        video_file.save(video_path)

        # Sử dụng subprocess để gọi một công cụ tạo phụ đề, ví dụ như `autosub`
        # Thay đổi dòng dưới đây với lệnh cụ thể của bạn để tạo phụ đề
        try:
            # Giả sử bạn đã cài đặt autosub
            subprocess.run(['autosub', video_path], check=True)

            # Giả sử phụ đề được tạo thành file .srt
            subtitle_file = video_path.replace('.mp4', '.srt')  # Thay đổi tùy theo định dạng video

            with open(subtitle_file, 'r') as f:
                subtitles = f.read()

            os.remove(video_path)  # Xóa video sau khi xử lý
            os.remove(subtitle_file)  # Xóa file phụ đề sau khi đọc
            return jsonify({'subtitles': subtitles})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return app

if __name__ == '__main__':
    app.run()
