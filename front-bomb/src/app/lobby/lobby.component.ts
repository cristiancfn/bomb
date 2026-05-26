import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
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
  private router = inject(Router);

  roomId = signal<string>('SALA-XYZ');
  gameState = this.webSocketService.gameState;

  constructor() {
    // Efecto reactivo: escucha cambios en gameState automáticamente
    effect(() => {
      const state = this.gameState();

      // Si recibimos estado y el juego pasó a estar en progreso, navegamos a la bomba
      if (state && state.status === 'IN_PROGRESS') {
        this.router.navigate(['/bomba']);
      }
    });
  }

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
