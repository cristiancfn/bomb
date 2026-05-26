import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Wire } from '../models/wire';

@Component({
  selector: 'app-wires',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wires.component.html',
  styleUrl: './wires.component.scss'
})
export class WiresComponent {
  // Inicializamos el Signal con 5 cables
  cables = signal<Wire[]>([
    { id: 1, colorClass: 'cable-rojo', isCut: false },
    { id: 2, colorClass: 'cable-azul', isCut: false },
    { id: 3, colorClass: 'cable-amarillo', isCut: false },
    { id: 4, colorClass: 'cable-blanco', isCut: false },
    { id: 5, colorClass: 'cable-negro', isCut: false }
  ]);
  cortarCable(id: number): void {
    // Actualizamos inmutablemente el arreglo buscando el cable cortado
    this.cables.update((currentCables) =>
      currentCables.map((cable) =>
        cable.id === id && !cable.isCut ? { ...cable, isCut: true } : cable
      )
    );
  }
}