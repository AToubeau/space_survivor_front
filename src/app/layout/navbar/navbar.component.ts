import {ChangeDetectorRef, Component, computed, effect, inject, OnInit, Signal} from '@angular/core';
import {AuthService} from '../../features/auth/services/auth.service';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {ColonyService} from '../../features/colony/service/colony.service';
import {filter} from 'rxjs';
import {RessourceByColony} from '../../model/ressource-by-colony';
import {ColonyContextService} from '../../features/colony/service/colony-context.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">Space Survivor</h1>
      <div *ngIf="showResources" class="flex space-x-4 items-center">
        <div *ngFor="let res of resources()" class="relative group">
          <span class="ml-1">{{ res.type }} : {{ getCurrentQuantity(res) | number:"1.0-0"}}</span>
          <div
            class="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition">
            +{{ res.resourcePerMinute }}/min
          </div>
        </div>
      </div>

      <div>
        <button (click)="logout()" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Déconnexion</button>
      </div>
    </nav>
  `,
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly colonyContext = inject(ColonyContextService);

  showResources = false;

  resources: Signal<(RessourceByColony & { icon: string })[]> = computed(() => {
    const colony = this.colonyContext.selectedColony();
    const order = ["Water", "Metal", "Hydrogen"];
    return colony
      ? colony.resources.map((r) => ({
        ...r,
        icon: `assets/icons/${r.type.toLowerCase()}.png`,
      })).sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))
      : [];
  });



  ngOnInit(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.showResources =
          !e.urlAfterRedirects.startsWith('/auth') &&
          e.urlAfterRedirects !== '/';
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getCurrentQuantity(res: RessourceByColony):number {
    return this.colonyContext.getCurrentQuantity(res)
  }
}
