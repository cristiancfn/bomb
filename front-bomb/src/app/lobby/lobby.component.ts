import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss'
})
export class LobbyComponent {
  roomId = signal<string>('SALA-XYZ');

  // Nuevo signal local
  nombreJugador = signal<string>('');

  private webSocketService = inject(WebSocketService);
  private router = inject(Router);

  // Exponemos las variables del servicio al template
  isConnected = this.webSocketService.isConnected;
  gameState = this.webSocketService.gameState;

  constructor() {
    // Escuchamos los cambios en el estado del juego
    effect(() => {
      const state = this.gameState();
      // Si el juego pasa a IN_PROGRESS, todas las pestañas conectadas navegarán a la vez
      if (state && state.status === 'IN_PROGRESS') {
        this.router.navigate(['/bomba']);
      }
    });
  }

  conectar(): void {
    const currentRoom = this.roomId().trim();
    if (currentRoom) {
      // Tomamos el nombre, o asignamos "Anónimo" por defecto
      const nombre = this.nombreJugador().trim() || 'Operario Anónimo';
      // Lo guardamos en el Signal global del servicio
      this.webSocketService.playerName.set(nombre);

      // Iniciamos el proceso de conexión a la sala de espera
      this.webSocketService.conectar(currentRoom);
    }
  }

  iniciar(): void {
    const currentRoom = this.roomId().trim();
    if (currentRoom && this.isConnected()) {
      // Un solo operario presiona "iniciar" y el backend cambiará el estado para todos
      this.webSocketService.iniciarJuego(currentRoom);
    }
  }
}
