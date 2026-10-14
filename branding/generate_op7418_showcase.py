#!/usr/bin/env python3
"""Generate 6 SVG logo variants and interactive showcase page
following the op7418/logo-generator-skill workflow and templates.
"""

import os
import subprocess
import shutil

OUTPUT_DIR = "/Users/kiwi/Desktop/Developer/Antigravity/Todo-List/branding/op7418"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# -------------------------------------------------------------
# 6 SVG VARIANTS ON viewBox="0 0 100 100" USING currentColor
# -------------------------------------------------------------

VARIANT_1_SVG = """<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Floating Heart -->
  <path d="M 50 18 C 50 13, 44 10, 40 13 C 36 16, 37 22, 42 27 L 50 34 L 58 27 C 63 22, 64 16, 60 13 C 56 10, 50 13, 50 18 Z" fill="currentColor"/>
  <!-- Left Chubby Bird -->
  <circle cx="38" cy="56" r="18" fill="currentColor"/>
  <circle cx="34" cy="52" r="2.5" fill="#FAFAFA"/>
  <path d="M 22 62 L 13 53" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>
  <polygon points="48,53 52,55.5 48,58" fill="currentColor"/>
  <!-- Right Chubby Bird & Check Wing -->
  <circle cx="62" cy="56" r="19" fill="currentColor"/>
  <circle cx="66" cy="52" r="2.5" fill="#FAFAFA"/>
  <path d="M 59 62 L 87 34" stroke="currentColor" stroke-width="5.5" stroke-linecap="round"/>
  <polygon points="54,53 50,55.5 54,58" fill="currentColor"/>
  <!-- Perch Bar -->
  <rect x="18" y="77" width="64" height="5" rx="2.5" fill="currentColor"/>
</svg>"""

VARIANT_2_SVG = """<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Floating mini heart -->
  <path d="M 50 16 C 50 12, 46 10, 43 12 C 40 14, 40 18, 44 22 L 50 27 L 56 22 C 60 18, 60 14, 57 12 C 54 10, 50 12, 50 16 Z" fill="currentColor"/>
  <!-- Heart contour with integrated kissing birds & check wing -->
  <path fill-rule="evenodd" clip-rule="evenodd" d="
    M 50 40
    C 44 30, 28 24, 18 35
    C 7 46, 11 66, 30 80
    L 50 92
    L 70 80
    C 75 76, 78 70, 80 64
    L 90 54
    C 92 52, 92 48, 90 46
    C 88 44, 84 44, 82 46
    L 73 55
    C 73 38, 59 30, 50 40
    Z
    M 31 48 A 3 3 0 1 0 31.1 48 Z
    M 66 48 A 3 3 0 1 0 66.1 48 Z
    M 50 51 L 47 54 L 53 54 Z
  " fill="currentColor"/>
</svg>"""

VARIANT_3_SVG = """<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Floating Heart -->
  <path d="M 50 16 C 50 11, 45 8, 41 11 C 37 14, 38 19, 42 24 L 50 30 L 58 24 C 62 19, 63 14, 59 11 C 55 8, 50 11, 50 16 Z" fill="currentColor"/>
  <!-- Left Bird Monoline -->
  <circle cx="37" cy="56" r="16.5" stroke="currentColor" stroke-width="3.5"/>
  <circle cx="34" cy="53" r="2.5" fill="currentColor"/>
  <path d="M 23 62 L 14 53" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
  <polygon points="47,53 51,55.5 47,58" fill="currentColor"/>
  <!-- Right Bird Monoline & Check Wing -->
  <circle cx="63" cy="56" r="17.5" stroke="currentColor" stroke-width="3.5"/>
  <circle cx="66" cy="53" r="2.5" fill="currentColor"/>
  <polygon points="55,53 51,55.5 55,58" fill="currentColor"/>
  <path d="M 58 61 L 88 31" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
  <!-- Perch Baseline -->
  <path d="M 18 78 L 82 78" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
</svg>"""

