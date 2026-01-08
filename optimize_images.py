import os
import subprocess
import json
import glob

IMAGE_DIR = 'assets/images'

def get_dimensions(filepath):
    """Get image dimensions using ffprobe."""
    cmd = [
        'ffprobe', '-v', 'error',
        '-select_streams', 'v:0',
        '-show_entries', 'stream=width,height',
        '-of', 'json',
        filepath
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        data = json.loads(result.stdout)
        if 'streams' in data and len(data['streams']) > 0:
            return data['streams'][0]['width'], data['streams'][0]['height']
        return None
    except Exception as e:
        print(f"Error reading dimensions for {filepath}: {e}")
        return None

def convert_to_webp(filename):
    if filename.startswith('.') or not filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        return

    filepath = os.path.join(IMAGE_DIR, filename)
    name_no_ext = os.path.splitext(filename)[0]
    output_filename = name_no_ext + ".webp"
    output_path = os.path.join(IMAGE_DIR, output_filename)
    
    # Skip if webp already exists (unless we want to force regen, but safer to skip to avoid double work)
    # Actually, let's force regen to ensure latest optimization rules
    
    # Determine target width based on filename patterns (same rules as before)
    if 'card' in filename:
        target_width = 800
        quality = 75 
    elif 'hero' in filename:
        target_width = 1920
        quality = 80
    elif 'room' in filename or 'exterior' in filename:
        target_width = 1600
        quality = 75
    else:
        target_width = 1200
        quality = 75

    dims = get_dimensions(filepath)
    if not dims:
        print(f"Skipping {filename}: Could not determine dimensions.")
        return
    
    width, height = dims
    
    # Prepare ffmpeg command for WebP
    # -c:v libwebp -q:v [0-100] where 100 is best. 75 is default good balance.
    cmd = ['ffmpeg', '-y', '-v', 'error', '-i', filepath]
    
    # Scaling logic
    scale_filter = ""
    if width > target_width:
        scale_filter = f"scale={target_width}:-1"
        cmd.extend(['-vf', scale_filter])
    
    cmd.extend(['-c:v', 'libwebp', '-q:v', str(quality), output_path])
    
    print(f"Converting {filename} to WebP...")
    print(f"  Orig: {width}x{height} | Target Width: {target_width} | Q: {quality}")

    try:
        subprocess.run(cmd, check=True)
        
        old_size = os.path.getsize(filepath)
        new_size = os.path.getsize(output_path)
        reduction = (old_size - new_size) / old_size * 100
        
        print(f"  DONE: {output_filename} ({new_size/1024:.1f}KB) [Orig: {old_size/1024:.1f}KB, -{reduction:.1f}%]")

    except subprocess.CalledProcessError as e:
        print(f"  ERROR processing {filename}: {e}")
        if os.path.exists(output_path):
            os.remove(output_path)

def main():
    if not os.path.exists(IMAGE_DIR):
        print(f"Directory not found: {IMAGE_DIR}")
        return

    print("--- Starting WebP Conversion ---")
    # List all jpg/png files
    files = [f for f in os.listdir(IMAGE_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png')) and not f.startswith('.')]
    files.sort()
    
    for f in files:
        convert_to_webp(f)
    print("--- Conversion Complete ---")

if __name__ == '__main__':
    main()
