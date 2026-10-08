import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import type { Location } from "@/types/location";
import { entitySchema, type EntityFormValues } from "@/schemas/enetitySchema";
import { createEntity } from "@/api/entities";

type CreateEntityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: Location | null;
  onSelectLocation: () => void;
  onCreated: () => Promise<void>;
  onCancel: () => void;
};

const CreateEntityDialog = ({
  open,
  onOpenChange,
  location,
  onSelectLocation,
  onCreated,
  onCancel,
}: CreateEntityDialogProps) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EntityFormValues>({
    resolver: zodResolver(entitySchema),
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;

    setValue("latitude", location.latitude, {
      shouldValidate: true,
    });

    setValue("longitude", location.longitude, {
      shouldValidate: true,
    });
  }, [location, setValue]);

  const onSubmit = async (data: EntityFormValues) => {
    setSubmitError(null);

    try {
      await createEntity(data);

      toast.success("Entity created successfully");

      await onCreated();
      reset();
      onCancel();
    } catch (error) {
      if (error instanceof Error) setSubmitError(error.message);
      else setSubmitError("Something went wrong");

      toast.error("Failed to create entity");
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
      <DialogTrigger render={<Button size="lg" />}>Add Entity</DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Entity</DialogTitle>

            <DialogDescription>Add a new entity and specify its location.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>

              <Input id="name" placeholder="Vehicle A" {...register("name")} />

              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label>Type</Label>

              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="vehicle">Vehicle</SelectItem>
                      <SelectItem value="iot_device">IoT Device</SelectItem>
                      <SelectItem value="facility">Facility</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label>Status</Label>

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Label>Location</Label>

              {location ? (
                <div className="grid grid-cols gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs text-muted-foreground">Latitude</Label>

                    <Input value={location.latitude.toFixed(6)} readOnly />
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xs text-muted-foreground">Longitude</Label>

                    <Input value={location.longitude.toFixed(6)} readOnly />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No location selected.</p>
              )}

              {(errors.latitude || errors.longitude) && (
                <p className="text-sm text-destructive">Location is required</p>
              )}

              <Button type="button" variant="outline" onClick={onSelectLocation}>
                {location ? "Change Location" : "Select Location"}
              </Button>
            </div>
          </div>

          {submitError && <p className="text-sm text-destructive">{submitError}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Entity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEntityDialog;
