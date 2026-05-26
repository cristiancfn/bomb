import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss'
})
export class LobbyComponent {
  private webSocketService = inject(WebSocketService);

  // Signal reactivo para vincular el input (valor por defecto "SALA-XYZ")
  roomId = signal<string>('SALA-XYZ');

  // Exponemos el estado del juego desde el servicio para leerlo en el template
  gameState = this.webSocketService.gameState;

  conectar(): void {
    const currentRoomId = this.roomId();
    if (currentRoomId.trim()) {
      this.webSocketService.conectar(currentRoomId);
    }
  }

  iniciar(): void {
    const currentRoomId = this.roomId();
    if (currentRoomId.trim()) {
      this.webSocketService.iniciarJuego(currentRoomId);
    }
  }
}
