export type MapId = 
  | 'mirage' 
  | 'inferno' 
  | 'nuke' 
  | 'dust2' 
  | 'ancient' 
  | 'anubis' 
  | 'vertigo';

export type GrenadeType = 'smoke' | 'molotov' | 'flash' | 'he';
export type Side = 'T' | 'CT';
export type Zone = 'A' | 'Mid' | 'B';
export type ThrowTechnique = 
  | 'Jumpthrow' 
  | 'Stand & Throw' 
  | 'Run + Jumpthrow' 
  | 'Crouch + Jumpthrow' 
  | 'W + Jumpthrow';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MapItem {
  id: MapId;
  name: string;
  russianName: string;
  image: string;
  status: 'active' | 'coming_soon';
  lineupCount: number;
}

export interface Lineup {
  id: string;
  mapId: MapId;
  title: string;
  grenadeType: GrenadeType;
  side: Side;
  zone: Zone;
  startPosition: string;
  targetPosition: string;
  throwTechnique: ThrowTechnique;
  difficulty: Difficulty;
  description: string;
  proTip?: string;
  thumbnail: string;
  standingPositionImg: string;
  aimPointImg: string;
  landingImg?: string;
  tickRate: 'CS2 Subtick';
  isFavorite?: boolean;
  isLearned?: boolean;
  videoUrl?: string;
}

export interface FilterState {
  searchQuery: string;
  selectedZone: 'all' | Zone;
  selectedSide: 'all' | Side;
  selectedGrenade: 'all' | GrenadeType;
  onlyFavorites: boolean;
  onlyLearned: boolean;
}

export interface UserProfile {
  id: string | null;
  email: string | null;
  isAuthenticated: boolean;
  favorites: string[]; // Lineup IDs (stored in Supabase)
  learned: string[];   // Lineup IDs (stored in Supabase)
}

export interface TacticalPlanRole {
  roleName: string;
  playerIndex: number;
  utilityUsed: string;
  lineupRecommendation?: string;
  assignment: string;
}

export interface TacticalStep {
  timing: string;
  title: string;
  details: string;
}

export interface TacticalPlan {
  title: string;
  strategySummary: string;
  side: Side;
  zoneTarget: string;
  playerRoles: TacticalPlanRole[];
  timeline: TacticalStep[];
  contingencyTip: string;
}
