import { Component, inject, signal, computed } from '@angular/core';
import { WebSocketService } from '../services/web-socket.service';

const COLORES = ['ROJO', 'AZUL', 'VERDE', 'AMARILLO'];

@Component({
  selector: 'app-simon-says',
  standalone: true,
  templateUrl: './simon-says.component.html',
  styleUrl: './simon-says.component.scss'
})
export class SimonSaysComponent {
  private webSocketService = inject(WebSocketService);
  gameState = this.webSocketService.gameState;

  // Variables auxiliares para la plantilla
  coloresBase = COLORES;

  // Signals de estado
  isResolved = signal(false);
  isFlashing = signal(false);
  indiceUsuario = signal(0);
  colorActivo = signal<string | null>(null);

  // Computamos la secuencia original basada en los dígitos del seed
  secuenciaOriginal = computed(() => {
    const seed = this.gameState()?.seed || 0;
    // Nos aseguramos de tener al menos 4 caracteres numéricos
    const seedStr = Math.abs(seed).toString().padEnd(4, '0');
    const digitos = seedStr.substring(0, 4).split('').map(Number);

    // Mapeamos cada dígito a uno de los 4 colores base
    return digitos.map(digito => COLORES[digito % 4]);
  });

  // Computamos la secuencia correcta (la traducida) que el jugador debe presionar
  secuenciaCorrecta = computed(() => {
    const seed = this.gameState()?.seed || 0;
    const residuo = Math.abs(seed % 6);

    const mapas: Record<number, Record<string, string>> = {
      0: { ROJO: 'AZUL', AZUL: 'VERDE', VERDE: 'AMARILLO', AMARILLO: 'ROJO' },
      1: { ROJO: 'AMARILLO', AZUL: 'ROJO', VERDE: 'AZUL', AMARILLO: 'VERDE' },
      2: { ROJO: 'VERDE', AZUL: 'AMARILLO', VERDE: 'ROJO', AMARILLO: 'AZUL' },
      3: { ROJO: 'ROJO', AZUL: 'VERDE', VERDE: 'AMARILLO', AMARILLO: 'AZUL' },
      4: { ROJO: 'AMARILLO', AZUL: 'AZUL', VERDE: 'ROJO', AMARILLO: 'VERDE' },
      5: { ROJO: 'AZUL', AZUL: 'ROJO', VERDE: 'VERDE', AMARILLO: 'AMARILLO' }
    };

    const mapaActual = mapas[residuo];
    // Traducimos la secuencia original usando el mapa correspondiente
    return this.secuenciaOriginal().map(color => mapaActual[color]);
  });

  async mostrarSecuencia(): Promise<void> {
    if (this.isFlashing() || this.isResolved()) {
      return;
    }

    this.isFlashing.set(true);

    for (const color of this.secuenciaOriginal()) {
      // Encendemos el color
      this.colorActivo.set(color);
      await new Promise(r => setTimeout(r, 600));

      // Apagamos el color
      this.colorActivo.set(null);
      await new Promise(r => setTimeout(r, 200));
    }

    this.isFlashing.set(false);
  }

  presionarColor(color: string): void {
    if (this.isResolved() || this.isFlashing()) {
      return;
    }

    const roomId = this.gameState()?.roomId;
    if (!roomId) return;

    const currentCorrectColor = this.secuenciaCorrecta()[this.indiceUsuario()];

    if (color === currentCorrectColor) {
      // Avanzamos en el progreso
      this.indiceUsuario.update(i => i + 1);

      // Verificamos si terminamos las 4 etapas
      if (this.indiceUsuario() === 4) {
        this.isResolved.set(true);
        this.webSocketService.resolverModulo(roomId, 'simon');
      }
    } else {
      // Falla el usuario
      this.webSocketService.enviarStrike(roomId);
      this.indiceUsuario.set(0); // Castigo: volver a empezar desde cero
    }
  }
}
