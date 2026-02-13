import { motion } from 'framer-motion';
import { Heart } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

interface HeartParticle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<HeartParticle[]>([]);

  useEffect(() => {
    const particleCount = window.innerWidth < 768 ? 8 : 15;
    const particles: HeartParticle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 16 + Math.random() * 24,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
    }));
    setHearts(particles);
  }, []);

  return (
    <div className="floating-hearts-bg">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: '100vh', opacity: 0, rotate: 0 }}
          animate={{
            y: '-100vh',
            opacity: [0, 1, 1, 0],
            rotate: 360,
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: `${heart.x}%`,
            bottom: 0,
          }}
        >
          <Heart
            size={heart.size}
            weight="fill"
            className="text-primary/20"
          />
        </motion.div>
      ))}
    </div>
  );
}
