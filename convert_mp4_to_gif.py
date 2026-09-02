import os
from moviepy import VideoFileClip

def convert_mp4_to_gif(mp4_path, gif_path):
    print(f"Converting {mp4_path} to {gif_path}...")
    try:
        clip = VideoFileClip(mp4_path)
        clip.write_gif(gif_path, fps=10)
        print("Conversion successful.")
    except Exception as e:
        print(f"Error during conversion: {e}")

if __name__ == "__main__":
    mp4_path = r"templates\happy birthday dudu\295830269299405777_1.mp4"
    gif_path = r"static\images\295830269299405777_1.gif"
    
    if os.path.exists(mp4_path):
        convert_mp4_to_gif(mp4_path, gif_path)
    else:
        print(f"File not found: {mp4_path}")
