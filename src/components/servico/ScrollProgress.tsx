import { motion, useScroll, useSpring } from "motion/react";

/**
 * Barra fina de progresso de leitura, fixa no topo (acima da Navbar).
 * Near-black sobre branco — discreta, mas dá sensação de “documento vivo”.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-foreground"
      aria-hidden
    />
  );
}
