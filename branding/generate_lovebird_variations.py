#!/usr/bin/env python3
"""Generate 3 distinct, refined variations of The Lovebirds (Option A).
No live text, pure vector paths, real negative space, mathematically clean angles.
"""

import os
from generate_cute_concepts import get_cute_wordmark

# -----------------------------------------------------------------
# Variation 1: "The Kissing Check" (Polished Evolution of Concept A)
# Real negative-space cutouts, 45-degree wing check, sweet nuzzle
# -----------------------------------------------------------------
def build_lovebird_v1_symbol():
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-lb-1">
  <title id="title-lb-1">2DO Logo — Lovebirds V1: The Kissing Check</title>
  <g id="symbol">
    <!-- Floating Heart above kiss -->
    <path fill="#000000" d="
      M 128 52
      C 128 40, 114 32, 104 40
      C 94 48, 96 62, 108 74
      L 128 92
      L 148 74
      C 160 62, 162 48, 152 40
      C 142 32, 128 40, 128 52
      Z
    "/>

    <!-- Left Chubby Bird (Partner 1) -->
    <!-- Body with real eye hole via evenodd -->
    <path fill="#000000" fill-rule="evenodd" d="
      M 96 100
      A 46 46 0 1 1 95.9 100
      Z
      M 86 130
      C 82 130, 80 134, 80 138
      C 80 142, 84 144, 88 144
      C 92 144, 96 142, 96 138
      C 96 134, 94 130, 86 130
      Z
    "/>
    <!-- Perky Tail Feather at 45° -->
    <path fill="#000000" d="
      M 56 160
      L 34 138
      C 30 134, 30 126, 34 122
      C 38 118, 46 118, 50 122
      L 74 146
      Z
    "/>
    <!-- Beak -->
    <polygon points="120,140 128,145 120,150" fill="#000000" />

    <!-- Right Chubby Bird (Partner 2) -->
    <!-- Body with real eye hole via evenodd -->
    <path fill="#000000" fill-rule="evenodd" d="
      M 156 98
      A 48 48 0 1 1 155.9 98
      Z
      M 166 128
      C 162 128, 160 132, 160 136
      C 160 140, 164 142, 168 142
      C 172 142, 176 140, 176 136
      C 176 132, 174 128, 166 128
      Z
    "/>
    <!-- Giant Upward Check Wing at 45° -->
    <path fill="#000000" d="
      M 148 162
      L 214 96
      C 220 90, 220 80, 214 74
      C 208 68, 198 68, 192 74
      L 132 134
      Z
    "/>
    <!-- Beak -->
    <polygon points="136,140 128,145 136,150" fill="#000000" />

    <!-- Shared Perch Bar -->
    <rect x="52" y="196" width="152" height="14" rx="7" fill="#000000" />
  </g>
</svg>"""

def build_lovebird_v1_lockup():
    symbol_inner = """
    <g id="symbol" transform="translate(10, 0)">
      <path fill="#000000" d="M 128 52 C 128 40, 114 32, 104 40 C 94 48, 96 62, 108 74 L 128 92 L 148 74 C 160 62, 162 48, 152 40 C 142 32, 128 40, 128 52 Z"/>
      <path fill="#000000" fill-rule="evenodd" d="M 96 100 A 46 46 0 1 1 95.9 100 Z M 86 130 C 82 130, 80 134, 80 138 C 80 142, 84 144, 88 144 C 92 144, 96 142, 96 138 C 96 134, 94 130, 86 130 Z"/>
      <path fill="#000000" d="M 56 160 L 34 138 C 30 134, 30 126, 34 122 C 38 118, 46 118, 50 122 L 74 146 Z"/>
      <polygon points="120,140 128,145 120,150" fill="#000000" />
      <path fill="#000000" fill-rule="evenodd" d="M 156 98 A 48 48 0 1 1 155.9 98 Z M 166 128 C 162 128, 160 132, 160 136 C 160 140, 164 142, 168 142 C 172 142, 176 140, 176 136 C 176 132, 174 128, 166 128 Z"/>
      <path fill="#000000" d="M 148 162 L 214 96 C 220 90, 220 80, 214 74 C 208 68, 198 68, 192 74 L 132 134 Z"/>
      <polygon points="136,140 128,145 136,150" fill="#000000" />
      <rect x="52" y="196" width="152" height="14" rx="7" fill="#000000" />
    </g>
    """
    wordmark = get_cute_wordmark(start_x=280)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 256" width="640" height="256" role="img" aria-labelledby="title-lb-1-lockup">
  <title id="title-lb-1-lockup">2DO Logo Lockup — The Kissing Check</title>
  {symbol_inner}
  {wordmark}
</svg>"""

