#!/usr/bin/env python3
"""Refined logo concepts generator for 2DO / Couple Task Hub.
Fully snapped angles, perfect optical weights, no tiny sub-shapes, no live <text>.
"""

import os

def get_wordmark_paths(start_x=260):
    """Clean geometric vector paths for '2DO' and 'COUPLE TASK HUB'."""
    # 2DO: height 72px (y: 60 to 132)
    # 2:
    glyph_2 = f"""
    <!-- 2 -->
    <path fill="#000000" fill-rule="evenodd" d="
      M {start_x} 84
      C {start_x} 68, {start_x + 14} 56, {start_x + 32} 56
      C {start_x + 50} 56, {start_x + 64} 68, {start_x + 64} 84
      C {start_x + 64} 98, {start_x + 54} 110, {start_x + 38} 122
      L {start_x + 20} 136
      L {start_x + 64} 136
      L {start_x + 64} 152
      L {start_x} 152
      L {start_x} 138
      L {start_x + 28} 114
      C {start_x + 40} 104, {start_x + 46} 94, {start_x + 46} 84
      C {start_x + 46} 76, {start_x + 40} 70, {start_x + 32} 70
      C {start_x + 24} 70, {start_x + 18} 76, {start_x + 18} 84
      Z
    "/>
    """

    # D:
    d_x = start_x + 82
    glyph_d = f"""
    <!-- D -->
    <path fill="#000000" fill-rule="evenodd" d="
      M {d_x} 56
      L {d_x + 36} 56
      C {d_x + 58} 56, {d_x + 72} 72, {d_x + 72} 104
      C {d_x + 72} 136, {d_x + 58} 152, {d_x + 36} 152
      L {d_x} 152
      Z
      M {d_x + 18} 72
      L {d_x + 34} 72
      C {d_x + 46} 72, {d_x + 54} 82, {d_x + 54} 104
      C {d_x + 54} 126, {d_x + 46} 136, {d_x + 34} 136
      L {d_x + 18} 136
      Z
    "/>
    """

    # O:
    o_x = start_x + 174
    glyph_o = f"""
    <!-- O -->
    <path fill="#000000" fill-rule="evenodd" d="
      M {o_x + 36} 56
      C {o_x + 58} 56, {o_x + 72} 72, {o_x + 72} 104
      C {o_x + 72} 136, {o_x + 58} 152, {o_x + 36} 152
      C {o_x + 14} 152, {o_x} 136, {o_x} 104
      C {o_x} 72, {o_x + 14} 56, {o_x + 36} 56
      Z
      M {o_x + 36} 72
      C {o_x + 48} 72, {o_x + 54} 82, {o_x + 54} 104
      C {o_x + 54} 126, {o_x + 48} 136, {o_x + 36} 136
      C {o_x + 24} 136, {o_x + 18} 126, {o_x + 18} 104
      C {o_x + 18} 82, {o_x + 24} 72, {o_x + 36} 72
      Z
    "/>
    """

    # Subtitle: COUPLE TASK HUB (y: 172 to 190, height: 18px)
    def letter_path(char, cx, cy):
        # 14x18 box
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
# Concept A: The Twin Check / Mutual Mark
# -------------------------------------------------------------
def build_concept_a_symbol():
    # Exactly 45-degree angles, fills 76% of canvas
    # Left check: (44, 116) -> (104, 176) [dx=60, dy=60] -> (196, 84) [dx=92, dy=-92]
    # Right check: (212, 116) -> (152, 176) [dx=-60, dy=60] -> (60, 84) [dx=-92, dy=-92]
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-a">
  <title id="title-a">2DO Logo — Concept A: The Twin Check</title>
  <g id="symbol" fill="none" stroke="#000000" stroke-width="32" stroke-linecap="round" stroke-linejoin="round">
    <!-- Left Checkmark (Partner 1) -->
    <path d="M 44 116 L 104 176 L 196 84" />
    <!-- Right Checkmark (Partner 2) -->
    <path d="M 212 116 L 152 176 L 60 84" />
  </g>
</svg>"""

def build_concept_a_lockup():
    symbol_inner = """
    <g id="symbol" transform="translate(12, 0)" fill="none" stroke="#000000" stroke-width="32" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 44 116 L 104 176 L 196 84" />
      <path d="M 212 116 L 152 176 L 60 84" />
    </g>
    """
    wordmark = get_wordmark_paths(start_x=280)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 256" width="640" height="256" role="img" aria-labelledby="title-a-lockup">
  <title id="title-a-lockup">2DO Logo Lockup — Concept A</title>
  {symbol_inner}
  {wordmark}
</svg>"""

