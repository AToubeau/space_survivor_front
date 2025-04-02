import {Component, inject} from '@angular/core';
import {ColonyContextService} from '../../features/planet/service/colony-context.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink
  ],
  template: `
    <aside class="w-48 bg-gray-800 text-white p-4 h-screen">
      <nav class="flex flex-col space-y-2">
        <a routerLink="/colony/{{ colony?.id }}/buildings" class="hover:underline">Bâtiments</a>
        <a routerLink="/colony/{{ colony?.id }}/ships" class="hover:underline">Vaisseaux</a>
        <a routerLink="/colony/{{ colony?.id }}/fleets" class="hover:underline">Flottes</a>
      </nav>
    </aside>
  `,
})
export class SidebarComponent {
  colony = inject(ColonyContextService).selectedColony();
}
