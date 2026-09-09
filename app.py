# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, jsonify
from datetime import datetime
import config
import os
import json
import sys
import socket
import subprocess
import threading
import atexit
import re
import urllib.request

app = Flask(__name__)

PUBLIC_URL_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".public_url")
CURRENT_PUBLIC_URL = None


def get_current_public_url():
    global CURRENT_PUBLIC_URL
    if os.path.exists(PUBLIC_URL_FILE):
        try:
            with open(PUBLIC_URL_FILE, "r", encoding="utf-8") as f:
                url = f.read().strip()
                if url:
                    return url
        except Exception:
            pass
    return CURRENT_PUBLIC_URL


def set_current_public_url(url):
    global CURRENT_PUBLIC_URL
    CURRENT_PUBLIC_URL = url
    try:
        with open(PUBLIC_URL_FILE, "w", encoding="utf-8") as f:
            f.write(url)
    except Exception:
        pass


def kill_existing_cloudflared():
    if sys.platform == "win32":
        try:
            subprocess.run(["taskkill", "/f", "/im", "cloudflared.exe"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception:
            pass


def start_public_tunnel(port):
    kill_existing_cloudflared()
    cloudflared_exe = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cloudflared.exe")
    if not os.path.exists(cloudflared_exe):
        try:
            print("  ⏳ Đang chuẩn bị công cụ tạo link Public (cloudflared)...", flush=True)
            url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
            urllib.request.urlretrieve(url, cloudflared_exe)
        except Exception as e:
            print(f"  ⚠️ Không thể tải cloudflared: {e}", flush=True)
            return

    try:
        proc = subprocess.Popen(
            [cloudflared_exe, "tunnel", "--url", f"http://127.0.0.1:{port}"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8",
            errors="replace",
            bufsize=1
        )
        atexit.register(lambda: proc.terminate() if proc.poll() is None else None)

        pattern = re.compile(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com")
        for line in iter(proc.stdout.readline, ""):
            if not line:
                break
            m = pattern.search(line)
            if m:
                pub_url = m.group(0)
                set_current_public_url(pub_url)
                border = "═" * 72
                print(f"\n{border}", flush=True)
                print("  🎉 WEBSITE ĐÃ PUBLIC RA TOÀN CẦU THÀNH CÔNG!", flush=True)
                print(f"{border}", flush=True)
                print("  🌐  LINK GỬI CHO NGƯỜI YÊU (MỞ ĐƯỢC CẢ ĐIỆN THOẠI & MÁY TÍNH):", flush=True)
                print(f"      👉 {pub_url}", flush=True)
                print("", flush=True)
                print("  💌  LINK ADMIN XEM LỜI CHÚC (CHO BÉ BUBU XEM TRÊN ĐIỆN THOẠI/MÁY TÍNH):", flush=True)
                print(f"      👉 {pub_url}/admin", flush=True)
                print("────────────────────────────────────────────────────────────────────────", flush=True)
                print("  💻  Link nội bộ (chỉ dùng trên máy tính này):", flush=True)
                print(f"      👉 Web chính: http://localhost:{port}", flush=True)
                print(f"      👉 Web Admin: http://localhost:{port}/admin", flush=True)
                print(f"{border}\n", flush=True)
                break
    except Exception as e:
        print(f"  ⚠️ Lỗi khi khởi động Cloudflare tunnel: {e}", flush=True)


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


@app.route("/api/get_public_url")
def get_public_url():
    return jsonify({"public_url": get_current_public_url()})


@app.route("/admin")
def view_wishes():
    return render_template("admin.html", public_url=get_current_public_url())


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

    if os.environ.get("WERKZEUG_RUN_MAIN") == "true" or not os.environ.get("WERKZEUG_RUN_MAIN"):
        border = "═" * 72
        print(f"\n{border}", flush=True)
        print("  🎉 WEBSITE ĐÃ KHỞI ĐỘNG THÀNH CÔNG!", flush=True)
        print("  ⏳ Đang kết nối Cloudflare để tạo link Public cho điện thoại & máy tính...", flush=True)
        print(f"{border}", flush=True)
        threading.Thread(target=start_public_tunnel, args=(port,), daemon=True).start()

    app.run(host="0.0.0.0", port=port, debug=True)