# -----------------------------------------------------------------
# Variation 2: "The Heart Silhouette Birds" (Heart Shape with Inner Birds)
# Two kissing birds whose overall silhouette is a unified romantic heart with check wing
# -----------------------------------------------------------------
def build_lovebird_v2_symbol():
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-lb-2">
  <title id="title-lb-2">2DO Logo — Lovebirds V2: Heart-Contour Birds</title>
  <g id="symbol">
    <!-- Heart shaped bird duo silhouette with real eye and beak cutouts -->
    <path fill="#000000" fill-rule="evenodd" d="
      M 128 100
      C 114 74, 76 60, 52 86
      C 26 114, 34 162, 78 196
      L 128 226
      L 178 196
      C 188 186, 196 172, 200 156
      L 226 130
      C 232 124, 232 114, 226 108
      C 220 102, 210 102, 204 108
      L 182 130
      C 182 92, 150 74, 128 100
      Z
      M 78 120
      A 7 7 0 1 0 78.1 120
      Z
      M 166 120
      A 7 7 0 1 0 166.1 120
      Z
      M 128 128
      L 120 136
      L 136 136
      Z
    "/>
    <!-- Floating mini heart -->
    <path fill="#000000" d="
      M 128 42
      C 128 34, 120 28, 114 33
      C 108 38, 108 46, 116 54
      L 128 66
      L 140 54
      C 148 46, 148 38, 142 33
      C 136 28, 128 34, 128 42
      Z
    "/>
  </g>
</svg>"""

def build_lovebird_v2_lockup():
    symbol_inner = """
    <g id="symbol" transform="translate(10, 0)">
      <path fill="#000000" fill-rule="evenodd" d="
        M 128 100
        C 114 74, 76 60, 52 86
        C 26 114, 34 162, 78 196
        L 128 226
        L 178 196
        C 188 186, 196 172, 200 156
        L 226 130
        C 232 124, 232 114, 226 108
        C 220 102, 210 102, 204 108
        L 182 130
        C 182 92, 150 74, 128 100
        Z
        M 78 120 A 7 7 0 1 0 78.1 120 Z
        M 166 120 A 7 7 0 1 0 166.1 120 Z
        M 128 128 L 120 136 L 136 136 Z
      "/>
      <path fill="#000000" d="M 128 42 C 128 34, 120 28, 114 33 C 108 38, 108 46, 116 54 L 128 66 L 140 54 C 148 46, 148 38, 142 33 C 136 28, 128 34, 128 42 Z"/>
    </g>
    """
    wordmark = get_cute_wordmark(start_x=280)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 256" width="640" height="256" role="img" aria-labelledby="title-lb-2-lockup">
  <title id="title-lb-2-lockup">2DO Logo Lockup — Heart-Contour Birds</title>
  {symbol_inner}
  {wordmark}
</svg>"""

