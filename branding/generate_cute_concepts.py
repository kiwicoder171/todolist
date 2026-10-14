#!/usr/bin/env python3
"""Generate 3 cute logo concepts for 2DO / Couple Task Hub.
Playful, lovable, character-driven yet geometrically crafted for 16px to 512px.
"""

import os
import math

def get_cute_wordmark(start_x=280):
    """Clean, friendly neo-brutalist wordmark for '2DO' and 'COUPLE TASK HUB'."""
    # Friendly, rounded geometric 2DO:
    # 2:
    glyph_2 = f"""
    <!-- 2 -->
    <path fill="#000000" fill-rule="evenodd" d="
      M {start_x} 84
      C {start_x} 66, {start_x + 14} 54, {start_x + 32} 54
      C {start_x + 50} 54, {start_x + 64} 66, {start_x + 64} 84
      C {start_x + 64} 98, {start_x + 54} 110, {start_x + 38} 122
      L {start_x + 20} 136
      L {start_x + 64} 136
      L {start_x + 64} 152
      L {start_x} 152
      L {start_x} 138
      L {start_x + 28} 114
      C {start_x + 40} 104, {start_x + 46} 94, {start_x + 46} 84
      C {start_x + 46} 75, {start_x + 40} 68, {start_x + 32} 68
      C {start_x + 24} 68, {start_x + 18} 75, {start_x + 18} 84
      Z
    "/>
    """

    # D:
    d_x = start_x + 82
    glyph_d = f"""
    <!-- D -->
    <path fill="#000000" fill-rule="evenodd" d="
      M {d_x} 54
      L {d_x + 36} 54
      C {d_x + 58} 54, {d_x + 72} 70, {d_x + 72} 103
      C {d_x + 72} 136, {d_x + 58} 152, {d_x + 36} 152
      L {d_x} 152
      Z
      M {d_x + 18} 70
      L {d_x + 34} 70
      C {d_x + 46} 70, {d_x + 54} 80, {d_x + 54} 103
      C {d_x + 54} 126, {d_x + 46} 136, {d_x + 34} 136
      L {d_x + 18} 136
      Z
    "/>
    """

    # O with cute subtle heart or circle:
    o_x = start_x + 174
    glyph_o = f"""
    <!-- O -->
    <path fill="#000000" fill-rule="evenodd" d="
      M {o_x + 36} 54
      C {o_x + 58} 54, {o_x + 72} 70, {o_x + 72} 103
      C {o_x + 72} 136, {o_x + 58} 152, {o_x + 36} 152
      C {o_x + 14} 152, {o_x} 136, {o_x} 103
      C {o_x} 70, {o_x + 14} 54, {o_x + 36} 54
      Z
      M {o_x + 36} 70
      C {o_x + 48} 70, {o_x + 54} 80, {o_x + 54} 103
      C {o_x + 54} 126, {o_x + 48} 136, {o_x + 36} 136
      C {o_x + 24} 136, {o_x + 18} 126, {o_x + 18} 103
      C {o_x + 18} 80, {o_x + 24} 70, {o_x + 36} 70
      Z
    "/>
    """

    # Subtitle: COUPLE TASK HUB (y: 172 to 190, height: 18px)
    def letter_path(char, cx, cy):
        if char == 'C':
            return f"M {cx+13} {cy+4} C {cx+11} {cy}, {cx+3} {cy}, {cx+3} {cy+9} C {cx+3} {cy+18}, {cx+11} {cy+18}, {cx+13} {cy+14} L {cx+10} {cy+14} C {cx+9} {cy+15.5}, {cx+6} {cy+15.5}, {cx+6} {cy+9} C {cx+6} {cy+2.5}, {cx+9} {cy+2.5}, {cx+10} {cy+4} Z"
        elif char == 'O':
            return f"M {cx+7} {cy} C {cx+2} {cy}, {cx+2} {cy+18}, {cx+7} {cy+18} C {cx+12} {cy+18}, {cx+12} {cy}, {cx+7} {cy} Z M {cx+7} {cy+3} C {cx+9.5} {cy+3}, {cx+9.5} {cy+15}, {cx+7} {cy+15} C {cx+4.5} {cy+15}, {cx+4.5} {cy+3}, {cx+7} {cy+3} Z"
        elif char == 'U':
            return f"M {cx+2} {cy} L {cx+5} {cy} L {cx+5} {cy+12} C {cx+5} {cy+15}, {cx+9} {cy+15}, {cx+9} {cy+12} L {cx+9} {cy} L {cx+12} {cy} L {cx+12} {cy+12} C {cx+12} {cy+18}, {cx+2} {cy+18}, {cx+2} {cy+12} Z"
        elif char == 'P':
            return f"M {cx+2} {cy} L {cx+9} {cy} C {cx+13} {cy}, {cx+13} {cy+9}, {cx+9} {cy+9} L {cx+5} {cy+9} L {cx+5} {cy+18} L {cx+2} {cy+18} Z M {cx+5} {cy+3} L {cx+9} {cy+3} C {cx+10.5} {cy+3}, {cx+10.5} {cy+6.5}, {cx+9} {cy+6.5} L {cx+5} {cy+6.5} Z"
        elif char == 'L':
            return f"M {cx+2} {cy} L {cx+5} {cy} L {cx+5} {cy+15} L {cx+12} {cy+15} L {cx+12} {cy+18} L {cx+2} {cy+18} Z"
        elif char == 'E':
            return f"M {cx+2} {cy} L {cx+12} {cy} L {cx+12} {cy+3} L {cx+5} {cy+3} L {cx+5} {cy+7.5} L {cx+11} {cy+7.5} L {cx+11} {cy+10.5} L {cx+5} {cy+10.5} L {cx+5} {cy+15} L {cx+12} {cy+15} L {cx+12} {cy+18} L {cx+2} {cy+18} Z"
        elif char == 'T':
            return f"M {cx+1} {cy} L {cx+13} {cy} L {cx+13} {cy+3} L {cx+8.5} {cy+3} L {cx+8.5} {cy+18} L {cx+5.5} {cy+18} L {cx+5.5} {cy+3} L {cx+1} {cy+3} Z"
        elif char == 'A':
            return f"M {cx+7} {cy} L {cx+13} {cy+18} L {cx+10} {cy+18} L {cx+8.5} {cy+13.5} L {cx+5.5} {cy+13.5} L {cx+4} {cy+18} L {cx+1} {cy+18} Z M {cx+7} {cy+4.5} L {cx+6.2} {cy+11} L {cx+7.8} {cy+11} Z"
        elif char == 'S':
            return f"M {cx+12} {cy+4} C {cx+10} {cy}, {cx+3} {cy}, {cx+3} {cy+6} C {cx+3} {cy+10}, {cx+12} {cy+9}, {cx+12} {cy+13.5} C {cx+12} {cy+18}, {cx+4} {cy+18}, {cx+2} {cy+14} L {cx+5} {cy+13} C {cx+6} {cy+15.5}, {cx+9} {cy+15.5}, {cx+9} {cy+13.5} C {cx+9} {cy+11.5}, {cx+2} {cy+12}, {cx+2} {cy+6} C {cx+2} {cy+1}, {cx+9} {cy}, {cx+12} {cy+2} Z"
        elif char == 'K':
            return f"M {cx+2} {cy} L {cx+5} {cy} L {cx+5} {cy+9} L {cx+9} {cy} L {cx+13} {cy} L {cx+7.5} {cy+10} L {cx+13} {cy+18} L {cx+9.5} {cy+18} L {cx+5} {cy+11} L {cx+5} {cy+18} L {cx+2} {cy+18} Z"
        elif char == 'H':
            return f"M {cx+2} {cy} L {cx+5} {cy} L {cx+5} {cy+7.5} L {cx+9} {cy+7.5} L {cx+9} {cy} L {cx+12} {cy} L {cx+12} {cy+18} L {cx+9} {cy+18} L {cx+9} {cy+10.5} L {cx+5} {cy+10.5} L {cx+5} {cy+18} L {cx+2} {cy+18} Z"
        elif char == 'B':
            return f"M {cx+2} {cy} L {cx+8} {cy} C {cx+12} {cy}, {cx+12} {cy+7.5}, {cx+9} {cy+8.5} C {cx+12.5} {cy+9.5}, {cx+12.5} {cy+18}, {cx+8} {cy+18} L {cx+2} {cy+18} Z M {cx+5} {cy+3} L {cx+8} {cy+3} C {cx+9.5} {cy+3}, {cx+9.5} {cy+6.5}, {cx+8} {cy+6.5} L {cx+5} {cy+6.5} Z M {cx+5} {cy+9} L {cx+8} {cy+9} C {cx+9.5} {cy+9}, {cx+9.5} {cy+15}, {cx+8} {cy+15} L {cx+5} {cy+15} Z"
        return ""

    phrase = "COUPLE TASK HUB"
    paths = []
    cur_x = start_x
    for ch in phrase:
        if ch == ' ':
            cur_x += 12
        else:
            p = letter_path(ch, cur_x, 172)
            if p:
                paths.append(f'<path fill="#000000" fill-rule="evenodd" d="{p}"/>')
            cur_x += 18

    letters_svg = "\n    ".join(paths)

    return f"""
    <!-- Wordmark -->
    <g id="wordmark">
      {glyph_2}
      {glyph_d}
      {glyph_o}
      <!-- Ink Bar -->
      <rect x="{start_x}" y="160" width="248" height="3" fill="#000000" />
      <!-- Outlined Subtitle: COUPLE TASK HUB -->
      <g id="subtitle">
        {letters_svg}
      </g>
    </g>
    """

