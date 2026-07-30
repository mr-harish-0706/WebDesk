import os
import math
import subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Create required directories
directories = [
    'build/icons',
    'public',
    'assets/branding',
    'build/installer'
]

for d in directories:
    os.makedirs(d, exist_ok=True)

print("Generating 1024x1024 Master Logo with Transparency...")

# Master dimensions
size = 1024
master_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))

# Create drawing context
draw = ImageDraw.Draw(master_img)

# 1. Base Outer Shield / Rounded Square Container (Slate 900 gradient emulation)
bg_card = Image.new('RGBA', (size, size), (0, 0, 0, 0))
bg_draw = ImageDraw.Draw(bg_card)

margin = 64
corner_radius = 200

# Draw background rounded rect with dark slate blue fill
bg_draw.rounded_rectangle(
    [margin, margin, size - margin, size - margin],
    radius=corner_radius,
    fill=(15, 23, 42, 255),
    outline=(255, 255, 255, 35),
    width=8
)

# Outer Glow Ring
glow_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow_img)
glow_draw.rounded_rectangle(
    [margin - 16, margin - 16, size - margin + 16, size - margin + 16],
    radius=corner_radius + 16,
    outline=(59, 130, 246, 120),
    width=16
)
glow_img = glow_img.filter(ImageFilter.GaussianBlur(16))

# Combine glow and background card
master_img = Image.alpha_composite(glow_img, bg_card)
draw = ImageDraw.Draw(master_img)

# 2. Inner Icon Card (Blue-Indigo-Purple Gradient Shield)
icon_card_size = 560
icon_card_offset = (size - icon_card_size) // 2
icon_radius = 120

# Create gradient overlay for inner shield
gradient_img = Image.new('RGBA', (icon_card_size, icon_card_size), (0, 0, 0, 0))
grad_draw = ImageDraw.Draw(gradient_img)

for y in range(icon_card_size):
    # Interpolate from Electric Blue (59, 130, 246) to Purple Glow (139, 92, 246)
    ratio = y / float(icon_card_size)
    r = int(59 + (139 - 59) * ratio)
    g = int(130 + (92 - 130) * ratio)
    b = int(246 + (246 - 246) * ratio)
    grad_draw.line([(0, y), (icon_card_size, y)], fill=(r, g, b, 255))

# Create rounded mask for shield
mask_img = Image.new('L', (icon_card_size, icon_card_size), 0)
mask_draw = ImageDraw.Draw(mask_img)
mask_draw.rounded_rectangle([0, 0, icon_card_size, icon_card_size], radius=icon_radius, fill=255)

# Composite gradient with rounded mask
shield_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
shield_img.paste(gradient_img, (icon_card_offset, icon_card_offset), mask_img)

master_img = Image.alpha_composite(master_img, shield_img)
draw = ImageDraw.Draw(master_img)

# 3. WebDesk Symbol Mark (White Intersecting Grid & Globe Lines)
cx, cy = size // 2, size // 2
grid_half = 160
stroke_width = 24

# Outer Square Frame
draw.rounded_rectangle(
    [cx - grid_half, cy - grid_half, cx + grid_half, cy + grid_half],
    radius=48,
    outline=(255, 255, 255, 255),
    width=stroke_width
)

# Horizontal & Vertical Dividing Lines
draw.line([(cx - grid_half, cy), (cx + grid_half, cy)], fill=(255, 255, 255, 255), width=stroke_width - 4)
draw.line([(cx, cy - grid_half), (cx, cy + grid_half)], fill=(255, 255, 255, 255), width=stroke_width - 4)

# Central Globe Circle
circle_radius = 80
draw.ellipse(
    [cx - circle_radius, cy - circle_radius, cx + circle_radius, cy + circle_radius],
    outline=(255, 255, 255, 255),
    width=stroke_width - 4
)

# Sparkles Highlights
sparkle_color = (96, 165, 250, 255)
draw.ellipse([cx + 260, cy - 260, cx + 290, cy - 230], fill=sparkle_color)
draw.ellipse([cx - 270, cy + 240, cx - 245, cy + 265], fill=(167, 139, 250, 255))

# Save 1024x1024 Master Transparent Logo
master_transparent_path = 'assets/branding/logo-transparent.png'
master_img.save(master_transparent_path, 'PNG')
print(f"Saved master transparent logo: {master_transparent_path}")

# Save build/icons/icon.png (1024x1024 Master)
icon_master_path = 'build/icons/icon.png'
master_img.save(icon_master_path, 'PNG')
print(f"Saved master icon: {icon_master_path}")

