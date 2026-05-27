package com.cristiancfn.bomb.controller;

import com.cristiancfn.bomb.dto.StartGamePayload;
import com.cristiancfn.bomb.model.GameSession;
import com.cristiancfn.bomb.service.GameService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class GameSyncController {

    private final GameService gameService;
    private final SimpMessagingTemplate messagingTemplate;

    public GameSyncController(GameService gameService, SimpMessagingTemplate messagingTemplate) {
        this.gameService = gameService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/start/{roomId}")
    public void startGame(@DestinationVariable String roomId, StartGamePayload payload) {
        String activeRoomId = payload != null && payload.roomId() != null ? payload.roomId() : roomId;
        GameSession session = gameService.iniciarPartida(activeRoomId);

        messagingTemplate.convertAndSend("/topic/room/" + activeRoomId, session);
    }

    @MessageMapping("/strike/{roomId}")
    public void registrarStrike(@DestinationVariable String roomId) {
        GameSession session = gameService.registrarStrike(roomId);

        if (session != null) {
            messagingTemplate.convertAndSend("/topic/room/" + roomId, session);
        }
    }

    @MessageMapping("/resolve/{roomId}")
    public void resolverModulo(@DestinationVariable String roomId) {
        GameSession session = gameService.resolverModulo(roomId);

        if (session != null) {
            messagingTemplate.convertAndSend("/topic/room/" + roomId, session);
        }
    }

    @MessageMapping("/explode/{roomId}")
    public void forzarExplosion(@DestinationVariable String roomId) {
        GameSession session = gameService.forzarExplosion(roomId);

        if (session != null) {
            messagingTemplate.convertAndSend("/topic/room/" + roomId, session);
        }
    }

}
