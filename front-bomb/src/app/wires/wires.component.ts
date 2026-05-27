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
    if (this.isResolved()) {
      return;
    }

    const currentGameState = this.gameState();

    // Si no hay estado aún, abortamos
    if (!currentGameState) return;

    const roomId = currentGameState.roomId;

    // Extracción de variables para la lógica
    const currentStrikes = currentGameState.currentStrikes;
    // Utilizamos Math.abs() en caso de que la seed sea negativa
    const seedStr = Math.abs(currentGameState.seed).toString();
    const lastDigit = parseInt(seedStr.charAt(seedStr.length - 1), 10);
    const firstDigit = parseInt(seedStr.charAt(0), 10);

    let correctCableId: number;
    const isLastDigitOdd = lastDigit % 2 !== 0;

    // Lógica condicional estricta en cascada
    if (currentStrikes > 0 && isLastDigitOdd) {
      correctCableId = 4; // Blanco
    } else if (firstDigit > 5) {
      correctCableId = 5; // Negro
    } else if (lastDigit === 0 || lastDigit === 2 || lastDigit === 4) {
      correctCableId = 2; // Azul
    } else {
      correctCableId = 1; // Rojo
    }

    // Resolución del módulo
    if (id === correctCableId) {
      this.isResolved.set(true);
      this.webSocketService.resolverModulo(roomId);
    } else {
      this.webSocketService.enviarStrike(roomId);
    }
  }
}
