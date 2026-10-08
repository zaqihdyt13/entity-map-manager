import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Entity } from "@/types/entity";
import { deleteEntity } from "@/api/entities";
import { toast } from "sonner";

type DeleteEntityDialogProps = {
  open: boolean;
  entity: Entity | null;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => Promise<void>;
};

const DeleteEntityDialog = ({ open, entity, onOpenChange, onDeleted }: DeleteEntityDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!entity) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteEntity(entity.id);

      toast.success("Entity deleted successfully");

      await onDeleted();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error) setDeleteError(error.message);
      else setDeleteError("Something went wrong");

      toast.error("Failed to delete entity");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setDeleteError(null);
        }

        onOpenChange(nextOpen);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Entity?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-medium">{entity?.name}</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={isDeleting}
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteEntityDialog;