# -------------------------------------------------------------
# Cute Concept 1: "The Lovebirds"
# Two chubby companion birds nuzzled together, their wings & tails forming a bold checkmark + heart
# -------------------------------------------------------------
def build_cute_a_symbol():
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-cute-a">
  <title id="title-cute-a">2DO Cute Logo — Concept A: The Lovebird Check</title>
  <g id="symbol">
    <!-- Floating heart above their kiss -->
    <path fill="#000000" d="
      M 128 54
      C 128 42, 114 34, 104 42
      C 94 50, 96 64, 108 76
      L 128 94
      L 148 76
      C 160 64, 162 50, 152 42
      C 142 34, 128 42, 128 54
      Z
    "/>

    <!-- Left Chubby Bird (Partner 1) -->
    <!-- Body -->
    <circle cx="96" cy="146" r="46" fill="#000000" />
    <!-- White eye sparkle -->
    <circle cx="86" cy="136" r="6" fill="#FFFFFF" />
    <circle cx="88" cy="134" r="2.5" fill="#000000" />
    <!-- Perky Tail Feather at 45 deg -->
    <path fill="#000000" d="
      M 56 160
      L 34 138
      C 30 134, 30 126, 34 122
      C 38 118, 46 118, 50 122
      L 74 146
      Z
    "/>
    <!-- Kissing Beak (White cut) -->
    <polygon points="120,140 128,145 120,150" fill="#FFFFFF" />

    <!-- Right Chubby Bird (Partner 2) - Sweeps into a giant joyful checkmark! -->
    <!-- Body -->
    <circle cx="156" cy="146" r="48" fill="#000000" />
    <!-- White eye sparkle -->
    <circle cx="166" cy="136" r="6" fill="#FFFFFF" />
    <circle cx="168" cy="134" r="2.5" fill="#000000" />
    <!-- Giant Upward Check Wing / Feather at 45 deg -->
    <path fill="#000000" d="
      M 148 162
      L 214 96
      C 220 90, 220 80, 214 74
      C 208 68, 198 68, 192 74
      L 132 134
      Z
    "/>
    <!-- Kissing Beak -->
    <polygon points="136,140 128,145 136,150" fill="#FFFFFF" />

    <!-- Perch / Ground line -->
    <rect x="52" y="196" width="152" height="12" rx="6" fill="#000000" />
  </g>
