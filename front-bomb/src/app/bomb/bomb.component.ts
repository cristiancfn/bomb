import { Component, inject } from '@angular/core';
import { WiresComponent } from '../wires/wires.component';
import { WebSocketService } from '../services/web-socket.service';
import { TimerComponent } from '../timer/timer.component';
import { SymbolKeypadComponent } from '../symbol-keypad/symbol-keypad.component';
import { SimonSaysComponent } from "../simon-says/simon-says.component";

@Component({
  selector: 'app-bomb',
  standalone: true,
  imports: [WiresComponent, TimerComponent, SymbolKeypadComponent, SimonSaysComponent],
  templateUrl: './bomb.component.html',
  styleUrl: './bomb.component.scss'
})
export class BombComponent {
  private webSocketService = inject(WebSocketService);

  // Signal con el estado actual del juego
  gameState = this.webSocketService.gameState;

  tiempoAgotado(): void {
    console.log("¡EL TIEMPO LLEGÓ A CERO!");

    // Obtenemos el valor actual del Signal
    const currentState = this.gameState();

    // Si existe un estado y tenemos el roomId, enviamos la señal de detonación
    if (currentState && currentState.roomId) {
      this.webSocketService.forzarExplosion(currentState.roomId);
    }
  }
}
