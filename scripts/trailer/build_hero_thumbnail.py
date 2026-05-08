"""Composite the trailer hero thumbnail entirely from existing v2 portraits.

Layout (16:9, 1920x1080):
  Tier 1 (front, sharp)  : Dan, center
  Tier 2 (flanks)         : Hermes (L), David (R), slightly behind Dan
  Tier 3 (mid distance)   : the four Droplets (Memo, Dexter, Nano, Sienna)
  Tier 4 (deep silhouettes): the rest of the team, fogged + dark

Outputs two PNGs into public/series/trailer/:
  hero-00-thumbnail.png       — the clean hero
  hero-00-thumbnail-fog.png   — heavy fog pass for the first frame
"""

from PIL import Image, ImageFilter, ImageEnhance, ImageDraw, ImageOps
import os

CHAR_DIR = "/home/user/DansLab/public/series/characters/"
OUT_DIR = "/home/user/DansLab/public/series/trailer/"
W, H = 1920, 1080


def crop_portrait(im, ratio_w=0.62, ratio_h=1.0, top_bias=0.05):
    """Crop a vertical slice from a 1:1 portrait so the character fills more of the frame."""
    w, h = im.size
    cw = int(w * ratio_w)
    ch = int(h * ratio_h)
    x0 = (w - cw) // 2
    y0 = max(0, int(h * top_bias))
    y1 = min(h, y0 + ch)
    return im.crop((x0, y0, x0 + cw, y1))


def bottom_fade_mask(size, feather_bottom=0.55, feather_sides=0.10):
    """Solid at top, fading to transparent at bottom. Soft side feather."""
    w, h = size
    mask = Image.new("L", (w, h), 255)
    px = mask.load()
    fb = int(h * (1 - feather_bottom))
    fs = int(w * feather_sides)
    for y in range(h):
        if y >= fb:
            t = (y - fb) / max(1, h - fb)
            v_top = int(255 * (1 - t * t))
        else:
            v_top = 255
        for x in range(w):
            v = v_top
            if x < fs:
                v = int(v * (x / fs))
            elif x > w - fs:
                v = int(v * ((w - x) / fs))
            px[x, y] = max(0, min(255, v))
    return mask.filter(ImageFilter.GaussianBlur(8))


def prep_character(name, target_h, blur=0, darken=1.0, tint=None,
                   crop_w=0.62, fade_b=0.45, fade_s=0.10):
    fp = CHAR_DIR + name + "-v2.jpg"
    im = Image.open(fp).convert("RGB")
    im = crop_portrait(im, ratio_w=crop_w, ratio_h=1.0, top_bias=0.02)
    w0, h0 = im.size
    scale = target_h / h0
    nw, nh = max(1, int(w0 * scale)), max(1, int(h0 * scale))
    im = im.resize((nw, nh), Image.LANCZOS)

    if blur:
        im = im.filter(ImageFilter.GaussianBlur(blur))
    if darken < 1.0:
        im = ImageEnhance.Brightness(im).enhance(darken)
    if tint:
        tlayer = Image.new("RGB", im.size, tint)
        im = Image.blend(im, tlayer, 0.45)

    rgba = im.convert("RGBA")
    mask = bottom_fade_mask((nw, nh), feather_bottom=fade_b, feather_sides=fade_s)
    rgba.putalpha(mask)
    return rgba


def make_background():
    # Vertical gradient: navy haze at top, near-black at bottom
    bg = Image.new("RGB", (W, H), (4, 6, 12))
    px = bg.load()
    for y in range(H):
        t = y / H
        r = int(10 + (1 - t) * 18)
        g = int(14 + (1 - t) * 28)
        b = int(26 + (1 - t) * 46)
        for x in range(W):
            # subtle horizontal vignette toward center light
            cx_dist = abs(x - W / 2) / (W / 2)
            falloff = 1 - 0.25 * cx_dist
            px[x, y] = (int(r * falloff), int(g * falloff), int(b * falloff))
    return bg


def add_fog_band(canvas, center_y_frac=0.55, spread_px=240, alpha_peak=140):
    fog = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    fd = ImageDraw.Draw(fog)
    cy = int(H * center_y_frac)
    for y in range(H):
        t = max(0, 1 - abs(y - cy) / spread_px)
        a = int(t * alpha_peak)
        if a > 0:
            fd.line([(0, y), (W, y)], fill=(180, 200, 220, a))
    fog = fog.filter(ImageFilter.GaussianBlur(60))
    canvas.alpha_composite(fog)
    return canvas


