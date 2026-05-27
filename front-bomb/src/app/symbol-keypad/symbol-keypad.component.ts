import { Component, Input, inject, signal } from '@angular/core';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-symbol-keypad',
  standalone: true,
  templateUrl: './symbol-keypad.component.html',
  styleUrl: './symbol-keypad.component.scss'
})
export class SymbolKeypadComponent {

  private webSocketService = inject(WebSocketService);

  gameState = this.webSocketService.gameState;

  // Signals para el estado del módulo
  simbolosVisibles = signal<string[]>(['ぬ', 'あ', 'ゑ', 'ね']);
  ordenCorrecto = signal<string[]>(['あ', 'ぬ', 'ね', 'ゑ']);

  indiceActual = signal<number>(0);
  isResolved = signal<boolean>(false);

  presionarBoton(simbolo: string): void {
    // Si el módulo ya está resuelto, ignoramos cualquier interacción
    if (this.isResolved()) {
      return;
    }

    const currentGameState = this.gameState();
    if (!currentGameState) return;
    const roomId = currentGameState.roomId;

    const currentCorrectSymbol = this.ordenCorrecto()[this.indiceActual()];

    if (simbolo === currentCorrectSymbol) {
      // Símbolo correcto: avanzamos en la secuencia
      this.indiceActual.update(i => i + 1);

      // Verificamos si completó la secuencia
      if (this.indiceActual() === this.ordenCorrecto().length) {
        this.isResolved.set(true);
        // Ajusta el nombre del método según exista en tu WebSocketService
        this.webSocketService.resolverModulo(roomId);
      }
    } else {
      // Símbolo incorrecto: strike y reinicio
      this.webSocketService.enviarStrike(roomId);
      this.indiceActual.set(0);
    }
  }

  // Método auxiliar para la vista: determina si un botón ya fue presionado correctamente
  isBotonPresionado(simbolo: string): boolean {
    const indexInCorrectOrder = this.ordenCorrecto().indexOf(simbolo);
    return indexInCorrectOrder !== -1 && indexInCorrectOrder < this.indiceActual();
  }
}
