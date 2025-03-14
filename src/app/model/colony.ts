/*
    private Player owner;
    private List<Building> buildings = new ArrayList<>();
    private Set<RessourceByColony> ressources = new HashSet<>();*/
import {Location} from './location';

export interface Colony {
  id:number;
  name:string;
  galaxy:number;
  solarSystem:number;
  planet:number;
  hasWater:boolean;
  isColonized:boolean;
  population:number;
  originalPlanetId:number;
  location:Location
}

