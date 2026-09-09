# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, jsonify
from datetime import datetime
import config
import os
import json
import sys
import socket

app = Flask(__name__)


@app.route("/")
def home():
    love_start = datetime(
        config.LOVE_START_DATE["year"],
        config.LOVE_START_DATE["month"],
        config.LOVE_START_DATE["day"],
        config.LOVE_START_DATE.get("hour", 0),
        config.LOVE_START_DATE.get("minute", 0)
    )

    # Truyền timestamp (mili-giây) cho JS tự đếm real-time
    love_start_ts = int(love_start.timestamp() * 1000)

    # Tính timestamp sinh nhật 10/09/2026 cố định
    bday_month = config.BIRTHDAY_DATE["month"]
    bday_day = config.BIRTHDAY_DATE["day"]
    bday_hour = config.BIRTHDAY_DATE.get("hour", 0)
    bday_year = config.BIRTHDAY_DATE.get("year", None)

    now = datetime.now()
    if bday_year:
        # Nếu config có khai báo năm cụ thể thì dùng luôn
        next_bday = datetime(bday_year, bday_month, bday_day, bday_hour)
    else:
        # Tự tính năm gần nhất
        this_year_bday = datetime(now.year, bday_month, bday_day, bday_hour)
        if this_year_bday < now:
            next_bday = datetime(now.year + 1, bday_month, bday_day, bday_hour)
        else:
            next_bday = this_year_bday

    next_bday_ts = int(next_bday.timestamp() * 1000)


    return render_template(
        "index.html",
        your_name=config.YOUR_NAME,
        partner_name=config.PARTNER_NAME,
        love_start_ts=love_start_ts,
        next_bday_ts=next_bday_ts,
        birthday_message=config.BIRTHDAY_MESSAGE,
        memories=config.MEMORIES,
        reasons=config.REASONS_TO_LOVE,
        gallery_images=config.GALLERY_IMAGES,
        bg_music=config.BACKGROUND_MUSIC,
        gift_image=getattr(config, "GIFT_IMAGE", "gift_photo.jpg"),
        gift_message=getattr(config, "GIFT_MESSAGE", "")
    )

@app.route("/api/save_wish", methods=["POST"])
def save_wish():
    try:
        data = request.get_json()
        wish_text = data.get("wish", "").strip()
        if wish_text:
            wish_entry = {
                "text": wish_text,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            
            wishes = []
            if os.path.exists("wishes.json"):
                with open("wishes.json", "r", encoding="utf-8") as f:
                    try:
                        wishes = json.load(f)
                    except:
                        wishes = []
            
            wishes.append(wish_entry)
            
            with open("wishes.json", "w", encoding="utf-8") as f:
                json.dump(wishes, f, ensure_ascii=False, indent=4)
                
            return jsonify({"status": "success", "message": "Đã lưu lời chúc!"})
        return jsonify({"status": "error", "message": "Lời chúc trống!"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/api/get_wishes")
def get_wishes():
    wishes = []
    if os.path.exists("wishes.json"):
        with open("wishes.json", "r", encoding="utf-8") as f:
            try:
                wishes = json.load(f)
            except:
                pass
    wishes.reverse()
    return jsonify(wishes)

@app.route("/admin")
def view_wishes():
    return render_template("admin.html")


if __name__ == "__main__":
    if sys.platform == "win32":
        try:
            sys.stdout.reconfigure(encoding="utf-8")
            sys.stderr.reconfigure(encoding="utf-8")
        except Exception:
            pass

    port = int(os.environ.get("PORT", 5000))
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
    except Exception:
        local_ip = "127.0.0.1"

    # In thông tin đường link trực tiếp lên Terminal (chỉ in 1 lần duy nhất khi khởi động)
    if os.environ.get("WERKZEUG_RUN_MAIN") != "true":
        border = "═" * 66
        print(f"\n{border}", flush=True)
        print("  🎉 WEBSITE ĐÃ SẴN SÀNG HOẠT ĐỘNG!", flush=True)
        print(f"{border}", flush=True)
        print("  ❤️   TRANG WEB GỬI CHO NGƯỜI YÊU:", flush=True)
        print(f"      👉 Trình duyệt máy tính  : http://localhost:{port}", flush=True)
        print(f"      👉 Điện thoại (cùng WiFi): http://{local_ip}:{port}", flush=True)
        print("", flush=True)
        print("  💌  TRANG ADMIN (NHẬN & XEM LỜI CHÚC TỪ NGƯỜI YÊU):", flush=True)
        print(f"      👉 Trình duyệt máy tính  : http://localhost:{port}/admin", flush=True)
        print(f"      👉 Điện thoại (cùng WiFi): http://{local_ip}:{port}/admin", flush=True)
        print(f"{border}\n", flush=True)

    app.run(host="0.0.0.0", port=port, debug=True)

