import {Injectable} from '@angular/core';
import {CircleMarker, LayerGroup, Map, TooltipOptions} from 'leaflet';
import {isNullOrUndefined} from 'util';
import {Coordinate} from './coordinate.model';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';

@Injectable()
export class LeafletMapService {
  map: Map;

  baseMaps: any = {
    Topographic: new esri.BasemapLayer( 'Topographic' ),
    Streets: new esri.BasemapLayer( 'Streets' ),
    Imagery: new esri.BasemapLayer( 'Imagery' ),
    ImageryClarity: new esri.BasemapLayer( 'ImageryClarity' ),
    Terrain: new esri.BasemapLayer( 'Terrain' ),
    USATopo: new esri.BasemapLayer( 'USATopo' ),
    ShadedRelief: new esri.BasemapLayer( 'ShadedRelief' ),
    Gray: new esri.BasemapLayer( 'Gray' ),
    DarkGray: new esri.BasemapLayer( 'DarkGray' )
  };

  removeMap(): void {
    if ( !isNullOrUndefined( this.map ) ) {
      this.map.remove();
      this.map.off();
      this.map = null;
    }
  }

  createMap(el: HTMLElement, centerLat: number, centerLng: number): Map {
    if (this.map) {
      this.removeMap();
    }
    this.map = new L.map(el, {
      zoomControl: true,
      attributionControl: false,
      preferCanvas: false,
      center: L.latLng( centerLat, centerLng ),
      zoom: 12,
      minZoom: 1,
      maxZoom: 19,
      worldCopyJump: true, // The map tracks when you pan to another "copy" of the world
      layers: [ esri.basemapLayer( 'Topographic' ) ]
    });
    return this.map;
  }

  populateMarkers(coordinates: Coordinate[], clickCb: (c: Coordinate) => void): LayerGroup {
    const layerGroup = L.layerGroup([]);
    const markers: CircleMarker[] = coordinates.map(coord => {
      const color = coord.active ? '#22f184' : null;
      const clickCallback = (e: MouseEvent) => {
        coord.selected = true;
        if (clickCb) {
          clickCb(coord);
        }
      };
      return this.createCircleMarker(coord, clickCallback, color);
    });
    this.addCircleMarkers(markers, layerGroup);
    return layerGroup;
  }

  addCircleMarkers(markers: CircleMarker[], layerGroup: LayerGroup): void {
    markers.forEach(marker => layerGroup.addLayer(marker));
  }

  createCircleMarker(coord: Coordinate, clickCb: (e: MouseEvent) => void, color?: string): CircleMarker {
    const lat = coord.surface_latitude;
    const lng = coord.surface_longitude;
    const markerOpts = color ? { color, className: 'map-circle-marker' } : null;
    const marker: CircleMarker = new L.circleMarker([lat, lng], markerOpts);
    const tooltipContent = `<strong>${coord.name}</strong>`;
    const tooltipOptions: TooltipOptions = {
      permanent: false,
      className: 'map-marker-tooltip',
      direction: 'top',
      offset: [ 0, 0 ],
    };
    marker.bindTooltip(tooltipContent, tooltipOptions).openTooltip();
    marker.on('click', clickCb);
    return marker;
  }

  compareCoordinates(coord1: Coordinate, coord2: Coordinate): boolean {
    if (!coord1 || !coord2) { return false; }
    const latEqual: boolean = coord1.surface_latitude === coord2.surface_latitude;
    const lngEqual: boolean = coord1.surface_longitude === coord2.surface_longitude;
    return latEqual && lngEqual;
  }
}
