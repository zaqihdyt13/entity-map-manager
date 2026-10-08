import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { entitySchema, type EntityFormValues } from "@/schemas/enetitySchema";
import type { Entity } from "@/types/entity";
import type { Location } from "@/types/location";
import { updateEntity } from "@/api/entities";
import { toast } from "sonner";

type EditEntityDialogProps = {
  open: boolean;
  entity: Entity | null;
  location: Location | null;

  onOpenChange: (open: boolean) => void;
  onSelectLocation: () => void;
  onUpdated: () => Promise<void>;
  onCancel: () => void;
};

const EditEntityDialog = ({
  open,
  entity,
  location,
  onOpenChange,
  onSelectLocation,
  onCancel,
  onUpdated,
}: EditEntityDialogProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EntityFormValues>({
    resolver: zodResolver(entitySchema),
  });

  const selectedType = useWatch({
    control,
    name: "type",
  });
  const selectedStatus = useWatch({
    control,
    name: "status",
  });

  useEffect(() => {
    if (!entity) {
      return;
    }

    reset({
      name: entity.name,
      type: entity.type,
      status: entity.status,
      latitude: entity.latitude,
      longitude: entity.longitude,
    });
  }, [entity, reset]);

  useEffect(() => {
    if (!location) {
      return;
    }

    setValue("latitude", location.latitude, {
      shouldValidate: true,
    });

    setValue("longitude", location.longitude, {
      shouldValidate: true,
    });
  }, [location, setValue]);

  const onSubmit = async (data: EntityFormValues) => {
    if (!entity) {
      return;
    }

    setSubmitError(null);

    try {
      await updateEntity(entity.id, data);

      toast.success("Entity updated successfully");

      await onUpdated();
      reset();
      onCancel();
    } catch (error) {
      if (error instanceof Error) setSubmitError(error.message);
      else setSubmitError("Something went wrong");

      toast.error("Failed to update entity");
    }
  };

  const handleCancel = () => {
    reset();
    setSubmitError(null);
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleCancel();
          return;
        }

        onOpenChange(true);
      }}
    >
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Entity</DialogTitle>

            <DialogDescription>Update the entity information and location.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-6">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>

              <Input id="edit-name" {...register("name")} />

              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label>Type</Label>

              <Select
                value={selectedType ?? ""}
                onValueChange={(value) =>
                  setValue("type", value as EntityFormValues["type"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="vehicle">Vehicle</SelectItem>

                  <SelectItem value="iot_device">IoT Device</SelectItem>

                  <SelectItem value="facility">Facility</SelectItem>
                </SelectContent>
              </Select>

              {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label>Status</Label>

              <Select
                value={selectedStatus ?? ""}
                onValueChange={(value) =>
                  setValue("status", value as EntityFormValues["status"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>

                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label>Location</Label>

              {location && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs text-muted-foreground">Latitude</Label>

                    <Input value={location.latitude.toFixed(6)} readOnly />
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xs text-muted-foreground">Longitude</Label>

                    <Input value={location.longitude.toFixed(6)} readOnly />
                  </div>
                </div>
              )}

              <Button type="button" variant="outline" onClick={onSelectLocation}>
                Change Location
              </Button>
            </div>

            {submitError && <p className="text-sm text-destructive">{submitError}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={handleCancel}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Entity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEntityDialog;
