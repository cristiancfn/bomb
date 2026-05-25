package com.cristiancfn.bomb.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.cristiancfn.bomb.dto.StartGamePayload;
import com.cristiancfn.bomb.model.GameSession;

import java.util.Random;

@Controller
public class GameSyncController {

    private final Random random = new Random();

    @MessageMapping("/start/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public GameSession startGame(@DestinationVariable String roomId, StartGamePayload payload) {
        // En un caso real, el roomId probablemente vendría del payload o de la URL. 
        // Usamos la variable de destino para asegurar el ruteo dinámico con @SendTo
        String activeRoomId = payload.roomId() != null ? payload.roomId() : roomId;
        
        return new GameSession(
                activeRoomId,
                GameSession.GameStatus.IN_PROGRESS,
                random.nextLong(),
                300,
                0,
                3,
                3,
                0
        );
    }
}