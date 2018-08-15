import {Component, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {LeafletMapService} from './leaflet-map.service';
import {Coordinate} from './coordinate.model';

declare const require: any;
const L = require( 'leaflet' );

// Allow Multiple Popups
L.Map = L.Map.extend({
  openPopup: function(popup) {
    this._popup = popup;
    return this.addLayer(popup).fire('popupopen', {
      popup: this._popup
    });
  }
});
const esri = require( 'esri-leaflet' );

@Component( {
  selector: 'app-leaflet-map',
  template: `
    <div [style.minHeight.px]="400" id="map" #mapDiv (mousedown)="$event.stopPropagation()" (touchstart)="$event.stopPropagation()"></div>
  `,
  styleUrls: [ './leaflet-map.component.scss' ]
} )
export class LeafletMapComponent implements OnDestroy {
  @ViewChild( 'mapDiv' ) mapContainer;
  @Input() set coordinates(coords: Coordinate[]) {
    this._coordinates = coords.filter((el, i) => {
      return el.surface_latitude && el.surface_longitude;
    });
    this.initialize();
  }

  get coordinates(): Coordinate[] {
    return this._coordinates;
  }

  @Input() set selectedCoordinate(selected: Coordinate) {
    this._selectedCoordinate = selected;
    this.setSelectedCoordinate(selected);
  }
  get selectedCoordinate(): Coordinate {
    return this._selectedCoordinate;
  }
  @Output() selectedCoordinateChange: EventEmitter<Coordinate> = new EventEmitter<Coordinate>();

  private _coordinates: Coordinate[] = [];
  private _selectedCoordinate: Coordinate;
  private _isInitialized = false;

  constructor( private leafletMapService: LeafletMapService) {}

  ngOnDestroy(): void {
    this.removeMap();
  }

  private initialize() {
    if (!this.coordinates.length) {
      if (this._isInitialized) {
        this.removeMap();
        this._isInitialized = false;
      }
      return;
    }
    if (this.selectedCoordinate) {
      this.setSelectedCoordinate(this.selectedCoordinate);
    }
    const centerLat: number = this.coordinates[0].surface_latitude;
    const centerLng: number = this.coordinates[0].surface_longitude;

    const map = this.leafletMapService.createMap(this.mapContainer.nativeElement, centerLat, centerLng);
    // const map = this.leafletMapService.createMap(this.mapContainer.nativeElement, centerPoint.surface_latitude, centerPoint.surface_longitude);

    // Scale
    L.control.scale().addTo( map );

    // Add Map Layers
    L.control.layers( this.leafletMapService.baseMaps ).addTo( map );

    // Populate Map Markers
    map.addLayer(this.leafletMapService.populateMarkers(this.coordinates, this.onMarkerClick));

    this._isInitialized = true;
    return map;
  }

  private setSelectedCoordinate(selected: Coordinate) {
      this.coordinates.forEach(c => {
        c.selected = this.leafletMapService.compareCoordinates(c, selected);
      });
  }

  private onMarkerClick = (coord: Coordinate): void => {
    this.selectedCoordinateChange.emit(coord);
    // set clicked coordinate selected
    this._coordinates.forEach((c) => {
      c.selected = this.leafletMapService.compareCoordinates(coord, c);
    });
  }

  private removeMap() {
    // Destroy existing Map if instance
    if ( !isNullOrUndefined( this.leafletMapService.map ) ) {
      this.leafletMapService.removeMap();
    }
  }
}
