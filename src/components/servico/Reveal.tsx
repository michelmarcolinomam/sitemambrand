import type { ReactNode } from "react";
import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Reveal em máscara: o conteúdo sobe por trás de um recorte.
 * O padding vertical no clip evita que descidas de letras itálicas (g, ç, j,
 * caudas) sejam cortadas — o recorte é compensado por margem negativa.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span
      className={`block overflow-hidden pb-[0.14em] -mb-[0.14em] ${className ?? ""}`}
    >
      <motion.span
        className="block"
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 0.85, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Bloco que sobe + aparece (grids, cartões, parágrafos).
 * Sempre termina visível (opacity 1) mesmo se a animação não disparar.
 */
export function Rise({
  children,
  delay = 0,
  y = 32,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
