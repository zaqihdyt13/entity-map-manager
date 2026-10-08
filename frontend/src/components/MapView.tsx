import Map, { Marker, Popup, type MapMouseEvent } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { setWorkerUrl } from "maplibre-gl";
import type { Location } from "@/types/location";
import type { Entity } from "@/types/entity";
import { useState } from "react";
import { Button } from "./ui/button";

setWorkerUrl(workerUrl);

type MapViewProps = {
  entities: Entity[];
  location: Location | null;
  isSelectingLocation: boolean;
  onLocationSelect: (location: Location) => void;
  onEditEntity: (entity: Entity) => void;
  onDeleteEntity: (entity: Entity) => void;
};

const MapView = ({
  entities,
  location,
  isSelectingLocation,
  onLocationSelect,
  onEditEntity,
  onDeleteEntity,
}: MapViewProps) => {
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  const handleMapClick = (event: MapMouseEvent) => {
    if (!isSelectingLocation) return;

    const { lat, lng } = event.lngLat;

    onLocationSelect({
      latitude: lat,
      longitude: lng,
    });
  };
  return (
    <div className="relative">
      {isSelectingLocation && (
        <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-md bg-background px-4 py-2 text-sm font-medium shadow-md">
          Click anywhere on the map to select a location
        </div>
      )}

      <Map
        initialViewState={{ longitude: 0, latitude: 20, zoom: 2 }}
        style={{ width: "100%", height: 500, cursor: isSelectingLocation ? "crosshair" : "grab" }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        onClick={handleMapClick}
      >
        {entities.map((entity) => (
          <Marker
            key={entity.id}
            longitude={entity.longitude}
            latitude={entity.latitude}
            onClick={(event) => {
              if (isSelectingLocation) return;
              event.originalEvent.stopPropagation();
              setSelectedEntity(entity);
            }}
            className={isSelectingLocation ? "pointer-events-none" : "cursor-pointer"}
          />
        ))}

        {location && (
          <Marker longitude={location.longitude} latitude={location.latitude} color="red" />
        )}

        {selectedEntity && (
          <Popup
            longitude={selectedEntity.longitude}
            latitude={selectedEntity.latitude}
            anchor="bottom"
            closeOnClick={false}
            onClose={() => setSelectedEntity(null)}
          >
            <div className="min-w-48">
              <h3 className="font-semibold">{selectedEntity.name}</h3>

              <div className="mt-2 space-y-1 text-sm">
                <p>
                  <span className="font-medium">Type:</span> {selectedEntity.type}
                </p>

                <p>
                  <span className="font-medium">Status:</span> {selectedEntity.status}
                </p>

                <p>
                  <span className="font-medium">Latitude:</span>{" "}
                  {selectedEntity.latitude.toFixed(6)}
                </p>

                <p>
                  <span className="font-medium">Longitude:</span>{" "}
                  {selectedEntity.longitude.toFixed(6)}
                </p>
              </div>

              <div className="mt-3 flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    onEditEntity(selectedEntity);
                    setSelectedEntity(null);
                  }}
                >
                  Edit
                </Button>
                <Button
                  className="flex-1"
                  variant="destructive"
                  onClick={() => {
                    onDeleteEntity(selectedEntity);
                    setSelectedEntity(null);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapView;
