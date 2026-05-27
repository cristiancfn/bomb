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

  constructor() {
    // Escuchamos cuando la conexión WebSocket se complete exitosamente
    effect(() => {
      if (this.webSocketService.isConnected()) {
        const currentRoom = this.roomId().trim();
        
        // Una vez conectados, enviamos el comando para iniciar el juego
        this.webSocketService.iniciarJuego(currentRoom);
        
        // Y navegamos a la vista de la bomba
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

      // Iniciamos el proceso de conexión asíncrono
      // (El effect de arriba se encargará del resto cuando termine)
      this.webSocketService.conectar(currentRoom);
    }
  }
}
