import { useRef, useEffect } from "react";

import "./style.css";

const Heart = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const trails = [];
    const path = [];

    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    const count = 48;
    const stop = 6.3;
    const math = Math;
    const random = math.random;
    const cos = math.cos;
    const sin = math.sin;
    const pow = math.pow;
    const sqrt = math.sqrt;

    const scale = 2;

    // Heart path generation
    for (let i = 0; i < stop; i += stop/count) {
      path.push([
        width / 2 + scale * 180 * pow(sin(i), 3),
        height * 0.375 + scale * 10 * (-(15 * cos(i) - 5 * cos(2 * i) - 2 * cos(3 * i) - cos(4 * i)))
      ]);
    }

    // Initialize trails
    for (let i = 0; i < count; i++) {
      const x = random() * width;
      const y = random() * height;
      const hue = i / count * 80 + 280;
      const saturation = random() * 40 + 60;
      const brightness = random() * 60 + 20;

      const trail = [];

      for (let k = 0; k < count; k++) {
        trail[k] = {
          x: x,
          y: y,
          X: 0,
          Y: 0,
          R: (1 - k / count) + 1,
          S: random() + 1,
          q: ~~(random() * count),
          D: i % 2 * 2 - 1,
          F: random() * 0.2 + 0.7,
          f: `hsla(${~~hue},${~~saturation}%,${~~brightness}%,0.5)`
        };
      }

      trails.push(trail);
    }

    const render = (p) => {
      ctx.fillStyle = p.f;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.R, 0, stop, true);
      ctx.closePath();
      ctx.fill();
    };

    const loop = () => {
      ctx.fillStyle = "#01080f";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < count; i++) {
        const trail = trails[i];
        const head = trail[0];
        const target = path[head.q];

        const dx = head.x - target[0];
        const dy = head.y - target[1];
        const dist = sqrt(dx * dx + dy * dy);

        if (dist < 10) {
          if (random() > 0.95) {
            head.q = ~~(random() * count);
          } else {
            if (random() > 0.99) head.D *= -1;
            head.q = (head.q + head.D + count) % count;
          }
        }

        head.X += (-dx / dist) * head.S;
        head.Y += (-dy / dist) * head.S;
        head.x += head.X;
        head.y += head.Y;
        render(head);

        head.X *= head.F;
        head.Y *= head.F;

        for (let k = 0; k < count - 1; k++) {
          const curr = trail[k];
          const next = trail[k + 1];
          next.x -= (next.x - curr.x) * 0.7;
          next.y -= (next.y - curr.y) * 0.7;
          render(next);
        }
      }

      requestAnimationFrame(loop);
    };

    loop();
  }, []);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default Heart;