# -------------------------------------------------------------
# Concept B: The 2DO Infinity Loop
# -------------------------------------------------------------
def build_concept_b_symbol():
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-b">
  <title id="title-b">2DO Logo — Concept B: The Infinity Two</title>
  <g id="symbol" fill="none" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round">
    <!-- Fluid 2-to-D infinity contour -->
    <path d="M 52 92 C 52 56, 116 52, 138 84 C 150 102, 108 144, 64 184 L 156 184 C 200 184, 208 144, 208 124 C 208 86, 172 76, 138 76" />
    <!-- Sync dot -->
    <circle cx="168" cy="126" r="12" fill="#000000" stroke="none"/>
  </g>
</svg>"""

def build_concept_b_lockup():
    symbol_inner = """
    <g id="symbol" transform="translate(12, 0)" fill="none" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 52 92 C 52 56, 116 52, 138 84 C 150 102, 108 144, 64 184 L 156 184 C 200 184, 208 144, 208 124 C 208 86, 172 76, 138 76" />
      <circle cx="168" cy="126" r="12" fill="#000000" stroke="none"/>
    </g>
    """
    wordmark = get_wordmark_paths(start_x=280)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 256" width="640" height="256" role="img" aria-labelledby="title-b-lockup">
  <title id="title-b-lockup">2DO Logo Lockup — Concept B</title>
  {symbol_inner}
  {wordmark}
</svg>"""

# -------------------------------------------------------------
# Concept C: The Duo Pillars & Check Blade
# -------------------------------------------------------------
def build_concept_c_symbol():
    # Exactly 45-degree angles on all diagonals!
    # Blade vertices:
    # (38, 142) -> (88, 192) [dx=50, dy=50: 45 deg]
    # -> (218, 62) [dx=130, dy=-130: 45 deg]
    # -> (198, 42) [dx=-20, dy=-20: 45 deg]
    # -> (88, 152) [dx=-110, dy=110: 45 deg]
    # -> (58, 122) [dx=-30, dy=-30: 45 deg]
    # -> Z (38, 142) [dx=-20, dy=20: 45 deg]
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-c">
  <title id="title-c">2DO Logo — Concept C: The Duo Pillars</title>
  <g id="symbol">
    <!-- Partner 1 Pillar (Left) -->
    <rect x="56" y="98" width="40" height="96" rx="20" fill="#000000" />
    <!-- Partner 2 Pillar (Right) -->
    <rect x="156" y="58" width="40" height="136" rx="20" fill="#000000" />
    <!-- Ascending 45° Blade -->
    <path fill="#000000" fill-rule="evenodd" d="
      M 38 142
      L 88 192
      L 218 62
      L 198 42
      L 88 152
      L 58 122
      Z
    "/>
  </g>
</svg>"""

def build_concept_c_lockup():
    symbol_inner = """
    <g id="symbol" transform="translate(12, 0)">
      <rect x="56" y="98" width="40" height="96" rx="20" fill="#000000" />
      <rect x="156" y="58" width="40" height="136" rx="20" fill="#000000" />
      <path fill="#000000" fill-rule="evenodd" d="
        M 38 142
        L 88 192
        L 218 62
        L 198 42
        L 88 152
        L 58 122
        Z
      "/>
    </g>
    """
    wordmark = get_wordmark_paths(start_x=280)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 256" width="640" height="256" role="img" aria-labelledby="title-c-lockup">
  <title id="title-c-lockup">2DO Logo Lockup — Concept C</title>
  {symbol_inner}
  {wordmark}
</svg>"""

def main():
    out_dir = "/Users/kiwi/Desktop/Developer/Antigravity/Todo-List/branding"
    os.makedirs(out_dir, exist_ok=True)

    files = {
        "concept-a-symbol.svg": build_concept_a_symbol(),
        "concept-a-lockup.svg": build_concept_a_lockup(),
        "concept-b-symbol.svg": build_concept_b_symbol(),
        "concept-b-lockup.svg": build_concept_b_lockup(),
        "concept-c-symbol.svg": build_concept_c_symbol(),
        "concept-c-lockup.svg": build_concept_c_lockup(),
    }

    for fname, content in files.items():
        path = os.path.join(out_dir, fname)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content.strip() + "\n")
        print(f"Wrote {path}")

if __name__ == "__main__":
    main()
