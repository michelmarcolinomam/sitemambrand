import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;
// Duração total do traço se desenhando. Cada fase entra no instante em que a
// linha passa pelo ponto dela — daí o desenho ser LINEAR (tempo ∝ comprimento).
const DRAW_SEC = 6;

type Node = {
  cx: number;
  cy: number;
  number?: string;
  label?: string;
  desc?: string;
};

// Curva suave (mesma técnica da seção da home): cúbicas com tangente horizontal
// em cada nó — plateaus ficam planos, subidas/descidas ficam em S suave.
function buildSmoothPath(nodes: Node[]) {
  let d = `M ${nodes[0].cx} ${nodes[0].cy}`;
  for (let i = 1; i < nodes.length; i++) {
    const p = nodes[i - 1];
    const c = nodes[i];
    const mx = p.cx + (c.cx - p.cx) / 2;
    d += ` C ${mx} ${p.cy}, ${mx} ${c.cy}, ${c.cx} ${c.cy}`;
  }
  return d;
}

/**
 * Gráfico do Ciclo de Marca que se CONSTRÓI: a curva se desenha da esquerda
 * para a direita e, conforme a linha alcança cada ponto, a fase daquele ponto
 * aparece em sincronia. A forma segue o desenho do Michel: começo baixo e
 * quase reto (Introdução→Crescimento), subida (→Platô), platô alto e plano
 * (→Declínio), queda ao vale (→Reestruturação) e retomada subindo para um
 * ponto final sem rótulo — o próximo ciclo recomeçando.
 *
 * Sincronismo medido da geometria real do path (getPointAtLength). Um único
 * IntersectionObserver observa o container HTML (IO em <circle>/<path> é
 * não-confiável). Dispara uma vez; respeita prefers-reduced-motion.
 */
export function CicloAnimatedChart({ nodes }: { nodes: Node[] }) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-12%" });
  const play = inView && !reduced;

  const pathD = useMemo(() => buildSmoothPath(nodes), [nodes]);
  const labeled = useMemo(
    () => nodes.map((n, i) => ({ ...n, i })).filter((n) => n.label),
    [nodes]
  );

  // Fração (0–1) do comprimento do traço em que cada nó entra.
  const [fracs, setFracs] = useState<number[]>(() =>
    nodes.map((_, i) => (nodes.length > 1 ? i / (nodes.length - 1) : 0))
  );

  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const total = p.getTotalLength();
    if (!total) return;

    const STEPS = 700;
    const samples: Array<[number, number, number]> = [];
    for (let i = 0; i <= STEPS; i++) {
      const l = (total * i) / STEPS;
      const pt = p.getPointAtLength(l);
      samples.push([pt.x, pt.y, l]);
    }

    const measured = nodes.map(({ cx, cy }) => {
      let best = Infinity;
      let bestLen = 0;
      for (const [x, y, l] of samples) {
        const d = (x - cx) ** 2 + (y - cy) ** 2;
        if (d < best) {
          best = d;
          bestLen = l;
        }
      }
      return bestLen / total;
    });
    setFracs(measured);
  }, [pathD, nodes]);

  const built = reduced || play;

  return (
    <div ref={wrapRef}>
      <div className="w-full overflow-hidden">
        <svg
          viewBox="0 0 1000 230"
          className="block h-auto w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <motion.path
            ref={pathRef}
            d={pathD}
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            fill="none"
            className="text-foreground/55"
            initial={{ pathLength: reduced ? 1 : 0 }}
            animate={{ pathLength: built ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : DRAW_SEC, ease: "linear" }}
          />
          {nodes.map((n, i) => (
            <motion.circle
              key={i}
              cx={n.cx}
              cy={n.cy}
              r="6"
              strokeWidth="0"
              className="fill-foreground"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.3 }}
              animate={{ opacity: built ? 1 : 0, scale: built ? 1 : 0.3 }}
              transition={{
                duration: reduced ? 0 : 0.35,
                delay: play ? (fracs[i] ?? 0) * DRAW_SEC : 0,
                ease: EASE,
              }}
            />
          ))}
        </svg>
      </div>

      {/* labels — legenda sincronizada: cada fase acende quando o traço a alcança */}
      <ol className="grid grid-cols-5">
        {labeled.map((n) => (
          <motion.li
            key={n.number}
            className="px-2 md:px-3"
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 12 }}
            animate={{ opacity: built ? 1 : 0, y: built ? 0 : 12 }}
            transition={{
              duration: reduced ? 0 : 0.6,
              delay: play ? (fracs[n.i] ?? 0) * DRAW_SEC + 0.12 : 0,
              ease: EASE,
            }}
          >
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {n.number}
            </div>
            <h3 className="mt-2 font-display text-[clamp(1rem,1.8vw,1.5rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
              {n.label}
            </h3>
            <p className="mt-2 max-w-[18ch] text-[clamp(0.75rem,0.9vw,0.875rem)] leading-[1.55] text-muted-foreground">
              {n.desc}
            </p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
