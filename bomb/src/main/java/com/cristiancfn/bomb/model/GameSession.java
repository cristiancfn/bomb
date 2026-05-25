package com.cristiancfn.bomb.model;

public record GameSession(
        String roomId,
        GameStatus status,
        Long seed,
        Integer timeRemainingSeconds,
        Integer currentStrikes,
        Integer maxStrikes,
        Integer modulesCount,
        Integer modulesResolved
) {
    public enum GameStatus {
        LOBBY,
        IN_PROGRESS,
        DEFUSED,
        EXPLODED
    }
}