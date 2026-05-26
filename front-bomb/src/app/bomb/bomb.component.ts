import { Component, inject } from '@angular/core';
import { WiresComponent } from '../wires/wires.component';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-bomb',
  standalone: true,
  imports: [WiresComponent],
  templateUrl: './bomb.component.html',
  styleUrl: './bomb.component.scss'
})
export class BombComponent {
  private webSocketService = inject(WebSocketService);
  gameState = this.webSocketService.gameState;
}