# Save logo-dark.png (With Slate 950 dark background)
dark_bg = Image.new('RGBA', (size, size), (15, 23, 42, 255))
logo_dark = Image.alpha_composite(dark_bg, master_img)
logo_dark.save('assets/branding/logo-dark.png', 'PNG')
print("Saved assets/branding/logo-dark.png")

# Save logo-light.png (With Light Slate background)
light_bg = Image.new('RGBA', (size, size), (248, 250, 252, 255))
logo_light = Image.alpha_composite(light_bg, master_img)
logo_light.save('assets/branding/logo-light.png', 'PNG')
print("Saved assets/branding/logo-light.png")

# 4. Generate Linux Icons in build/icons/
png_sizes = [16, 24, 32, 48, 64, 96, 128, 256, 512, 1024]
for s in png_sizes:
    resized = master_img.resize((s, s), Image.Resampling.LANCZOS)
    out_path = f'build/icons/{s}x{s}.png'
    resized.save(out_path, 'PNG')
    print(f"Generated Linux Icon: {out_path}")

# 5. Generate Favicons in public/
fav_sizes = [(16, 'public/favicon-16.png'), (32, 'public/favicon-32.png'), (48, 'public/favicon-48.png')]
for s, p in fav_sizes:
    resized = master_img.resize((s, s), Image.Resampling.LANCZOS)
    resized.save(p, 'PNG')
    print(f"Generated Favicon PNG: {p}")

# Save public/favicon.ico containing 16, 32, 48
fav_16 = master_img.resize((16, 16), Image.Resampling.LANCZOS)
fav_32 = master_img.resize((32, 32), Image.Resampling.LANCZOS)
fav_48 = master_img.resize((48, 48), Image.Resampling.LANCZOS)
fav_16.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)], append_images=[fav_32, fav_48])
print("Generated public/favicon.ico")

# 6. Generate GitHub Social Banner (1280x640)
banner_w, banner_h = 1280, 640
banner = Image.new('RGBA', (banner_w, banner_h), (15, 23, 42, 255))
banner_draw = ImageDraw.Draw(banner)

# Scale logo for social banner
logo_scaled = master_img.resize((360, 360), Image.Resampling.LANCZOS)
banner.paste(logo_scaled, (120, (banner_h - 360) // 2), logo_scaled)

banner.save('assets/branding/social-banner.png', 'PNG')
print("Generated assets/branding/social-banner.png")

# 7. Generate Installer Assets (build/installer/)
# banner.png (150x57)
installer_banner = Image.new('RGBA', (150, 57), (30, 41, 59, 255))
logo_mini = master_img.resize((45, 45), Image.Resampling.LANCZOS)
installer_banner.paste(logo_mini, (6, 6), logo_mini)
installer_banner.save('build/installer/banner.png', 'PNG')
print("Generated build/installer/banner.png")

# header.png (150x57)
installer_banner.save('build/installer/header.png', 'PNG')
print("Generated build/installer/header.png")

# background.png (500x314)
installer_bg = Image.new('RGBA', (500, 314), (15, 23, 42, 255))
logo_bg = master_img.resize((180, 180), Image.Resampling.LANCZOS)
installer_bg.paste(logo_bg, (160, 67), logo_bg)
installer_bg.save('build/installer/background.png', 'PNG')
print("Generated build/installer/background.png")

# welcome.png (164x314)
welcome_bg = Image.new('RGBA', (164, 314), (30, 41, 59, 255))
logo_welcome = master_img.resize((120, 120), Image.Resampling.LANCZOS)
welcome_bg.paste(logo_welcome, (22, 97), logo_welcome)
welcome_bg.save('build/installer/welcome.png', 'PNG')
print("Generated build/installer/welcome.png")

# 8. Generate build/icons/icon.ico and build/icons/icon.icns using png2icons CLI
print("\nGenerating icon.ico and icon.icns via png2icons...")
try:
    cmd_ico = ["npx", "png2icons", icon_master_path, "build/icons/icon", "-icop", "-bc"]
    subprocess.run(cmd_ico, check=True)
    print("Generated build/icons/icon.ico via png2icons (with embedded PNG sizes 16,20,24,32,40,48,64,128,256)")
except Exception as e:
    print("Falling back to Pillow for icon.ico generation:", e)
    ico_sizes = [(16,16), (20,20), (24,24), (32,32), (40,40), (48,48), (64,64), (128,128), (256,256)]
    master_img.save('build/icons/icon.ico', format='ICO', sizes=ico_sizes)

try:
    cmd_icns = ["npx", "png2icons", icon_master_path, "build/icons/icon", "-icns", "-bc"]
    subprocess.run(cmd_icns, check=True)
    print("Generated build/icons/icon.icns via png2icons")
except Exception as e:
    print("Error generating ICNS:", e)

print("\nAll branding and desktop icon assets successfully generated!")