</svg>"""

def build_cute_a_lockup():
    symbol_inner = """
    <g id="symbol" transform="translate(10, 0)">
      <!-- Floating heart -->
      <path fill="#000000" d="
        M 128 54
        C 128 42, 114 34, 104 42
        C 94 50, 96 64, 108 76
        L 128 94
        L 148 76
        C 160 64, 162 50, 152 42
        C 142 34, 128 42, 128 54
        Z
      "/>
      <!-- Left Bird -->
      <circle cx="96" cy="146" r="46" fill="#000000" />
      <circle cx="86" cy="136" r="6" fill="#FFFFFF" />
      <circle cx="88" cy="134" r="2.5" fill="#000000" />
      <path fill="#000000" d="M 56 160 L 34 138 C 30 134, 30 126, 34 122 C 38 118, 46 118, 50 122 L 74 146 Z" />
      <polygon points="120,140 128,145 120,150" fill="#FFFFFF" />
      <!-- Right Bird -->
      <circle cx="156" cy="146" r="48" fill="#000000" />
      <circle cx="166" cy="136" r="6" fill="#FFFFFF" />
      <circle cx="168" cy="134" r="2.5" fill="#000000" />
      <path fill="#000000" d="M 148 162 L 214 96 C 220 90, 220 80, 214 74 C 208 68, 198 68, 192 74 L 132 134 Z" />
      <polygon points="136,140 128,145 136,150" fill="#FFFFFF" />
      <!-- Perch -->
      <rect x="52" y="196" width="152" height="12" rx="6" fill="#000000" />
    </g>
    """
    wordmark = get_cute_wordmark(start_x=280)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 256" width="640" height="256" role="img" aria-labelledby="title-cute-a-lockup">
  <title id="title-cute-a-lockup">2DO Logo Lockup — The Lovebirds</title>
  {symbol_inner}
  {wordmark}
</svg>"""

