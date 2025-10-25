"""
Simple icon generator for Colab Keepalive extension
Creates three PNG icons with a flame emoji
Requires: pip install pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    """Create a simple icon with gradient background and flame emoji"""
    
    # Create image with gradient background
    img = Image.new('RGB', (size, size), '#667eea')
    draw = ImageDraw.Draw(img)
    
    # Create gradient effect
    for y in range(size):
        color_value = int(102 + (118 - 102) * (y / size))  # Gradient from #667eea to #764ba2
        color = f'#{color_value:02x}7e{234 - int((234 - 162) * (y / size)):02x}'
        draw.line([(0, y), (size, y)], fill=color)
    
    # Add flame emoji or text
    try:
        # Try to use a system font
        font_size = int(size * 0.6)
        font = ImageFont.truetype("seguiemj.ttf", font_size)  # Windows emoji font
        emoji = "🔥"
    except:
        # Fallback to basic text
        font_size = int(size * 0.5)
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            font = ImageFont.load_default()
        emoji = "CK"  # Colab Keepalive initials
    
    # Get text dimensions and center it
    bbox = draw.textbbox((0, 0), emoji, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    position = ((size - text_width) // 2, (size - text_height) // 2 - bbox[1])
    
    # Draw text with shadow
    shadow_offset = max(1, size // 32)
    draw.text((position[0] + shadow_offset, position[1] + shadow_offset), 
              emoji, font=font, fill='#00000080')
    draw.text(position, emoji, font=font, fill='white')
    
    # Add border
    border_width = max(1, size // 32)
    draw.rectangle([0, 0, size-1, size-1], outline='white', width=border_width)
    
    # Save
    img.save(filename, 'PNG')
    print(f"Created {filename} ({size}x{size})")

def main():
    """Generate all required icon sizes"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    sizes = [
        (16, 'icon16.png'),
        (48, 'icon48.png'),
        (128, 'icon128.png')
    ]
    
    print("Generating extension icons...")
    
    for size, filename in sizes:
        filepath = os.path.join(script_dir, filename)
        create_icon(size, filepath)
    
    print("\n✅ All icons generated successfully!")
    print("Icons are ready for use in your Chrome extension.")

if __name__ == '__main__':
    try:
        from PIL import Image, ImageDraw, ImageFont
        main()
    except ImportError:
        print("❌ Error: PIL (Pillow) not installed")
        print("\nPlease install Pillow:")
        print("  pip install pillow")
        print("\nThen run this script again:")
        print("  python generate_icons.py")
