export interface UserGame {
  id: number;
  userId: number;
  gameId: number;
  clasificationId: number;
  playerTag: string;
  isActive: boolean;
  game: Game;
  clasification: Clasification;
}

export interface Game {
  banner: string;
  description: string;
  id: number;
  isActive: boolean;
  name: string;
  slug: string;
  thumbnail: string;
  gameRoles: GameRole[];
}
export interface GameRole {
  image: string;
  name: string;
  isActive: boolean;
  description: string;
  id: number;
}
export interface Clasification {
  description: string;
  id: number;
  image: string;
  isActive: boolean;
  slug: string;
  name: string;
}