# -------------------------------------------------------------
# Cute Concept 2: "The Happy Kitty Check"
# A sweet squircle cat with perky ears and a triumphant checkmark smile
# -------------------------------------------------------------
def build_cute_b_symbol():
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-cute-b">
  <title id="title-cute-b">2DO Cute Logo — Concept B: The Happy Cat Check</title>
  <g id="symbol">
    <!-- Cat Ears -->
    <!-- Left Ear -->
    <path fill="#000000" d="
      M 56 104
      L 74 46
      C 78 36, 92 36, 96 46
      L 114 104
      Z
    "/>
    <!-- Right Ear -->
    <path fill="#000000" d="
      M 142 104
      L 160 46
      C 164 36, 178 36, 182 46
      L 200 104
      Z
    "/>
    <!-- Head: Squircle Silhouette -->
    <rect x="44" y="80" width="168" height="136" rx="52" fill="#000000" />

    <!-- Left Eye: Happy squint curve ^ (White cutout) -->
    <path fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" d="
      M 78 138
      C 84 126, 100 126, 106 138
    "/>

    <!-- Right Eye: Big curious shiny eye (White cutout) -->
    <circle cx="158" cy="134" r="14" fill="#FFFFFF" />
    <circle cx="160" cy="132" r="7" fill="#000000" />
    <circle cx="163" cy="130" r="2.5" fill="#FFFFFF" />

    <!-- Cute Heart Nose -->
    <path fill="#FFFFFF" d="
      M 128 144
      C 128 140, 122 136, 118 140
      C 114 144, 116 150, 122 154
      L 128 160
      L 134 154
      C 140 150, 142 144, 138 140
      C 134 136, 128 140, 128 144
      Z
    "/>

    <!-- Checkmark Smile! (Starts small on left, sweeps up boldly on right) -->
    <path fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" d="
      M 112 168
      L 124 180
      L 156 162
    "/>

    <!-- Whiskers -->
    <line x1="28" y1="140" x2="40" y2="142" stroke="#000000" stroke-width="5" stroke-linecap="round"/>
    <line x1="26" y1="154" x2="40" y2="152" stroke="#000000" stroke-width="5" stroke-linecap="round"/>
    <line x1="216" y1="142" x2="228" y2="140" stroke="#000000" stroke-width="5" stroke-linecap="round"/>
    <line x1="216" y1="152" x2="230" y2="154" stroke="#000000" stroke-width="5" stroke-linecap="round"/>
  </g>
