import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Wire } from '../models/wire';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-wires',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wires.component.html',
  styleUrl: './wires.component.scss'
})
export class WiresComponent {
  private webSocketService = inject(WebSocketService);

  gameState = this.webSocketService.gameState;
  isResolved = signal<boolean>(false);

  cables = signal<Wire[]>([
    { id: 1, colorClass: 'cable-rojo', isCut: false },
    { id: 2, colorClass: 'cable-azul', isCut: false },
    { id: 3, colorClass: 'cable-amarillo', isCut: false },
    { id: 4, colorClass: 'cable-blanco', isCut: false },
    { id: 5, colorClass: 'cable-negro', isCut: false }
  ]);

  cortarCable(id: number): void {
    // Si el módulo ya fue resuelto, evitamos más acciones
    if (this.isResolved()) return;

    const currentGameState = this.gameState();
    if (!currentGameState) return;

    // Actualizamos inmutablemente visualizando el corte
    this.cables.update(currentCables =>
      currentCables.map(cable =>
        cable.id === id && !cable.isCut ? { ...cable, isCut: true } : cable
      )
    );

    const roomId = currentGameState.roomId;

    // LÓGICA DE PRUEBA: El cable correcto siempre es el último
    const cablesList = this.cables();
    const lastCableId = cablesList[cablesList.length - 1].id;

    if (id === lastCableId) {
      this.webSocketService.resolverModulo(roomId);
      this.isResolved.set(true);
    } else {
      this.webSocketService.enviarStrike(roomId);
    }
  }
}
