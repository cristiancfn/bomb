package com.cristiancfn.bomb.service;

import com.cristiancfn.bomb.model.GameSession;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class GameService {

    private final ConcurrentHashMap<String, GameSession> activeGames = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public GameSession iniciarPartida(String roomId) {
        long seed = ThreadLocalRandom.current().nextLong(1_000_000_000_000L, 10_000_000_000_000L);

        GameSession session = new GameSession(
                roomId,
                GameSession.GameStatus.IN_PROGRESS,
                seed,
                300, // timeRemainingSeconds
                0, // currentStrikes
                3, // maxStrikes
                3, // modulesCount
                0 // modulesResolved
        );
        activeGames.put(roomId, session);
        return session;
    }

    public GameSession registrarStrike(String roomId) {
        GameSession session = activeGames.get(roomId);
        if (session != null && session.getStatus() == GameSession.GameStatus.IN_PROGRESS) {
            session.setCurrentStrikes(session.getCurrentStrikes() + 1);
            if (session.getCurrentStrikes() >= session.getMaxStrikes()) {
                session.setStatus(GameSession.GameStatus.EXPLODED);
            }
        }
        return session;
    }

    public GameSession resolverModulo(String roomId) {
        GameSession session = activeGames.get(roomId);
        if (session != null && session.getStatus() == GameSession.GameStatus.IN_PROGRESS) {
            session.setModulesResolved(session.getModulesResolved() + 1);
            if (session.getModulesResolved().equals(session.getModulesCount())) {
                session.setStatus(GameSession.GameStatus.DEFUSED);
            }
        }
        return session;
    }

    public GameSession forzarExplosion(String roomId) {
        GameSession session = activeGames.get(roomId);
        if (session != null) {
            session.setStatus(GameSession.GameStatus.EXPLODED);
        }
        return session;
    }

}
