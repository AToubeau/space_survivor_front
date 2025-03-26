import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ColonyService} from '../../service/colony.service';
import {CommonModule} from '@angular/common';
import {RessourceByColony} from '../../../../model/ressource-by-colony';
import {BuildingCardComponent} from '../../components/building-card/building-card.component';
import {ColonyContextService} from '../../service/colony-context.service';

@Component({
  selector: 'app-colony-detail',
  imports: [CommonModule, BuildingCardComponent],
  templateUrl: './colony-detail.component.html',
  styleUrl: './colony-detail.component.scss'
})
export class ColonyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private colonyService = inject(ColonyService);
  private colonyContext = inject(ColonyContextService);

  colony = this.colonyContext.selectedColony;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    this.colonyContext.selectColony(id);
  }

  getCurrentQuantity(res: RessourceByColony) {
    return this.colonyService.getCurrentQuantity(res);
  }

  getResource(type: string): number {
    return this.colony()?.resources.find(r => r.type.toLowerCase() === type.toLowerCase())?.quantity ?? 0;
  }

  handleUpgrade(buildingType: string) {
    const colony = this.colony();
    if (!colony) return;

    this.colonyService.upgradeBuilding(colony.id, buildingType).subscribe({
      next: () => console.log("Upgrade déclenché"),
      error: (error) => console.error("erreur lors de l'amélioration du batiment :", error)
    });
  }
}
