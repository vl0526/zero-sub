const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Thông tin tự giới thiệu
const userInfo = `
Tôi là Phan Tự Anh Hào, học lớp 7A2 trường THCS Võng La, sống tại Đông Anh, Hà Nội. 
Tôi tự nhận là "đẹp trai nhất vũ trụ" và có những người bạn thân là: 
Hoàng Đăng Duy, Đinh Đức Đông (chó), Bùi Quang Tuệ, Nguyễn Bá Dương, Vũ Đình Nguyên, Vũ An Gia Khánh.
`;

// API URL và key
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_API_KEY";

sendBtn.addEventListener('click', async () => {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, 'user');
  userInput.value = '';

  // Tự trả lời nếu người dùng hỏi thông tin cá nhân
  if (message.toLowerCase().includes("bạn là ai")) {
    appendMessage(userInfo, 'ai');
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      }),
    });

    if (!response.ok) throw new Error('Lỗi khi kết nối đến API');

    const data = await response.json();
    const aiReply = data.contents?.[0]?.parts?.[0]?.text || 'AI không có phản hồi.';
    appendMessage(aiReply, 'ai');
  } catch (error) {
    appendMessage('Lỗi: Không thể kết nối đến AI.', 'ai');
    console.error(error);
  }
});

// Thêm tin nhắn vào giao diện
function appendMessage(text, sender) {
  const message = document.createElement('div');
  message.className = `message ${sender}`;
  message.textContent = text;
  chatbox.appendChild(message);
  chatbox.scrollTop = chatbox.scrollHeight;
}
