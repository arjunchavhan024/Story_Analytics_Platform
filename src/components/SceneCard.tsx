import { GripVertical, Clock } from 'lucide-react';
import { Scene } from '../types/movie';

interface SceneCardProps {
  scene: Scene;
  isDragging: boolean;
}

export const SceneCard = ({ scene, isDragging }: SceneCardProps) => {
  const getEmotionColor = (score: number) => {
    if (score >= 7) return 'bg-emerald-500';
    if (score >= 4) return 'bg-green-500';
    if (score >= 1) return 'bg-blue-500';
    if (score >= -3) return 'bg-slate-500';
    if (score >= -6) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getEmotionLabel = (score: number) => {
    if (score >= 7) return 'Euphoric';
    if (score >= 4) return 'Uplifting';
    if (score >= 1) return 'Hopeful';
    if (score >= -3) return 'Neutral';
    if (score >= -6) return 'Tense';
    return 'Devastating';
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 border-2 border-transparent hover:border-slate-300 transition-all ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="cursor-grab active:cursor-grabbing pt-1">
          <GripVertical className="w-5 h-5 text-slate-400" />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-500">
                  Scene {scene.order}
                </span>
                <div className={`h-2 w-2 rounded-full ${getEmotionColor(scene.emotionalScore)}`} />
              </div>
              <h3 className="font-semibold text-slate-800 text-lg">
                {scene.title}
              </h3>
            </div>
          </div>

          <p className="text-slate-600 text-sm mb-3 leading-relaxed">
            {scene.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">{scene.duration} min</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600">
                {getEmotionLabel(scene.emotionalScore)}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getEmotionColor(scene.emotionalScore)}`}>
                {scene.emotionalScore > 0 ? '+' : ''}{scene.emotionalScore}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
