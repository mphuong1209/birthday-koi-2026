# -*- coding: utf-8 -*-
from flask import Flask, render_template
from datetime import datetime
import config
import os

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



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