# -----------------------------------------------------------------
# Variation 3: "The Monoline Nestling Duo" (Modern Ink Line Art)
# Bold 22px monoline stroke with rounded caps, ultra clean & modern
# -----------------------------------------------------------------
def build_lovebird_v3_symbol():
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="title-lb-3">
  <title id="title-lb-3">2DO Logo — Lovebirds V3: Monoline Duo</title>
  <g id="symbol">
    <!-- Floating Heart -->
    <path fill="#000000" d="
      M 128 48
      C 128 38, 116 32, 108 38
      C 100 44, 102 56, 112 66
      L 128 82
      L 144 66
      C 154 56, 156 44, 148 38
      C 140 32, 128 38, 128 48
      Z
    "/>

    <!-- Left Bird Monoline Body & Tail -->
    <circle cx="94" cy="144" r="42" fill="none" stroke="#000000" stroke-width="20" />
    <path d="M 58 158 L 36 136" fill="none" stroke="#000000" stroke-width="20" stroke-linecap="round" />
    <!-- Left Bird Eye -->
    <circle cx="88" cy="138" r="6" fill="#000000" />
    <!-- Beaks meeting -->
    <polygon points="120,139 128,144 120,149" fill="#000000" />
    <polygon points="136,139 128,144 136,149" fill="#000000" />

    <!-- Right Bird Monoline Body & Giant Check Wing -->
    <circle cx="158" cy="144" r="44" fill="none" stroke="#000000" stroke-width="20" />
    <!-- Ascending 45° Check Wing -->
    <path d="M 146 156 L 216 86" fill="none" stroke="#000000" stroke-width="22" stroke-linecap="round" />
    <!-- Right Bird Eye -->
    <circle cx="164" cy="138" r="6" fill="#000000" />

    <!-- Perch Baseline -->
    <path d="M 52 198 L 204 198" fill="none" stroke="#000000" stroke-width="16" stroke-linecap="round" />
  </g>
</svg>"""

def build_lovebird_v3_lockup():
    symbol_inner = """
    <g id="symbol" transform="translate(10, 0)">
      <path fill="#000000" d="M 128 48 C 128 38, 116 32, 108 38 C 100 44, 102 56, 112 66 L 128 82 L 144 66 C 154 56, 156 44, 148 38 C 140 32, 128 38, 128 48 Z"/>
      <circle cx="94" cy="144" r="42" fill="none" stroke="#000000" stroke-width="20" />
      <path d="M 58 158 L 36 136" fill="none" stroke="#000000" stroke-width="20" stroke-linecap="round" />
      <circle cx="88" cy="138" r="6" fill="#000000" />
      <polygon points="120,139 128,144 120,149" fill="#000000" />
      <polygon points="136,139 128,144 136,149" fill="#000000" />
      <circle cx="158" cy="144" r="44" fill="none" stroke="#000000" stroke-width="20" />
      <path d="M 146 156 L 216 86" fill="none" stroke="#000000" stroke-width="22" stroke-linecap="round" />
      <circle cx="164" cy="138" r="6" fill="#000000" />
      <path d="M 52 198 L 204 198" fill="none" stroke="#000000" stroke-width="16" stroke-linecap="round" />
    </g>
    """
    wordmark = get_cute_wordmark(start_x=280)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 256" width="640" height="256" role="img" aria-labelledby="title-lb-3-lockup">
  <title id="title-lb-3-lockup">2DO Logo Lockup — Monoline Duo</title>
  {symbol_inner}
  {wordmark}
</svg>"""

def main():
    out_dir = "/Users/kiwi/Desktop/Developer/Antigravity/Todo-List/branding"
    os.makedirs(out_dir, exist_ok=True)

    files = {
        "lovebirds-v1-symbol.svg": build_lovebird_v1_symbol(),
        "lovebirds-v1-lockup.svg": build_lovebird_v1_lockup(),
        "lovebirds-v2-symbol.svg": build_lovebird_v2_symbol(),
        "lovebirds-v2-lockup.svg": build_lovebird_v2_lockup(),
        "lovebirds-v3-symbol.svg": build_lovebird_v3_symbol(),
        "lovebirds-v3-lockup.svg": build_lovebird_v3_lockup(),
    }

    for fname, content in files.items():
        path = os.path.join(out_dir, fname)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content.strip() + "\n")
        print(f"Wrote {path}")

if __name__ == "__main__":
    main()
