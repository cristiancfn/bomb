import { Component, inject } from '@angular/core';
import { WiresComponent } from '../wires/wires.component';
import { WebSocketService } from '../services/web-socket.service';
import { TimerComponent } from '../timer/timer.component';

@Component({
  selector: 'app-bomb',
  standalone: true,
  imports: [WiresComponent, TimerComponent],
  templateUrl: './bomb.component.html',
  styleUrl: './bomb.component.scss'
})
export class BombComponent {
  private webSocketService = inject(WebSocketService);
  gameState = this.webSocketService.gameState;

  tiempoAgotado(): void {
    console.log("¡EL TIEMPO LLEGÓ A CERO!");
  }
}