def add_vignette(canvas, strength=0.85):
    vig = Image.new("L", (W, H), 0)
    vd = ImageDraw.Draw(vig)
    vd.ellipse((-W // 5, -H // 5, W + W // 5, H + H // 5), fill=255)
    vig = vig.filter(ImageFilter.GaussianBlur(220))
    black = Image.new("RGB", (W, H), (0, 0, 0))
    rgb = canvas.convert("RGB")
    blended = Image.composite(rgb, black, vig)
    return blended


def add_grain(im, amount=8):
    import random
    g = Image.new("L", im.size, 128)
    px = g.load()
    for y in range(im.size[1]):
        for x in range(im.size[0]):
            px[x, y] = 128 + random.randint(-amount, amount)
    grain_rgb = Image.merge("RGB", (g, g, g))
    return Image.blend(im, grain_rgb, 0.04)


def paste_at(canvas, layer, cx_frac, cy_frac):
    x = int(W * cx_frac) - layer.size[0] // 2
    y = int(H * cy_frac) - layer.size[1] // 2
    canvas.alpha_composite(layer, (x, y))


def build():
    canvas = make_background().convert("RGBA")

    # ---- Tier 4: deep back row, fogged silhouettes ----
    # Heads at y~0.20 so they peek above all closer rows.
    back_chars = [
        ("gsd",        0.05, 0.30),
        ("doctor",     0.15, 0.28),
        ("monitor",    0.27, 0.26),
        ("vector",     0.39, 0.24),
        ("autoforge",  0.61, 0.24),
        ("model",      0.73, 0.26),
        ("finance",    0.85, 0.28),
        ("discovery",  0.95, 0.30),
    ]
    back_h = int(H * 0.45)
    for name, cx, cy in back_chars:
        layer = prep_character(
            name, target_h=back_h,
            blur=14, darken=0.34, tint=(22, 32, 52),
            crop_w=0.46, fade_b=0.55, fade_s=0.24,
        )
        paste_at(canvas, layer, cx, cy)

    # mid-distance fog bank
    canvas = add_fog_band(canvas, center_y_frac=0.36, spread_px=210, alpha_peak=140)

    # ---- Tier 3: the four Droplets — outer pairs of the front-row lineup ----
    droplets = [
        ("memo",   0.09, 0.56, 0.62),
        ("dexter", 0.22, 0.55, 0.62),
        ("sienna", 0.78, 0.55, 0.62),
        ("nano",   0.91, 0.56, 0.62),
    ]
    for name, cx, cy, h_frac in droplets:
        layer = prep_character(
            name, target_h=int(H * h_frac),
            blur=1, darken=0.78, tint=(30, 40, 60),
            crop_w=0.40, fade_b=0.36, fade_s=0.16,
        )
        paste_at(canvas, layer, cx, cy)

    # haze between droplets and front row
    canvas = add_fog_band(canvas, center_y_frac=0.55, spread_px=150, alpha_peak=70)

    # ---- Tier 2: Hermes (L) + David (R) flanking Dan ----
    flank_h = int(H * 0.74)
    for name, cx, cy in [("hermes", 0.36, 0.57), ("david", 0.64, 0.57)]:
        layer = prep_character(
            name, target_h=flank_h,
            blur=0, darken=0.92, tint=None,
            crop_w=0.40, fade_b=0.30, fade_s=0.14,
        )
        paste_at(canvas, layer, cx, cy)

    # warm amber radial behind Dan
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    cx_g, cy_g = int(W * 0.50), int(H * 0.55)
    for r in range(460, 0, -10):
        a = int(70 * (1 - r / 460) ** 2)
        gd.ellipse((cx_g - r, cy_g - r, cx_g + r, cy_g + r),
                   fill=(245, 158, 11, a))
    glow = glow.filter(ImageFilter.GaussianBlur(90))
    canvas.alpha_composite(glow)

    # ---- Tier 1: Dan, hero, sharp ----
    dan_h = int(H * 0.92)
    dan_layer = prep_character(
        "dan", target_h=dan_h,
        blur=0, darken=1.08, tint=None,
        crop_w=0.42, fade_b=0.28, fade_s=0.12,
    )
    paste_at(canvas, dan_layer, 0.50, 0.55)

    # vignette + grain
    final = add_vignette(canvas, strength=0.85)
    final = add_grain(final, amount=8)

    out = OUT_DIR + "hero-00-thumbnail.png"
    final.save(out, "PNG")
    print("Saved:", out, final.size)

    # Heavy-fog variant for the "lost in fog" opening frame
    fog_overlay = Image.new("RGBA", (W, H), (210, 220, 235, 170))
    f2 = final.convert("RGBA")
    f2.alpha_composite(fog_overlay)
    f2 = f2.filter(ImageFilter.GaussianBlur(6))
    f2 = ImageEnhance.Brightness(f2.convert("RGB")).enhance(0.85)
    out2 = OUT_DIR + "hero-00-thumbnail-fog.png"
    f2.save(out2, "PNG")
    print("Saved:", out2, f2.size)


if __name__ == "__main__":
    build()
