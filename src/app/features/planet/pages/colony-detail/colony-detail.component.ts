import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Colony} from '../../../../model/colony';
import {ColonyService} from '../../service/colony.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-colony-detail',
  imports: [CommonModule],
  templateUrl: './colony-detail.component.html',
  styleUrl: './colony-detail.component.scss'
})
export class ColonyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private colonyService = inject(ColonyService);

  colony: Colony | null = null;

  ngOnInit(): void {
    const colonyId = this.route.snapshot.paramMap.get('id');
    if (colonyId) {
      // Chargement initial via REST
      this.colonyService.fetchColonyDetail(+colonyId).subscribe({
        next: (data) => {
          console.log("data in fetchColonnyDetail : ", data);
          this.colony = data;
        },
        error: (err) => console.error("Erreur lors du chargement du détail de la colonie", err)
      });
    }

    // Abonnement aux mises à jour WebSocket
    this.colonyService.colonyDetailUpdates$.subscribe((updatedColony) => {
      // Si l'update concerne la colonie affichée, on met à jour l'affichage
      if (updatedColony && this.colony && updatedColony.id === this.colony.id) {
        console.log("Mise à jour reçue pour la colonie affichée");
        this.colony = updatedColony;
      }
    });
  }
}