VARIANT_4_SVG = """<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Double Floating Hearts -->
  <path d="M 45 18 C 45 14, 41 11, 38 13 C 35 15, 35 19, 39 23 L 45 28 L 51 23 C 55 19, 55 15, 52 13 C 49 11, 45 14, 45 18 Z" fill="currentColor"/>
  <path d="M 58 14 C 58 11, 55 9, 53 10 C 51 11, 51 14, 54 17 L 58 21 L 62 17 C 65 14, 65 11, 63 10 C 61 9, 58 11, 58 14 Z" fill="currentColor"/>
  <!-- Left Chubby Pebble Chick -->
  <rect x="20" y="38" width="28" height="42" rx="14" fill="currentColor"/>
  <!-- Closed happy eye ^ -->
  <path d="M 29 52 Q 33 48 37 52" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round" fill="none"/>
  <!-- Right Chubby Pebble Chick -->
  <rect x="52" y="32" width="28" height="48" rx="14" fill="currentColor"/>
  <!-- Open eye -->
  <circle cx="66" cy="48" r="2.5" fill="#FAFAFA"/>
  <!-- Ascending High-Five Checkmark Across Both -->
  <path d="M 15 60 L 32 75 L 85 28" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 18 60 L 32 72 L 82 30" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>"""

VARIANT_5_SVG = """<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Floating Heart -->
  <path d="M 50 16 C 50 11, 44 8, 40 11 C 36 14, 37 20, 42 25 L 50 31 L 58 25 C 63 20, 64 14, 60 11 C 56 8, 50 11, 50 16 Z" fill="currentColor"/>
  <!-- Continuous Infinity Lovebird Ribbon (Looping 2-to-D & Check) -->
  <path d="
    M 24 58
    C 24 42, 42 38, 48 50
    C 52 58, 44 72, 28 80
    L 68 80
    C 80 80, 84 66, 84 56
    C 84 42, 70 38, 56 38
  " stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Wing check stroke shooting up -->
  <path d="M 58 64 L 86 36" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>
  <!-- Two bird eyes -->
  <circle cx="36" cy="50" r="2.5" fill="currentColor"/>
  <circle cx="68" cy="50" r="2.5" fill="currentColor"/>
</svg>"""

VARIANT_6_SVG = """<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Twin Lovebirds in Dual Flight: Harmonious Ascending Checks -->
  <!-- Floating Love Spark -->
  <path d="M 50 16 C 50 12, 46 9, 43 11 C 40 13, 40 17, 44 21 L 50 26 L 56 21 C 60 17, 60 13, 57 11 C 54 9, 50 12, 50 16 Z" fill="currentColor"/>
  <!-- Bird 1 (Alex - Left Lower Flight) -->
  <circle cx="28" cy="56" r="12" fill="currentColor"/>
  <circle cx="28" cy="53" r="2" fill="#FAFAFA"/>
  <path d="M 18 68 L 32 78 L 62 48" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Bird 2 (Sam - Right Lead Flight) -->
  <circle cx="56" cy="38" r="13" fill="currentColor"/>
  <circle cx="57" cy="35" r="2" fill="#FAFAFA"/>
  <path d="M 44 50 L 58 60 L 88 30" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>"""

