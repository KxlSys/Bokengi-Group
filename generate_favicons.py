import os
from PIL import Image, ImageOps, ImageEnhance, ImageFilter, ImageDraw, ImageFont

src_path = r"C:\Users\Provi\Downloads\Image Codex.png"
out_dir = r"E:\01_Projets\Actifs\kal-cooperation\bokengi-group\public"
os.makedirs(out_dir, exist_ok=True)

img = Image.open(src_path).convert("RGBA")

# 1. Isolate the emblem
emblem_raw = img.crop((0, 0, img.width, 640))
emblem_bbox = emblem_raw.getbbox()
emblem = emblem_raw.crop(emblem_bbox)
ew, eh = emblem.size

# 2. Square the emblem onto a 1024x1024 canvas with proper padding (transparent)
size = 1024
square_emblem = Image.new("RGBA", (size, size), (0, 0, 0, 0))

# Scale emblem to fit ~85% of square
target_h = int(size * 0.86)
scale = target_h / eh
target_w = int(ew * scale)

if target_w > int(size * 0.88):
    target_w = int(size * 0.88)
    scale = target_w / ew
    target_h = int(eh * scale)

resized_emblem = emblem.resize((target_w, target_h), Image.Resampling.LANCZOS)
offset_x = (size - target_w) // 2
offset_y = (size - target_h) // 2
square_emblem.paste(resized_emblem, (offset_x, offset_y), resized_emblem)

# Save high-res master mark
square_emblem.save(os.path.join(out_dir, "bokengi-mark.png"), "PNG")
print("Generated bokengi-mark.png (1024x1024)")

# 3. Generate PNG favicons
for sz in [16, 32, 48, 64, 128, 192, 256, 512]:
    fav = square_emblem.resize((sz, sz), Image.Resampling.LANCZOS)
    if sz <= 32:
        # Enhance contrast/sharpness slightly for ultra-small tabs
        enhancer = ImageEnhance.Sharpness(fav)
        fav = enhancer.enhance(1.5)
    
    if sz in [16, 32]:
        fav.save(os.path.join(out_dir, f"favicon-{sz}x{sz}.png"), "PNG")
        print(f"Generated favicon-{sz}x{sz}.png")
    if sz == 192:
        fav.save(os.path.join(out_dir, "android-chrome-192x192.png"), "PNG")
        print("Generated android-chrome-192x192.png")
    if sz == 512:
        fav.save(os.path.join(out_dir, "android-chrome-512x512.png"), "PNG")
        print("Generated android-chrome-512x512.png")

# 4. Generate multi-size favicon.ico (16, 32, 48)
ico_sizes = [(16, 16), (32, 32), (48, 48)]
square_emblem.save(
    os.path.join(out_dir, "favicon.ico"),
    format="ICO",
    sizes=ico_sizes
)
print("Generated multi-resolution favicon.ico")

# 5. Generate apple-touch-icon (180x180) with luxury deep corporate navy background
apple_size = 180
apple_bg = Image.new("RGBA", (apple_size, apple_size), (0, 18, 77, 255)) # #00124D
# Add subtle radial glow / gradient
glow = Image.new("RGBA", (apple_size, apple_size), (0, 0, 0, 0))
draw = ImageDraw.Draw(glow)
for r in range(apple_size // 2, 0, -5):
    alpha = int(25 * (1 - r / (apple_size // 2)))
    draw.ellipse(
        (apple_size//2 - r, apple_size//2 - r, apple_size//2 + r, apple_size//2 + r),
        fill=(0, 51, 160, alpha)
    )
apple_bg = Image.alpha_composite(apple_bg, glow)

# Scale emblem for apple icon
apple_emblem_h = int(apple_size * 0.72)
apple_scale = apple_emblem_h / eh
apple_emblem_w = int(ew * apple_scale)
resized_apple_emblem = emblem.resize((apple_emblem_w, apple_emblem_h), Image.Resampling.LANCZOS)

ax = (apple_size - apple_emblem_w) // 2
ay = (apple_size - apple_emblem_h) // 2
apple_bg.paste(resized_apple_emblem, (ax, ay), resized_apple_emblem)
apple_bg.save(os.path.join(out_dir, "apple-touch-icon.png"), "PNG")
print("Generated apple-touch-icon.png (180x180)")

# 6. Generate full logo with transparent background
full_bbox = img.getbbox()
full_logo = img.crop(full_bbox)
full_logo.save(os.path.join(out_dir, "bokengi-logo.png"), "PNG")
print(f"Generated bokengi-logo.png ({full_logo.size[0]}x{full_logo.size[1]})")

# 7. Generate Social OpenGraph Image (1200x630)
og_w, og_h = 1200, 630
og = Image.new("RGBA", (og_w, og_h), (0, 18, 77, 255)) # Navy #00124D

# Add glowing accent background element
og_glow = Image.new("RGBA", (og_w, og_h), (0, 0, 0, 0))
og_draw = ImageDraw.Draw(og_glow)
og_draw.ellipse((-100, -100, 700, 700), fill=(0, 51, 160, 45))
og_draw.ellipse((800, 200, 1400, 800), fill=(14, 165, 233, 25))
og = Image.alpha_composite(og, og_glow)

# Place full logo centered in OG image
target_og_h = 320
og_scale = target_og_h / full_logo.size[1]
target_og_w = int(full_logo.size[0] * og_scale)
resized_full = full_logo.resize((target_og_w, target_og_h), Image.Resampling.LANCZOS)

og_x = (og_w - target_og_w) // 2
og_y = (og_h - target_og_h) // 2 - 20
og.paste(resized_full, (og_x, og_y), resized_full)
og.save(os.path.join(out_dir, "og-image.png"), "PNG")
print("Generated og-image.png (1200x630)")
