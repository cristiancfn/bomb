package com.cristiancfn.bomb.service;

import com.cristiancfn.bomb.model.GameSession;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class GameService {

    private final ConcurrentHashMap<String, GameSession> activeGames = new ConcurrentHashMap<>();

    public GameSession iniciarPartida(String roomId, String playerName) {
        long seed = ThreadLocalRandom.current().nextLong(1_000_000_000_000L, 10_000_000_000_000L);

        GameSession session = new GameSession(
                roomId,
                GameSession.GameStatus.IN_PROGRESS,
                seed,
                300, // timeRemainingSeconds
                0, // currentStrikes
                3, // maxStrikes
                3, // modulesCount
                new java.util.HashSet<>(), // resolvedModules
                playerName // lastActor
        );
        activeGames.put(roomId, session);
        return session;
    }

    public GameSession registrarStrike(String roomId, String playerName) {
        GameSession session = activeGames.get(roomId);
        if (session != null && session.getStatus() == GameSession.GameStatus.IN_PROGRESS) {
            session.setLastActor(playerName);
            session.setCurrentStrikes(session.getCurrentStrikes() + 1);
            if (session.getCurrentStrikes() >= session.getMaxStrikes()) {
                session.setStatus(GameSession.GameStatus.EXPLODED);
            }
        }
        return session;
    }

    public GameSession resolverModulo(String roomId, String playerName, String moduleId) {
        GameSession session = activeGames.get(roomId);
        if (session != null && session.getStatus() == GameSession.GameStatus.IN_PROGRESS) {
            session.setLastActor(playerName);
            if (moduleId != null && !moduleId.isEmpty()) {
                session.getResolvedModules().add(moduleId);
            }
            if (session.getResolvedModules().size() >= session.getModulesCount()) {
                session.setStatus(GameSession.GameStatus.DEFUSED);
            }
        }
        return session;
    }

    public GameSession forzarExplosion(String roomId, String playerName) {
        GameSession session = activeGames.get(roomId);
        if (session != null) {
            session.setLastActor(playerName);
            session.setStatus(GameSession.GameStatus.EXPLODED);
        }
        return session;
    }

}
