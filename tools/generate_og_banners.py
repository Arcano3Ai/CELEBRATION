import os
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

def create_card(base_img_path, output_filename, badge_text, title_text, sub_text, location_text):
    width = 1200
    height = 630
    
    img = Image.open(base_img_path).convert("RGBA")
    
    # Crop & resize to 1200x630
    target_ratio = width / height
    orig_w, orig_h = img.size
    orig_ratio = orig_w / orig_h
    
    if orig_ratio > target_ratio:
        new_w = int(orig_h * target_ratio)
        left = (orig_w - new_w) // 2
        img = img.crop((left, 0, left + new_w, orig_h))
    else:
        new_h = int(orig_w / target_ratio)
        top = int((orig_h - new_h) * 0.22)
        img = img.crop((0, top, orig_w, top + new_h))
        
    img = img.resize((width, height), Image.Resampling.LANCZOS)
    img = ImageEnhance.Contrast(img).enhance(1.08)
    
    # Gradient overlay
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw_ov = ImageDraw.Draw(overlay)
    
    for y in range(height):
        progress = y / height
        if progress < 0.30:
            alpha = int(40 + (progress / 0.30) * 45)
        elif progress < 0.58:
            alpha = int(85 + ((progress - 0.30) / 0.28) * 85)
        else:
            alpha = int(170 + ((progress - 0.58) / 0.42) * 78)
            
        draw_ov.line([(0, y), (width, y)], fill=(18, 16, 14, min(alpha, 245)))
        
    final_img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(final_img)
    
    # Gold borders
    gold_color = (197, 160, 89, 230)
    gold_bright = (229, 211, 179, 255)
    champagne = (244, 241, 234, 255)
    
    margin = 32
    draw.rectangle([margin, margin, width - margin, height - margin], outline=gold_color, width=1)
    corner_len = 24
    draw.line([(margin - 8, margin - 8), (margin - 8 + corner_len, margin - 8)], fill=gold_bright, width=2)
    draw.line([(margin - 8, margin - 8), (margin - 8, margin - 8 + corner_len)], fill=gold_bright, width=2)
    draw.line([(width - margin + 8, margin - 8), (width - margin + 8 - corner_len, margin - 8)], fill=gold_bright, width=2)
    draw.line([(width - margin + 8, margin - 8), (width - margin + 8, margin - 8 + corner_len)], fill=gold_bright, width=2)
    draw.line([(margin - 8, height - margin + 8), (margin - 8 + corner_len, height - margin + 8)], fill=gold_bright, width=2)
    draw.line([(margin - 8, height - margin + 8), (margin - 8, height - margin + 8 - corner_len)], fill=gold_bright, width=2)
    draw.line([(width - margin + 8, height - margin + 8), (width - margin + 8 - corner_len, height - margin + 8)], fill=gold_bright, width=2)
    draw.line([(width - margin + 8, height - margin + 8), (width - margin + 8, height - margin + 8 - corner_len)], fill=gold_bright, width=2)

    # Fonts
    try:
        font_brand = ImageFont.truetype("C:/Windows/Fonts/georgiab.ttf", 60)
        font_sub = ImageFont.truetype("C:/Windows/Fonts/georgia.ttf", 26)
        font_tag = ImageFont.truetype("C:/Windows/Fonts/georgiaz.ttf", 21)
        font_badge = ImageFont.truetype("C:/Windows/Fonts/cambriab.ttf", 16)
    except Exception:
        font_brand = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_tag = ImageFont.load_default()
        font_badge = ImageFont.load_default()

    # Top Badge
    bbox_badge = draw.textbbox((0, 0), badge_text, font=font_badge)
    w_badge = bbox_badge[2] - bbox_badge[0]
    draw.text(((width - w_badge) // 2, 58), badge_text, font=font_badge, fill=gold_bright)
    
    # Title
    bbox_title = draw.textbbox((0, 0), title_text, font=font_brand)
    w_title = bbox_title[2] - bbox_title[0]
    draw.text(((width - w_title) // 2 + 2, 395 + 2), title_text, font=font_brand, fill=(0, 0, 0, 210))
    draw.text(((width - w_title) // 2, 395), title_text, font=font_brand, fill=champagne)
    
    # Sub
    bbox_sub = draw.textbbox((0, 0), sub_text, font=font_sub)
    w_sub = bbox_sub[2] - bbox_sub[0]
    draw.text(((width - w_sub) // 2 + 1, 480 + 1), sub_text, font=font_sub, fill=(0, 0, 0, 190))
    draw.text(((width - w_sub) // 2, 480), sub_text, font=font_sub, fill=gold_bright)
    
    # Tag
    bbox_tag = draw.textbbox((0, 0), location_text, font=font_tag)
    w_tag = bbox_tag[2] - bbox_tag[0]
    draw.text(((width - w_tag) // 2, 532), location_text, font=font_tag, fill=gold_color)

    # Save
    out_path = os.path.join("assets/images", output_filename)
    rgb = final_img.convert("RGB")
    rgb.save(out_path, "JPEG", quality=86, progressive=True, optimize=True)
    size_kb = os.path.getsize(out_path) / 1024
    print(f"[✓] Guardado {out_path} ({size_kb:.1f} KB)")

def main():
    # 1. Main Website Banner
    create_card(
        base_img_path="assets/images/hero_wedding_couple.jpg",
        output_filename="og_share_banner.jpg",
        badge_text="✦   A T E L I E R   D I G I T A L   D E   B O D A S   ✦",
        title_text="C E L E B R A T I O N",
        sub_text="Sitios Web de Alta Costura  ·  Smart RSVP  ·  Tarjetas NFC",
        location_text="San Pedro Garza García  ·  thecelebration.com.mx"
    )
    # Overwrite legacy name for instant backward compatibility
    create_card(
        base_img_path="assets/images/hero_wedding_couple.jpg",
        output_filename="og_share_cover.jpg",
        badge_text="✦   A T E L I E R   D I G I T A L   D E   B O D A S   ✦",
        title_text="C E L E B R A T I O N",
        sub_text="Sitios Web de Alta Costura  ·  Smart RSVP  ·  Tarjetas NFC",
        location_text="San Pedro Garza García  ·  thecelebration.com.mx"
    )

    # 2. Romántico (Valentina & Mateo)
    create_card(
        base_img_path="assets/images/estilo_romantico.jpg",
        output_filename="og_demo_romantico.jpg",
        badge_text="✦   N U E S T R A   B O D A   ·   # V A L - 2 0 2 6   ✦",
        title_text="Valentina  &  Mateo",
        sub_text="Invitación Digital de Boda  ·  Smart RSVP  ·  Itinerario GPS",
        location_text="San Miguel de Allende  ·  Noviembre 14, 2026"
    )

    # 3. Clásico (Isabella & Santiago)
    create_card(
        base_img_path="assets/images/estilo_clasico.jpg",
        output_filename="og_demo_clasico.jpg",
        badge_text="✦   G A L A   &   B L A C K   T I E   ·   # I S A - 2 0 2 6   ✦",
        title_text="Isabella  &  Santiago",
        sub_text="Invitación Privada de Gala  ·  Código de Vestimenta  ·  RSVP",
        location_text="San Pedro Garza García  ·  Octubre 24, 2026"
    )

    # 4. Editorial (Camila & Sebastián)
    create_card(
        base_img_path="assets/images/estilo_editorial.jpg",
        output_filename="og_demo_editorial.jpg",
        badge_text="✦   V O G U E   W E D D I N G S   ·   # C A M - 2 0 2 6   ✦",
        title_text="Camila  &  Sebastián",
        sub_text="Celebración de Destino  ·  Pase VIP  ·  Live Event Stream",
        location_text="Los Cabos, BCS  ·  Diciembre 12, 2026"
    )

if __name__ == "__main__":
    main()