</svg>"""

def build_cute_b_lockup():
    symbol_inner = """
    <g id="symbol" transform="translate(10, 0)">
      <path fill="#000000" d="M 56 104 L 74 46 C 78 36, 92 36, 96 46 L 114 104 Z"/>
      <path fill="#000000" d="M 142 104 L 160 46 C 164 36, 178 36, 182 46 L 200 104 Z"/>
      <rect x="44" y="80" width="168" height="136" rx="52" fill="#000000" />
      <path fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" d="M 78 138 C 84 126, 100 126, 106 138"/>
      <circle cx="158" cy="134" r="14" fill="#FFFFFF" />
      <circle cx="160" cy="132" r="7" fill="#000000" />
      <circle cx="163" cy="130" r="2.5" fill="#FFFFFF" />
      <path fill="#FFFFFF" d="M 128 144 C 128 140, 122 136, 118 140 C 114 144, 116 150, 122 154 L 128 160 L 134 154 C 140 150, 142 144, 138 140 C 134 136, 128 140, 128 144 Z"/>
      <path fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" d="M 112 168 L 124 180 L 156 162"/>
      <line x1="28" y1="140" x2="40" y2="142" stroke="#000000" stroke-width="5" stroke-linecap="round"/>
      <line x1="26" y1="154" x2="40" y2="152" stroke="#000000" stroke-width="5" stroke-linecap="round"/>
      <line x1="216" y1="142" x2="228" y2="140" stroke="#000000" stroke-width="5" stroke-linecap="round"/>
      <line x1="216" y1="152" x2="230" y2="154" stroke="#000000" stroke-width="5" stroke-linecap="round"/>
    </g>
    """
    wordmark = get_cute_wordmark(start_x=280)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 256" width="640" height="256" role="img" aria-labelledby="title-cute-b-lockup">
  <title id="title-cute-b-lockup">2DO Logo Lockup — The Happy Cat</title>
  {symbol_inner}
  {wordmark}
</svg>"""

