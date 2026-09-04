# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, jsonify
from datetime import datetime
import config
import os
import json

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
    import datetime
    now = datetime.datetime.now()
    is_protected_date = (now.year == 2026 and now.month == 9 and now.day == 10)
    
    if not is_protected_date:
        try:
            with open("wishes.json", "w", encoding="utf-8") as f:
                json.dump([], f)
        except Exception:
            pass
            
    return render_template("admin.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
