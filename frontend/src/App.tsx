import { useEffect, useState } from "react";

import "./App.css";

import { getEntities } from "@/api/entities";

import CreateEntityDialog from "@/components/entity/CreateEntityDialog";
import EditEntityDialog from "@/components/entity/EditEntityDialog";
import DeleteEntityDialog from "@/components/entity/DeleteEntityDialog";
import MapView from "@/components/MapView";
import { Toaster } from "@/components/ui/sonner";

import type { Entity } from "@/types/entity";
import type { Location } from "@/types/location";
import { toast } from "sonner";

type MapMode = "idle" | "create" | "edit";

function App() {
  const [entities, setEntities] = useState<Entity[]>([]);

  const [mapMode, setMapMode] = useState<MapMode>("idle");

  const [location, setLocation] = useState<Location | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [editLocation, setEditLocation] = useState<Location | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [deletingEntity, setDeletingEntity] = useState<Entity | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchEntities = async () => {
    try {
      const data = await getEntities();
      setEntities(data);
    } catch (error) {
      toast.error("Failed to fetch entities");
      console.error("Failed to fetch entities:", error);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadEntities = async () => {
      try {
        const data = await getEntities();

        if (!ignore) {
          setEntities(data);
        }
      } catch (error) {
        if (!ignore) {
          toast.error("Failed to load entities");
          console.error("Failed to fetch entities:", error);
        }
      }
    };

    void loadEntities();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSelectLocation = () => {
    setIsDialogOpen(false);
    setMapMode("create");
  };

  const handleSelectEditLocation = () => {
    setIsEditDialogOpen(false);
    setMapMode("edit");
  };

  const handleLocationSelect = (newLocation: Location) => {
    if (mapMode === "edit") {
      setEditLocation(newLocation);
      setMapMode("idle");
      setIsEditDialogOpen(true);
      return;
    }

    if (mapMode === "create") {
      setLocation(newLocation);
      setMapMode("idle");
      setIsDialogOpen(true);
    }
  };

  const handleCancelCreate = () => {
    setLocation(null);
    setMapMode("idle");
    setIsDialogOpen(false);
  };

  const handleEditEntity = (entity: Entity) => {
    setEditingEntity(entity);
    setEditLocation({
      latitude: entity.latitude,
      longitude: entity.longitude,
    });
    setIsEditDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingEntity(null);
    setEditLocation(null);
    setMapMode("idle");
    setIsEditDialogOpen(false);
  };

  const handleEditDialogOpenChange = (open: boolean) => {
    if (!open) {
      handleCancelEdit();
      return;
    }

    setIsEditDialogOpen(true);
  };

  const handleDeleteEntity = (entity: Entity) => {
    setDeletingEntity(entity);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogOpenChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);

    if (!open) {
      setDeletingEntity(null);
    }
  };

  return (
    <main className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Entities</h1>
          <p className="text-sm text-muted-foreground">Manage and monitor your entities.</p>
        </div>

        <CreateEntityDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          location={location}
          onSelectLocation={handleSelectLocation}
          onCreated={fetchEntities}
          onCancel={handleCancelCreate}
        />
      </div>

      <MapView
        entities={entities}
        location={mapMode === "edit" ? editLocation : location}
        isSelectingLocation={mapMode !== "idle"}
        onLocationSelect={handleLocationSelect}
        onEditEntity={handleEditEntity}
        onDeleteEntity={handleDeleteEntity}
      />

      <EditEntityDialog
        open={isEditDialogOpen}
        entity={editingEntity}
        location={editLocation}
        onOpenChange={handleEditDialogOpenChange}
        onSelectLocation={handleSelectEditLocation}
        onCancel={handleCancelEdit}
        onUpdated={fetchEntities}
      />

      <DeleteEntityDialog
        open={isDeleteDialogOpen}
        entity={deletingEntity}
        onOpenChange={handleDeleteDialogOpenChange}
        onDeleted={fetchEntities}
      />

      <Toaster position="top-right" richColors />
    </main>
  );
}

export default App;
