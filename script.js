let correctPassword = "";
let attempts = 0;
let countdownTimer;
let countdownStarted = false;

document.getElementById('confirmButton').addEventListener('click', function() {
    const password = document.getElementById('passwordInput').value;

    if (password === correctPassword) {
        if (!countdownStarted) {
            document.getElementById('loginContainer').classList.add('hidden');
            document.getElementById('countdownContainer').classList.remove('hidden');
            document.getElementById('countdown').classList.remove('hidden');
            document.getElementById('openButton').classList.remove('hidden');
            startCountdown(); // Bắt đầu đếm ngược ngay khi xác nhận đúng mật khẩu
            countdownStarted = true; // Đảm bảo đếm ngược chỉ bắt đầu một lần
        }
    } else if (password === "1" && attempts < 2) {
        attempts++;
        document.getElementById('errorMessage').classList.remove('hidden');
    } else if (password === "1" && attempts === 2) {
        attempts = 0;
        document.getElementById('keyMenu').classList.remove('hidden');
        document.getElementById('errorMessage').classList.add('hidden');
    } else {
        document.getElementById('errorMessage').classList.remove('hidden');
    }
});

document.getElementById('saveButton').addEventListener('click', function() {
    correctPassword = document.getElementById('newKey').value;
    const expiryTime = parseInt(document.getElementById('expiryTime').value, 10);

    // Tính thời gian hết hạn
    const currentTime = Date.now();
    const expiryDate = currentTime + (expiryTime * 1000);

    localStorage.setItem('correctPassword', correctPassword);
    localStorage.setItem('expiryDate', expiryDate);

    document.getElementById('keyMenu').classList.add('hidden');
    document.getElementById('newKey').value = '';
    document.getElementById('expiryTime').value = '';
});

document.getElementById('openButton').addEventListener('click', function() {
    document.getElementById('openButton').classList.add('hidden');
    document.querySelector('.container').classList.add('hidden');
    document.getElementById('iframeContainer').classList.remove('hidden');
});

function checkPasswordExpiry() {
    const expiryDate = parseInt(localStorage.getItem('expiryDate'), 10);
    if (expiryDate && Date.now() > expiryDate) {
        localStorage.removeItem('correctPassword');
        localStorage.removeItem('expiryDate');
        alert('Mật khẩu đã hết hạn');
        document.querySelector('.container').classList.remove('hidden');
        document.getElementById('iframeContainer').classList.add('hidden');
        document.getElementById('countdown').classList.add('hidden');
    }
}

function startCountdown() {
    const expiryDate = parseInt(localStorage.getItem('expiryDate'), 10);

    if (expiryDate) {
        countdownTimer = setInterval(() => {
            const timeLeft = expiryDate - Date.now();
            if (timeLeft <= 0) {
                clearInterval(countdownTimer);
                localStorage.removeItem('correctPassword');
                localStorage.removeItem('expiryDate');
                document.querySelector('.container').classList.remove('hidden');
                document.getElementById('iframeContainer').classList.add('hidden');
                document.getElementById('countdown').classList.add('hidden');
                alert('Mật khẩu đã hết hạn');
                setTimeout(() => {
                    location.reload(); // Tải lại trang ngay lập tức sau 0,001 giây
                }, 1);
            } else {
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                document.getElementById('countdown').textContent = `Còn lại: ${minutes}:${seconds}`;
            }
        }, 1000);
    }
}

window.onload = function() {
    correctPassword = localStorage.getItem('correctPassword') || '';
    checkPasswordExpiry();
    if (correctPassword) {
        const expiryDate = parseInt(localStorage.getItem('expiryDate'), 10);
        if (Date.now() < expiryDate) {
            document.getElementById('loginContainer').classList.add('hidden');
            document.getElementById('countdownContainer').classList.remove('hidden');
            document.getElementById('countdown').classList.remove('hidden');
            document.getElementById('openButton').classList.remove('hidden');
            startCountdown(); // Bắt đầu đếm ngược ngay khi trang tải lại
            countdownStarted = true; // Đảm bảo đếm ngược chỉ bắt đầu một lần
        }
    }
};

// Vô hiệu hóa bấm chuột phải
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Vô hiệu hóa các tổ hợp phím
document.addEventListener('keydown', function(e) {
    // Disable F12
    if (e.keyCode === 123) {
        e.preventDefault();
    }

    // Disable Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
    }

    // Disable Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
    }

    // Disable Ctrl+Shift+C (Element selector)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
    }

    // Disable Ctrl+U (View source)
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
    }

    // Disable Ctrl+S (Save)
    if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
    }
});
