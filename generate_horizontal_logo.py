from PIL import Image
import os

out_dir = r"E:\01_Projets\Actifs\kal-cooperation\bokengi-group\public"
img = Image.open(r"C:\Users\Provi\Downloads\Image Codex.png").convert("RGBA")

# 1. Emblem
emblem_bbox = img.crop((0, 0, img.width, 640)).getbbox()
emblem = img.crop(emblem_bbox)
ew, eh = emblem.size

# 2. Text
text_raw = img.crop((0, 640, img.width, img.height))
tb = text_raw.getbbox()
text = img.crop((tb[0], 640 + tb[1], tb[2], 640 + tb[3]))
tw, th = text.size

target_h = 240
scale_e = target_h / eh
nw_e = int(ew * scale_e)
res_emblem = emblem.resize((nw_e, target_h), Image.Resampling.LANCZOS)

text_h = int(target_h * 0.60)
scale_t = text_h / th
nw_t = int(tw * scale_t)
res_text = text.resize((nw_t, text_h), Image.Resampling.LANCZOS)

gap = 36
total_w = nw_e + gap + nw_t
total_h = target_h

# Light version
logo_light = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
logo_light.paste(res_emblem, (0, 0), res_emblem)
text_y = (target_h - text_h) // 2
logo_light.paste(res_text, (nw_e + gap, text_y), res_text)
logo_light.save(os.path.join(out_dir, "bokengi-logo-horizontal.png"), "PNG")

# Dark version: turn all navy letters to crisp pure white #FFFFFF while keeping blue accents intact
text_dark = res_text.copy()
pix = text_dark.load()
for y in range(text_dark.height):
    for x in range(text_dark.width):
        r, g, b, a = pix[x, y]
        if a > 15:
            # Check if this is the electric blue accent
            is_blue = (b > 140 and b > r + 40 and b > g + 15)
            if not is_blue:
                # Set to crisp white with original antialiased alpha
                pix[x, y] = (255, 255, 255, a)
            else:
                # Enhance blue vibrancy slightly for dark mode
                pix[x, y] = (0, 140, 255, a)

logo_dark = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
logo_dark.paste(res_emblem, (0, 0), res_emblem)
logo_dark.paste(text_dark, (nw_e + gap, text_y), text_dark)
logo_dark.save(os.path.join(out_dir, "bokengi-logo-horizontal-dark.png"), "PNG")
print("Refined horizontal logos saved!")
