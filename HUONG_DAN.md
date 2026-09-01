# 💌 Hướng dẫn sử dụng "Love Web"

## 1. Cấu trúc project
```
love-web/
├── app.py              ← code Flask chính (ít khi cần sửa)
├── config.py           ← ⭐ SỬA FILE NÀY để đổi tên, ngày tháng, kỷ niệm, lời chúc
├── requirements.txt     ← danh sách thư viện cần cài
├── Procfile             ← để deploy lên Render/Railway
├── templates/
│   └── index.html       ← giao diện trang web
└── static/
    ├── css/style.css    ← màu sắc, hiệu ứng
    ├── js/script.js     ← logic đếm giờ, confetti, random lý do yêu
    ├── images/          ← 📸 BỎ ẢNH CỦA BẠN VÀO ĐÂY
    └── music/           ← (tuỳ chọn) bỏ file nhạc mp3 vào đây
```

## 2. Việc đầu tiên: sửa `config.py`
Mở file `config.py`, đổi các phần:
- `YOUR_NAME`, `PARTNER_NAME`: tên 2 bạn
- `LOVE_START_DATE`: ngày bắt đầu yêu nhau
- `BIRTHDAY_DATE`: ngày sinh nhật người yêu
- `BIRTHDAY_MESSAGE`: lời chúc chính
- `MEMORIES`: danh sách kỷ niệm (thêm/bớt tuỳ ý)
- `REASONS_TO_LOVE`: danh sách lý do yêu (bấm nút sẽ random ra)
- `GALLERY_IMAGES`: tên các file ảnh sẽ hiện ở phần gallery

## 3. Bỏ ảnh vào
- Copy ảnh của 2 bạn vào thư mục `static/images/`
- Đặt tên trùng với tên bạn khai báo trong `config.py` (ví dụ `memory1.jpg`, `gallery1.jpg`...)
- Nếu ảnh nào chưa có, web sẽ tự hiện ảnh placeholder thay thế, không bị lỗi vỡ trang

## 4. Chạy thử trên máy tính trước
Mở terminal tại thư mục `love-web`, chạy:
```bash
pip install -r requirements.txt
python app.py
```
Sau đó mở trình duyệt vào: `http://localhost:5000`

## 5. Deploy để lấy LINK gửi cho người yêu 🔗

### Cách dễ nhất: dùng Render.com (miễn phí)
1. Tạo tài khoản GitHub (nếu chưa có) tại github.com
2. Tạo 1 repo mới, upload toàn bộ thư mục `love-web` này lên
3. Vào https://render.com → đăng ký/đăng nhập (có thể login bằng GitHub luôn)
4. Chọn **New +** → **Web Service**
5. Kết nối với repo GitHub vừa tạo
6. Điền cấu hình:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
7. Bấm **Create Web Service**, đợi vài phút để build xong
8. Render sẽ cho bạn 1 link dạng `https://ten-app-cua-ban.onrender.com` → gửi link này cho người yêu là xong!

> Lưu ý: gói free của Render sẽ "ngủ" nếu không ai truy cập trong 15 phút, lần đầu người yêu bạn bấm vào có thể phải đợi ~30 giây để web "thức dậy". Sau đó vào lại sẽ nhanh bình thường.

### Cách khác: Railway.app hoặc PythonAnywhere
Cách làm tương tự, upload code lên rồi trỏ start command là `gunicorn app:app` (Railway) hoặc theo hướng dẫn Flask app của PythonAnywhere.

## 6. Nếu cần trợ giúp thêm
Cứ quay lại hỏi mình, ví dụ:
- Muốn thêm hiệu ứng gì mới
- Muốn đổi giao diện qua tông màu khác
- Bị lỗi khi deploy, gửi mình xem log lỗi để mình fix cùng
