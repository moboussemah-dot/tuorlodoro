/**
 * EggPackArt — vector egg-carton rendering used on the shop cards.
 *
 * Photographs of the packs inevitably show a fixed, often wrong, number of
 * eggs; this drawing guarantees the visible count always matches the pack
 * (6 / 12 / 30) and re-colours the eggs live when the customer switches
 * Bianche / Miste / Marroni. Drawn in the site's editorial warm-paper +
 * ink language: a kraft carton, white shells and brown #7c4a21 eggs.
 */

import type { EggMix } from "@/lib/cart";

export type EggColor = "white" | "brown";

const LAYOUT: Record<number, { cols: number; rows: number }> = {
  6: { cols: 3, rows: 2 },
  12: { cols: 4, rows: 3 },
  30: { cols: 6, rows: 5 },
};

/* Palette (kept warm to sit on the paper-white card surface). */
const CARD_BOARD = "#ede0c4";
const CARD_BOARD_RIM = "rgba(48, 34, 14, 0.28)";
const WHITE_SHELL = "#fffef7";
const WHITE_LINE = "rgba(44, 34, 22, 0.5)";
const BROWN_SHELL = "#7c4a21";
const BROWN_LINE = "#5a3513";
const EGG_SHADOW = "rgba(58, 38, 12, 0.14)";

/* Egg bed inside the 400×320 viewBox. */
const BED = { x: 26, y: 34, w: 348, h: 252 };

/**
 * Build the colour list for a pack. Mixed packs (white === brown, always the
 * case for our 6/12/30 cartons) come out as a natural checkerboard; fully
 * white or brown packs are uniform.
 */
function eggColors(white: number, brown: number): EggColor[] {
  if (brown === 0) return Array.from({ length: white }, () => "white" as const);
  if (white === 0) return Array.from({ length: brown }, () => "brown" as const);
  // Equal split → checkerboard.
  return Array.from({ length: white + brown }, (_, i) => (i % 2 === 0 ? "white" : "brown"));
}

/** Small deterministic wobble so eggs look hand-placed, never pasted. */
function jitter(seed: number, max: number): number {
  const v = Math.sin(seed * 12.9898) * 43758.5453;
  return (v - Math.floor(v) - 0.5) * 2 * max;
}

interface EggPackArtProps {
  eggs: number;
  mix: EggMix;
  className?: string;
}

export function EggPackArt({ eggs, mix, className }: EggPackArtProps) {
  const layout = LAYOUT[eggs] ?? { cols: 3, rows: Math.ceil(eggs / 3) };
  const { cols, rows } = layout;

  const cellW = BED.w / cols;
  const cellH = BED.h / rows;
  const rx = Math.min(cellW * 0.3, cellH * 0.32);
  const ry = cellH * 0.42;

  const colors = eggColors(mix.white, mix.brown);
  const cells: Array<{ x: number; y: number; color: EggColor }> = [];

  let i = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const color = colors[(row + col) % colors.length] ?? "brown";
      cells.push({
        x: BED.x + (col + 0.5) * cellW + jitter(i, cellW * 0.05),
        y: BED.y + (row + 0.5) * cellH + jitter(i + 7, cellH * 0.05),
        color,
      });
      i++;
    }
  }

  const white = mix.white;
  const brown = mix.brown;
  const label = `${eggs} uova — ${white} bianche, ${brown} marroni`;

  return (
    <svg
      viewBox="0 0 400 320"
      role="img"
      aria-label={label}
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Kraft carton */}
      <rect x="10" y="10" width="380" height="300" rx="24" fill={CARD_BOARD} />
      <rect
        x="10"
        y="10"
        width="380"
        height="300"
        rx="24"
        fill="none"
        stroke={CARD_BOARD_RIM}
        strokeWidth="2.5"
      />
      {/* Faint moulded-cell guides behind the eggs */}
      {Array.from({ length: rows + 1 }).map((_, r) => (
        <line
          key={`hg-${r}`}
          x1={BED.x}
          y1={BED.y + r * cellH}
          x2={BED.x + BED.w}
          y2={BED.y + r * cellH}
          stroke="rgba(48, 34, 14, 0.07)"
          strokeWidth="1.5"
        />
      ))}
      {Array.from({ length: cols + 1 }).map((_, c) => (
        <line
          key={`vg-${c}`}
          x1={BED.x + c * cellW}
          y1={BED.y}
          x2={BED.x + c * cellW}
          y2={BED.y + BED.h}
          stroke="rgba(48, 34, 14, 0.07)"
          strokeWidth="1.5"
        />
      ))}

      {/* Eggs */}
      {cells.map(({ x, y, color }, idx) => {
        const whiteEgg = color === "white";
        return (
          <g key={idx}>
            {/* ground shadow */}
            <ellipse cx={x} cy={y + ry * 0.55} rx={rx * 0.8} ry={ry * 0.24} fill={EGG_SHADOW} />
            {/* shell */}
            <ellipse
              cx={x}
              cy={y}
              rx={rx}
              ry={ry}
              fill={whiteEgg ? WHITE_SHELL : BROWN_SHELL}
              stroke={whiteEgg ? WHITE_LINE : BROWN_LINE}
              strokeWidth={whiteEgg ? 1.8 : 2}
            />
            {/* sheen */}
            <ellipse
              cx={x - rx * 0.28}
              cy={y - ry * 0.42}
              rx={rx * 0.34}
              ry={ry * 0.26}
              fill="#ffffff"
              opacity={whiteEgg ? 0.9 : 0.24}
            />
          </g>
        );
      })}
    </svg>
  );
}
