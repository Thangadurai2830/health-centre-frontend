"use client";

import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface ResourceDialogProps<TValues extends Record<string, unknown>> {
  title: string;
  triggerLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  form: UseFormReturn<TValues>;
  onSubmit: (values: TValues) => Promise<void>;
  serverError: string | null;
  children: React.ReactNode;
}

export function ResourceDialog<TValues extends Record<string, unknown>>({
  title,
  triggerLabel = "Create",
  open,
  onOpenChange,
  hideTrigger,
  form,
  onSubmit,
  serverError,
  children,
}: ResourceDialogProps<TValues>) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  function setOpen(next: boolean) {
    if (isControlled) {
      onOpenChange?.(next);
    } else {
      setInternalOpen(next);
    }
  }

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger
          render={
            <Button size="sm">
              <Plus className="h-4 w-4" />
              {triggerLabel}
            </Button>
          }
        />
      )}
      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values);
          })}
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto px-1">
            {children}
          </div>

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
