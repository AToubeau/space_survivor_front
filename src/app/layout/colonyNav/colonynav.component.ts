import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-colony-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="flex space-x-4 border-b border-gray-600 mb-4 text-white">
      <a [routerLink]="['/colonies', colonyId]"
         routerLinkActive="border-b-2 border-blue-500 text-blue-400"
         class="py-2 px-4 hover:text-blue-300">
        Bâtiments
      </a>
      <a [routerLink]="['/colonies', colonyId, 'ships']"
         routerLinkActive="border-b-2 border-blue-500 text-blue-400"
         class="py-2 px-4 hover:text-blue-300">
        Vaisseaux
      </a>
    </nav>
  `
})
export class ColonyNavComponent {
  private route = inject(ActivatedRoute);
  colonyId = Number(this.route.snapshot.params['id']);
}
