import { Scene } from '../types/movie';

export const generatePDF = (movieTitle: string, scenes: Scene[]) => {
  const content = `
MOVIE STORY ANALYTICS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title: ${movieTitle}
Generated: ${new Date().toLocaleString()}
Total Scenes: ${scenes.length}
Total Duration: ${scenes.reduce((sum, s) => sum + s.duration, 0)} minutes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCENE BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${scenes.map(scene => `
SCENE ${scene.order}: ${scene.title}
${'─'.repeat(60)}

Description: ${scene.description}

Duration: ${scene.duration} minutes
Emotional Score: ${scene.emotionalScore > 0 ? '+' : ''}${scene.emotionalScore}/10

Emotional Category: ${getEmotionLabel(scene.emotionalScore)}

Visual Impact: ${getVisualIndicator(scene.emotionalScore)}

`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EMOTIONAL ANALYSIS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Average Emotional Score: ${(scenes.reduce((sum, s) => sum + s.emotionalScore, 0) / scenes.length).toFixed(2)}

Highest Peak: Scene ${scenes.reduce((max, s) => s.emotionalScore > max.emotionalScore ? s : max).order} - "${scenes.reduce((max, s) => s.emotionalScore > max.emotionalScore ? s : max).title}"
Score: +${scenes.reduce((max, s) => s.emotionalScore > max.emotionalScore ? s : max).emotionalScore}

Lowest Point: Scene ${scenes.reduce((min, s) => s.emotionalScore < min.emotionalScore ? s : min).order} - "${scenes.reduce((min, s) => s.emotionalScore < min.emotionalScore ? s : min).title}"
Score: ${scenes.reduce((min, s) => s.emotionalScore < min.emotionalScore ? s : min).emotionalScore}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EMOTIONAL JOURNEY VISUALIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${generateASCIIGraph(scenes)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STORY STRUCTURE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Act Distribution:
Act I (Setup): Scenes 1-${Math.floor(scenes.length / 3)}
Act II (Confrontation): Scenes ${Math.floor(scenes.length / 3) + 1}-${Math.floor(scenes.length * 2 / 3)}
Act III (Resolution): Scenes ${Math.floor(scenes.length * 2 / 3) + 1}-${scenes.length}

Emotional Volatility: ${calculateVolatility(scenes).toFixed(2)}
(Measures how dramatically emotions shift between scenes)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

End of Report
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${movieTitle.replace(/\s+/g, '_')}_Analytics_Report.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const getEmotionLabel = (score: number): string => {
  if (score >= 7) return 'Euphoric/Triumphant';
  if (score >= 4) return 'Uplifting/Positive';
  if (score >= 1) return 'Hopeful/Optimistic';
  if (score >= -3) return 'Neutral/Contemplative';
  if (score >= -6) return 'Tense/Challenging';
  return 'Devastating/Dark';
};

const getVisualIndicator = (score: number): string => {
  const normalized = Math.round((score + 10) / 2);
  const filled = '█'.repeat(normalized);
  const empty = '░'.repeat(10 - normalized);
  return `[${filled}${empty}] ${score > 0 ? '+' : ''}${score}/10`;
};

const generateASCIIGraph = (scenes: Scene[]): string => {
  const height = 21;
  const width = Math.min(scenes.length * 3, 70);
  const grid: string[][] = Array(height).fill(0).map(() => Array(width).fill(' '));

  for (let i = 0; i < height; i++) {
    grid[i][0] = '│';
  }

  for (let i = 0; i < width; i++) {
    grid[height - 1][i] = '─';
  }
  grid[height - 1][0] = '└';

  grid[0][0] = '+10';
  grid[Math.floor(height / 2)][0] = ' 0 ';
  grid[height - 2][0] = '-10';

  scenes.forEach((scene, index) => {
    const x = Math.floor((index / (scenes.length - 1)) * (width - 5)) + 3;
    const y = Math.floor(height / 2 - (scene.emotionalScore * (height - 2) / 20));

    if (y >= 0 && y < height && x >= 0 && x < width) {
      grid[y][x] = '●';

      if (index > 0 && index < scenes.length) {
        const prevX = Math.floor(((index - 1) / (scenes.length - 1)) * (width - 5)) + 3;
        const prevY = Math.floor(height / 2 - (scenes[index - 1].emotionalScore * (height - 2) / 20));

        const steps = Math.abs(x - prevX) + Math.abs(y - prevY);
        for (let step = 0; step <= steps; step++) {
          const t = step / steps;
          const interpX = Math.floor(prevX + (x - prevX) * t);
          const interpY = Math.floor(prevY + (y - prevY) * t);
          if (interpY >= 0 && interpY < height && interpX >= 0 && interpX < width) {
            if (grid[interpY][interpX] === ' ') {
              grid[interpY][interpX] = '·';
            }
          }
        }
      }
    }
  });

  return grid.map(row => row.join('')).join('\n');
};

const calculateVolatility = (scenes: Scene[]): number => {
  if (scenes.length < 2) return 0;

  let totalChange = 0;
  for (let i = 1; i < scenes.length; i++) {
    totalChange += Math.abs(scenes[i].emotionalScore - scenes[i - 1].emotionalScore);
  }

  return totalChange / (scenes.length - 1);
};
