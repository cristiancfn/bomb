import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal, computed } from '@angular/core';

@Component({
  selector: 'app-timer',
  standalone: true,
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss' // Nota: En Angular 17 es styleUrl en lugar de styleUrls
})
export class TimerComponent implements OnInit, OnDestroy {
  // Input requerido clásico (Angular 17+ también soporta input signals, pero seguimos tu requerimiento)
  @Input({ required: true }) initialSeconds!: number;

  // Output para notificar cuando el tiempo llegue a cero
  @Output() timeOut = new EventEmitter<void>();

  // Signal interno para manejar el estado del tiempo restante
  timeLeft = signal<number>(0);

  // Valor computado reactivo que formatea el tiempo a "MM:SS"
  formattedTime = computed(() => {
    const currentSeconds = this.timeLeft();
    // Evitamos valores negativos en la vista
    const validSeconds = Math.max(0, currentSeconds);

    const minutes = Math.floor(validSeconds / 60);
    const seconds = validSeconds % 60;

    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');

    return `${minutesStr}:${secondsStr}`;
  });

  private intervalId: any;

  ngOnInit(): void {
    // Inicializamos el signal con el valor de entrada
    this.timeLeft.set(this.initialSeconds);

    // Iniciamos la cuenta regresiva
    this.intervalId = setInterval(() => {
      this.timeLeft.update(time => time - 1);

      if (this.timeLeft() <= 0) {
        this.timeLeft.set(0);
        this.stopTimer();
        this.timeOut.emit();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    // Es crucial limpiar el intervalo cuando el componente se destruye para evitar fugas de memoria
    this.stopTimer();
  }

  private stopTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
