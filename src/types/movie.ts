export interface Scene {
  id: string;
  title: string;
  description: string;
  duration: number;
  emotionalScore: number;
  order: number;
}

export interface MovieData {
  title: string;
  scenes: Scene[];
}
