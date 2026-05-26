import { Injectable, signal, WritableSignal } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { GameSession } from '../models/game-session';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private stompClient: Client | null = null;
  public gameState: WritableSignal<GameSession | null> = signal<GameSession | null>(null);
  public isConnected: WritableSignal<boolean> = signal<boolean>(false);

  constructor() { }

  public conectar(roomId: string): void {
    if (this.stompClient && this.stompClient.active) {
      console.warn('Ya existe una conexión WebSocket activa.');
      return;
    }
    const socket = new SockJS('http://localhost:8080/ws-bomba');

    this.stompClient = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log(`Conectado a la sala: ${roomId}`);
        this.isConnected.set(true);

        this.stompClient?.subscribe(`/topic/room/${roomId}`, (message) => {
          try {
            const body: GameSession = JSON.parse(message.body);
            this.gameState.set(body);
          } catch (error) {
            console.error('Error al parsear el mensaje del estado del juego:', error);
          }
        });
      },
      onStompError: (frame) => {
        console.error('Error de Broker STOMP: ' + frame.headers['message']);
        console.error('Detalles: ' + frame.body);
      },
      onWebSocketError: (event) => {
        console.error('Error de WebSocket:', event);
      }
    });
    this.stompClient.activate();
  }

  public iniciarJuego(roomId: string): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.publish({
        destination: `/app/start/${roomId}`,
        body: JSON.stringify({ roomId })
      });
    } else {
      console.error('No se puede iniciar el juego: el cliente WebSocket no está conectado.');
    }
  }

  public enviarStrike(roomId: string): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.publish({
        destination: `/app/strike/${roomId}`,
        body: JSON.stringify({ roomId })
      });
    } else {
      console.error('No se puede enviar strike: cliente desconectado.');
    }
  }

  public resolverModulo(roomId: string): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.publish({
        destination: `/app/resolve/${roomId}`,
        body: JSON.stringify({ roomId })
      });
    } else {
      console.error('No se puede resolver módulo: cliente desconectado.');
    }
  }
}