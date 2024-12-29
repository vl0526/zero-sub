const WebSocket = require('ws');
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>WebSocket Server</h1>');
});
const wss = new WebSocket.Server({ noServer: true });

// Lưu trữ thông tin người dùng (tạm thời, có thể thay bằng cơ sở dữ liệu)
let users = {}; // Để lưu thông tin người dùng, ví dụ như tên và mật khẩu
let rooms = {}; // Lưu trữ thông tin phòng chat

wss.on('connection', ws => {
    let currentUser = null;
    let currentRoom = null;

    ws.on('message', message => {
        const data = JSON.parse(message);

        // Đăng ký tài khoản mới
        if (data.type === 'register') {
            if (users[data.username]) {
                ws.send(JSON.stringify({ type: 'error', message: 'Tên người dùng đã tồn tại' }));
            } else {
                users[data.username] = { password: data.password, friends: [] };
                ws.send(JSON.stringify({ type: 'success', message: 'Tạo tài khoản thành công' }));
            }
        }

        // Đăng nhập
        if (data.type === 'login') {
            if (users[data.username] && users[data.username].password === data.password) {
                currentUser = { username: data.username, friends: users[data.username].friends };
                ws.send(JSON.stringify({ type: 'success', message: `Chào mừng ${data.username}` }));
            } else {
                ws.send(JSON.stringify({ type: 'error', message: 'Tên người dùng hoặc mật khẩu sai' }));
            }
        }

        // Kết bạn
        if (data.type === 'add_friend' && currentUser) {
            const targetUser = users[data.friendUsername];
            if (targetUser) {
                currentUser.friends.push(data.friendUsername);
                targetUser.friends.push(currentUser.username);
                ws.send(JSON.stringify({ type: 'friend_added', message: `Đã kết bạn với ${data.friendUsername}` }));
                targetUser.socket.send(JSON.stringify({ type: 'new_friend', message: `${currentUser.username} đã kết bạn với bạn` }));
            } else {
                ws.send(JSON.stringify({ type: 'error', message: 'Người dùng không tồn tại' }));
            }
        }

        // Tạo phòng mới
        if (data.type === 'create_room' && currentUser) {
            const roomId = Date.now().toString();
            rooms[roomId] = { users: [currentUser.username], owner: currentUser.username };
            ws.send(JSON.stringify({ type: 'room_created', roomId }));
        }

        // Tham gia phòng
        if (data.type === 'join_room' && currentUser) {
            const room = rooms[data.roomId];
            if (room) {
                room.users.push(currentUser.username);
                currentRoom = room;
                room.users.forEach(user => {
                    const userSocket = users[user]?.socket;
                    if (userSocket) userSocket.send(JSON.stringify({ type: 'user_joined', message: `${currentUser.username} đã vào phòng` }));
                });
                ws.send(JSON.stringify({ type: 'room_joined', roomId: data.roomId, users: room.users }));
            }
        }

        // Gửi tin nhắn trong phòng
        if (data.type === 'chat_message' && currentRoom) {
            const message = { from: currentUser.username, message: data.message };
            currentRoom.users.forEach(username => {
                const userSocket = users[username]?.socket;
                if (userSocket) userSocket.send(JSON.stringify({ type: 'chat_message', ...message }));
            });
        }

        // Đóng phòng
        if (data.type === 'close_room' && currentRoom && currentUser.username === currentRoom.owner) {
            currentRoom.users.forEach(username => {
                const userSocket = users[username]?.socket;
                if (userSocket) userSocket.send(JSON.stringify({ type: 'room_closed', message: 'Phòng đã bị đóng' }));
            });
            delete rooms[currentRoom.roomId];
            currentRoom = null;
        }

        // Đá người dùng khỏi phòng
        if (data.type === 'kick_user' && currentRoom && currentUser.username === currentRoom.owner) {
            const userIndex = currentRoom.users.indexOf(data.username);
            if (userIndex !== -1) {
                currentRoom.users.splice(userIndex, 1);
                const kickedUserSocket = users[data.username]?.socket;
                if (kickedUserSocket) kickedUserSocket.send(JSON.stringify({ type: 'kicked', message: 'Bạn đã bị đá khỏi phòng' }));
                currentRoom.users.forEach(username => {
                    const userSocket = users[username]?.socket;
                    if (userSocket) userSocket.send(JSON.stringify({ type: 'user_kicked', message: `${data.username} đã bị đá khỏi phòng` }));
                });
            }
        }
    });

    ws.on('close', () => {
        if (currentUser) {
            delete users[currentUser.username]; // Xóa người dùng khi họ thoát
            if (currentRoom) {
                const userIndex = currentRoom.users.indexOf(currentUser.username);
                if (userIndex !== -1) {
                    currentRoom.users.splice(userIndex, 1);
                    currentRoom.users.forEach(username => {
                        const userSocket = users[username]?.socket;
                        if (userSocket) userSocket.send(JSON.stringify({ type: 'user_left', message: `${currentUser.username} đã rời khỏi phòng` }));
                    });
                }
            }
        }
    });
});

server.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, ws => wss.emit('connection', ws, req));
});

server.listen(8080, () => console.log('Server đang chạy trên http://localhost:8080'));
