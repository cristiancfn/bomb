package com.cristiancfn.bomb.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameSession {

    private String roomId;
    private GameStatus status;
    private Long seed;
    private Integer timeRemainingSeconds;
    private Integer currentStrikes;
    private Integer maxStrikes;
    private Integer modulesCount;
    private Integer modulesResolved;
    private String lastActor;

    public enum GameStatus {
        LOBBY,
        IN_PROGRESS,
        DEFUSED,
        EXPLODED
    }
}
