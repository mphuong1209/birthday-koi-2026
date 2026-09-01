from rembg import remove
from PIL import Image
import os

input_path = "templates/dudu.png"
output_path = "static/images/dudu-face.png"

def process_image():
    if not os.path.exists(input_path):
        print(f"Error: Could not find {input_path}")
        return False
        
    print(f"Found {input_path}, processing...")
    try:
        input_image = Image.open(input_path)
        output_image = remove(input_image)
        output_image.save(output_path)
        print(f"Successfully saved transparent image to {output_path}")
        return True
    except Exception as e:
        print(f"Error processing image: {e}")
        return False

if __name__ == "__main__":
    process_image()
