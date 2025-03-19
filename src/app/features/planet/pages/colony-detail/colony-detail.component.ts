import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Colony} from '../../../../model/colony';
import {ColonyService} from '../../service/colony.service';
import {CommonModule} from '@angular/common';
import {RessourceByColony} from '../../../../model/ressource-by-colony';

@Component({
  selector: 'app-colony-detail',
  imports: [CommonModule],
  templateUrl: './colony-detail.component.html',
  styleUrl: './colony-detail.component.scss'
})
export class ColonyDetailComponent implements OnInit {
  private colonyService = inject(ColonyService);
  colonyDetail = this.colonyService.colonyDetail
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (!this.colonyService.colonyDetail()) {
      this.colonyService.fetchColonyDetail(id).subscribe((colony) => {
        this.colonyService.colonyDetail.set(colony);
      });
    }
  }

  getCurrentQuantity(res: RessourceByColony) {
    return this.colonyService.getCurrentQuantity(res)
  }
}
