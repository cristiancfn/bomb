import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LobbyComponent } from './lobby/lobby.component';
import { BombComponent } from './bomb/bomb.component';
import { ManualComponent } from './manual/manual.component';
import { WebSocketService } from './services/web-socket.service';

export const routes: Routes = [
    { path: '', component: LobbyComponent },
    { 
        path: 'bomba', 
        component: BombComponent,
        canActivate: [() => {
            const ws = inject(WebSocketService);
            const router = inject(Router);
            
            // Si hay conexión activa, permitimos el paso. Si no, redirigimos al Lobby.
            if (ws.isConnected()) {
                return true;
            }
            return router.parseUrl('');
        }]
    },
    { path: 'manual', component: ManualComponent },
    { path: '**', redirectTo: '' }
];
