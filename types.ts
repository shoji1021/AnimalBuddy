
export interface Pet {
  name: string;
  animal: ZodiacAnimal;
  birthDate: string; // ISO string
  lastFed: string; // ISO string
  status: 'HAPPY' | 'SICK' | 'BEDRIDDEN' | 'ETERNAL';
}

export type ZodiacAnimal = 'Rat' | 'Ox' | 'Tiger' | 'Rabbit' | 'Dragon' | 'Snake' | 'Horse' | 'Goat' | 'Monkey' | 'Rooster' | 'Dog' | 'Pig';

export type GameState = 'SELECTING' | 'PLAYING' | 'END_OF_LIFE' | 'GAMEOVER';

export interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
    groundingMetadata?: any;
}
