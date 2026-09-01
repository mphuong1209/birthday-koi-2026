from rembg import remove
from PIL import Image
import os
import shutil

input_dir = "templates/bubu-dudu"
output_dir = "static/images/bubu-dudu"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Pick a maximum of 15 images to avoid too much processing time for the floating effect
files = os.listdir(input_dir)
processed_count = 0

for file in files:
    if processed_count >= 15:
        break
        
    input_path = os.path.join(input_dir, file)
    output_path = os.path.join(output_dir, file.split('.')[0] + '.png')
    
    if file.endswith('.jpg'):
        print(f"Processing {file}...")
        try:
            input_image = Image.open(input_path)
            output_image = remove(input_image)
            output_image.save(output_path)
            processed_count += 1
        except Exception as e:
            print(f"Error on {file}: {e}")
    elif file.endswith('.gif'):
        print(f"Copying GIF {file}...")
        # GIFs might be animated, rembg would destroy animation. We just copy them.
        # If user wants them transparent, we hope they already are, or we just use them as is.
        # But wait, we can just use the JPGs for floating since there are plenty.
        shutil.copy(input_path, os.path.join(output_dir, file))
        processed_count += 1

print("Done processing 15 images!")
