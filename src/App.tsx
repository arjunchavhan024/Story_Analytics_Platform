import { useState } from 'react';
import { Film, Download, BarChart3, Sparkles } from 'lucide-react';
import { Scene } from './types/movie';
import { shawshankRedemption } from './data/shawshankData';
import { SceneCard } from './components/SceneCard';
import { EmotionalGraph } from './components/EmotionalGraph';
import { generatePDF } from './utils/pdfExport';

function App() {
  const [scenes, setScenes] = useState<Scene[]>(shawshankRedemption.scenes);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null) return;

    const newScenes = [...scenes];
    const [draggedScene] = newScenes.splice(draggedIndex, 1);
    newScenes.splice(dropIndex, 0, draggedScene);

    const reorderedScenes = newScenes.map((scene, index) => ({
      ...scene,
      order: index + 1
    }));

    setScenes(reorderedScenes);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleExport = () => {
    generatePDF(shawshankRedemption.title, scenes);
  };

  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
  const avgEmotionalScore = (scenes.reduce((sum, scene) => sum + scene.emotionalScore, 0) / scenes.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-3 rounded-xl shadow-lg">
                <Film className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
                  Story Analytics Platform
                </h1>
                <p className="text-slate-600 mt-1">Professional Storytelling Analysis & Visualization</p>
              </div>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-slate-700" />
              <h2 className="text-2xl font-bold text-slate-800">
                {shawshankRedemption.title}
              </h2>
            </div>
            <div className="flex gap-8 text-sm">
              <div>
                <span className="text-slate-500 font-medium">Total Scenes:</span>
                <span className="ml-2 text-slate-800 font-semibold">{scenes.length}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Runtime:</span>
                <span className="ml-2 text-slate-800 font-semibold">{totalDuration} minutes</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Avg. Emotional Impact:</span>
                <span className="ml-2 text-slate-800 font-semibold">{avgEmotionalScore}/10</span>
              </div>
            </div>
          </div>
        </header>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-slate-700" />
            <h3 className="text-xl font-bold text-slate-800">Emotional Journey Visualization</h3>
          </div>
          <EmotionalGraph scenes={scenes} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800">Scene Flow Timeline</h3>
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Positive</span>
              </div>
              <div className="w-px h-4 bg-slate-300 mx-2" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-500" />
                <span>Neutral</span>
              </div>
              <div className="w-px h-4 bg-slate-300 mx-2" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Negative</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border-2 border-dashed border-slate-300">
            <p className="text-sm text-slate-600 mb-4 font-medium">
              Drag and drop scenes to reorder the story flow
            </p>

            <div className="space-y-3">
              {scenes.map((scene, index) => (
                <div
                  key={scene.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`transition-all duration-200 ${
                    dragOverIndex === index && draggedIndex !== index
                      ? 'transform scale-105 ring-2 ring-slate-400'
                      : ''
                  }`}
                >
                  <SceneCard
                    scene={scene}
                    isDragging={draggedIndex === index}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-slate-500 text-sm pb-8">
          <p>Professional Storytelling Analytics • Drag & Drop • Real-time Visualization • Export Ready</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
