import { Scene } from '../types/movie';
import { useEffect, useRef } from 'react';

interface EmotionalGraphProps {
  scenes: Scene[];
}

export const EmotionalGraph = ({ scenes }: EmotionalGraphProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const padding = 50;
    const width = canvas.width;
    const height = canvas.height;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;

    for (let i = -10; i <= 10; i += 2) {
      const y = padding + graphHeight / 2 - (i * graphHeight) / 20;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(i.toString(), padding - 10, y + 4);
    }

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding + graphHeight / 2);
    ctx.lineTo(width - padding, padding + graphHeight / 2);
    ctx.stroke();

    if (scenes.length === 0) return;

    const stepX = graphWidth / (scenes.length - 1 || 1);

    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, '#10b981');
    gradient.addColorStop(0.5, '#64748b');
    gradient.addColorStop(1, '#ef4444');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();
    scenes.forEach((scene, index) => {
      const x = padding + index * stepX;
      const y = padding + graphHeight / 2 - (scene.emotionalScore * graphHeight) / 20;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    scenes.forEach((scene, index) => {
      const x = padding + index * stepX;
      const y = padding + graphHeight / 2 - (scene.emotionalScore * graphHeight) / 20;

      const pointGradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
      if (scene.emotionalScore >= 7) {
        pointGradient.addColorStop(0, '#10b981');
        pointGradient.addColorStop(1, '#059669');
      } else if (scene.emotionalScore >= 0) {
        pointGradient.addColorStop(0, '#3b82f6');
        pointGradient.addColorStop(1, '#2563eb');
      } else if (scene.emotionalScore >= -6) {
        pointGradient.addColorStop(0, '#f97316');
        pointGradient.addColorStop(1, '#ea580c');
      } else {
        pointGradient.addColorStop(0, '#ef4444');
        pointGradient.addColorStop(1, '#dc2626');
      }

      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = pointGradient;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Emotional Journey', width / 2, 25);

    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Scene Progression →', width / 2, height - 15);

    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Emotional Impact', 0, 0);
    ctx.restore();
  }, [scenes]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <canvas
        ref={canvasRef}
        width={1000}
        height={400}
        className="w-full"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};
