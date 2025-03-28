import {computed, inject, Injectable, signal} from '@angular/core';
import {ColonyService} from './colony.service';
import {RessourceByColony} from '../../../model/ressource-by-colony';

@Injectable({
  providedIn: 'root'
})
export class ColonyContextService {
  private colonyService = inject(ColonyService);

  selectedColonyId = signal<number | null>(null);

  selectedColony = computed(() => {
    const id = this.selectedColonyId();
    const colonies = this.colonyService.colonies();

    return colonies.find(c => c.id === id) ?? null;
  });

  selectColony(id: number) {
    this.selectedColonyId.set(id);
  }

  clearSelection() {
    this.selectedColonyId.set(null);
  }

  getCurrentQuantity(res: RessourceByColony):number {
    return this.colonyService.getCurrentQuantity(res)
  }
}