VARIANTS = [
    {
        "id": "variant-1",
        "title": "01 / THE KISSING CHECK",
        "subtitle": "DUAL SILHOUETTE · ASCENDING WING",
        "philosophy": "Two chubby companion birds perched side-by-side, beaks meeting in a sweet kiss. The right bird's wing sweeps into an energetic 45° checkmark, crowned by a floating heart.",
        "svg": VARIANT_1_SVG,
    },
    {
        "id": "variant-2",
        "title": "02 / HEART-CONTOUR LOVEBIRDS",
        "subtitle": "GESTALT SILHOUETTE · NEGATIVE SPACE",
        "philosophy": "A romantic heart silhouette revealing two kissing birds through negative space cutouts. The right wing extends gracefully outward as an ascending checkmark.",
        "svg": VARIANT_2_SVG,
    },
    {
        "id": "variant-3",
        "title": "03 / MONOLINE NESTLING DUO",
        "subtitle": "LINE SYSTEM · ARCHITECTURAL ARCS",
        "philosophy": "Constructed from continuous 3.5px monoline strokes with rounded caps. Precision geometric rings form the bird bodies, matching the app's clean ink border aesthetic.",
        "svg": VARIANT_3_SVG,
    },
    {
        "id": "variant-4",
        "title": "04 / PEBBLE CHICKS",
        "subtitle": "ORGANIC COMPANIONS · HIGH-FIVE CHECK",
        "philosophy": "Two chubby, lovable pebble-shaped chicks leaning in with happy smiling eyes, unified by an ascending checkmark that slices diagonally across both bodies.",
        "svg": VARIANT_4_SVG,
    },
    {
        "id": "variant-5",
        "title": "05 / INFINITY LOVEBIRDS",
        "subtitle": "CONTINUOUS RIBBON · STREAK SYMBOL",
        "philosophy": "A single continuous ribbon looping through both birds, merging the numeral '2' and the infinity symbol of endless partnership with a perky checkmark wing.",
        "svg": VARIANT_5_SVG,
    },
    {
        "id": "variant-6",
        "title": "06 / DUO FLIGHT",
        "subtitle": "PARALLEL CHECKS · SYNCHRONIZED MOMENTUM",
        "philosophy": "Two geometric birds in synchronized upward flight. Their streamlined bodies and wingtips trace dual ascending checkmarks, symbolizing shared progress.",
        "svg": VARIANT_6_SVG,
    },
]

# Write standalone SVGs
for idx, v in enumerate(VARIANTS, 1):
    svg_filename = f"variant-{idx}.svg"
    svg_path = os.path.join(OUTPUT_DIR, svg_filename)
    # Add standalone attributes
    standalone_svg = v["svg"].replace(
        '<svg viewBox="0 0 100 100" fill="none"',
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" fill="none" color="#000000"'
    )
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(standalone_svg)
    print(f"Wrote {svg_path}")

# Build Showcase HTML based on showcase_template.html
TEMPLATE_PATH = "/tmp/logo-generator-skill/assets/showcase_template.html"
with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
    template = f.read()

# Generate React Components for the 6 logos
components_code = []
logo_data_items = []

for idx, v in enumerate(VARIANTS, 1):
    comp_name = f"LogoVariant{idx}"
    # Convert SVG into JSX
    jsx_svg = v["svg"].replace("clip-rule", "clipRule") \
                      .replace("fill-rule", "fillRule") \
                      .replace("stroke-width", "strokeWidth") \
                      .replace("stroke-linecap", "strokeLinecap") \
                      .replace("stroke-linejoin", "strokeLinejoin")
    comp_def = f"""
        const {comp_name} = () => (
            {jsx_svg}
        );
    """
    components_code.append(comp_def)
    logo_data_items.append(f"""
        {{
            Component: {comp_name},
            title: "{v['title']}",
            subtitle: "{v['subtitle']}",
            philosophy: "{v['philosophy']}"
        }}
    """)

showcase_html = template.replace("{{PRODUCT_NAME}}", "2DO")
showcase_html = showcase_html.replace("{{TAGLINE}}", "COUPLE TASK HUB — 'THE LOVEBIRDS' LOGO EXPLORATION")
showcase_html = showcase_html.replace("{{YEAR}}", "2026")
showcase_html = showcase_html.replace("{{LOGO_COMPONENTS}}", "\n".join(components_code))
showcase_html = showcase_html.replace("{{LOGO_DATA}}", ",\n".join(logo_data_items))
showcase_html = showcase_html.replace("{{SHOWCASE_SECTION}}", "")

html_output_path = os.path.join(OUTPUT_DIR, "showcase.html")
with open(html_output_path, "w", encoding="utf-8") as f:
    f.write(showcase_html)
print(f"Wrote interactive showcase: {html_output_path}")

print("Done generating 6 variants and showcase page.")