# -------------------------------------------------------------
# Cute Concept 3: "The Twin Hug Check"
# Two chubby companion peas/blobs high-fiving into a unified checkmark
# -------------------------------------------------------------
def build_cute_c_symbol():
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-cute-c">
  <title id="title-cute-c">2DO Cute Logo — Concept C: The Twin Hug</title>
  <g id="symbol">
    <!-- Double Floating Hearts -->
    <path fill="#000000" d="
      M 116 48
      C 116 40, 106 34, 100 38
      C 94 42, 94 52, 102 60
      L 116 72
      L 130 60
      C 138 52, 138 42, 132 38
      C 126 34, 116 40, 116 48
      Z
    "/>
    <path fill="#000000" d="
      M 148 38
      C 148 32, 140 28, 136 31
      C 132 34, 132 40, 138 46
      L 148 56
      L 158 46
      C 164 40, 164 34, 160 31
      C 156 28, 148 32, 148 38
      Z
    "/>

    <!-- Partner 1 (Left Chubby Pill) -->
    <rect x="52" y="96" width="68" height="110" rx="34" fill="#000000" />
    <!-- Eyes -->
    <circle cx="76" cy="130" r="5" fill="#FFFFFF" />
    <circle cx="96" cy="130" r="5" fill="#FFFFFF" />
    <!-- Sweet Open Smile -->
    <path fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" d="
      M 80 144
      C 83 150, 90 150, 93 144
    "/>

    <!-- Partner 2 (Right Chubby Pill) -->
    <rect x="136" y="78" width="68" height="128" rx="34" fill="#000000" />
    <!-- Winking Eye -->
    <path fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" d="
      M 154 116
      C 158 111, 164 111, 168 116
    "/>
    <circle cx="184" cy="114" r="5" fill="#FFFFFF" />
    <!-- Happy Grin -->
    <path fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" d="
      M 162 128
      C 166 135, 174 135, 178 128
    "/>

    <!-- Shared Unified High-Five Checkmark Bridge -->
    <!-- Starts from Left's tummy, loops down and sweeps up past Right's shoulder! -->
    <path fill="none" stroke="#000000" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" d="
      M 40 156
      L 76 192
      L 216 78
    "/>
    <!-- Inner white highlight inside the checkmark -->
    <path fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" d="
      M 46 156
      L 76 186
      L 210 82
    "/>
  </g>
</svg>"""

def build_cute_c_lockup():
    symbol_inner = """
    <g id="symbol" transform="translate(10, 0)">
      <path fill="#000000" d="M 116 48 C 116 40, 106 34, 100 38 C 94 42, 94 52, 102 60 L 116 72 L 130 60 C 138 52, 138 42, 132 38 C 126 34, 116 40, 116 48 Z"/>
      <path fill="#000000" d="M 148 38 C 148 32, 140 28, 136 31 C 132 34, 132 40, 138 46 L 148 56 L 158 46 C 164 40, 164 34, 160 31 C 156 28, 148 32, 148 38 Z"/>
      <rect x="52" y="96" width="68" height="110" rx="34" fill="#000000" />
      <circle cx="76" cy="130" r="5" fill="#FFFFFF" />
      <circle cx="96" cy="130" r="5" fill="#FFFFFF" />
      <path fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" d="M 80 144 C 83 150, 90 150, 93 144"/>
      <rect x="136" y="78" width="68" height="128" rx="34" fill="#000000" />
      <path fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" d="M 154 116 C 158 111, 164 111, 168 116"/>
      <circle cx="184" cy="114" r="5" fill="#FFFFFF" />
      <path fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" d="M 162 128 C 166 135, 174 135, 178 128"/>
      <path fill="none" stroke="#000000" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" d="M 40 156 L 76 192 L 216 78"/>
      <path fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" d="M 46 156 L 76 186 L 210 82"/>
    </g>
    """
    wordmark = get_cute_wordmark(start_x=280)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 256" width="640" height="256" role="img" aria-labelledby="title-cute-c-lockup">
  <title id="title-cute-c-lockup">2DO Logo Lockup — The Twin Hug</title>
  {symbol_inner}
  {wordmark}
</svg>"""

def main():
    out_dir = "/Users/kiwi/Desktop/Developer/Antigravity/Todo-List/branding"
    os.makedirs(out_dir, exist_ok=True)

    files = {
        "cute-a-symbol.svg": build_cute_a_symbol(),
        "cute-a-lockup.svg": build_cute_a_lockup(),
        "cute-b-symbol.svg": build_cute_b_symbol(),
        "cute-b-lockup.svg": build_cute_b_lockup(),
        "cute-c-symbol.svg": build_cute_c_symbol(),
        "cute-c-lockup.svg": build_cute_c_lockup(),
    }

    for fname, content in files.items():
        path = os.path.join(out_dir, fname)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content.strip() + "\n")
        print(f"Wrote {path}")

if __name__ == "__main__":
    main()
