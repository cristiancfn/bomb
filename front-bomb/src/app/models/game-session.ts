export interface GameSession {
    roomId: string;
    status: 'LOBBY' | 'IN_PROGRESS' | 'DEFUSED' | 'EXPLODED';
    seed: number;
    timeRemainingSeconds: number;
    currentStrikes: number;
    maxStrikes: number;
    modulesCount: number;
    modulesResolved: number;
}