import { Routes } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { BombComponent } from './bomb/bomb.component';
import { ManualComponent } from './manual/manual.component';

export const routes: Routes = [
    { path: '', component: LobbyComponent },
    { path: 'bomba', component: BombComponent },
    { path: 'manual', component: ManualComponent },
    { path: '**', redirectTo: '' }
];
