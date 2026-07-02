"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ResourceDialog } from "@/components/admin/resource-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { canManageMasterData } from "@/lib/auth/rbac";
import type { UserRole } from "@/lib/auth/types";
import { AdminApiError } from "@/lib/queries/admin-client";
import { createAdminResourceHooks } from "@/lib/queries/admin-resource";

interface Specialization {
  id: string;
  name: string;
  description: string | null;
}

type SpecializationFormValues = {
  name: string;
  description: string;
};

const { useList, useCreate, useUpdate, useDelete } = createAdminResourceHooks<
  Specialization,
  SpecializationFormValues
>("specializations");

const PAGE_SIZE = 20;

export function SpecializationsClient({ role }: { role: UserRole }) {
  const canManage = canManageMasterData(role);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [editing, setEditing] = useState<Specialization | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data, isLoading } = useList({ limit: PAGE_SIZE, offset, search: search || undefined });
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  const form = useForm<SpecializationFormValues>({
    defaultValues: { name: "", description: "" },
    values: editing
      ? { name: editing.name, description: editing.description ?? "" }
      : undefined,
  });

  const columns: DataTableColumn<Specialization>[] = [
    { id: "name", header: "Name", cell: (row) => row.name },
    { id: "description", header: "Description", cell: (row) => row.description ?? "—" },
  ];

  async function onSubmit(values: SpecializationFormValues) {
    setServerError(null);
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, payload: values });
      } else {
        await createMutation.mutateAsync(values);
      }
      setDialogOpen(false);
      setEditing(null);
    } catch (error) {
      setServerError(error instanceof AdminApiError ? error.message : "Something went wrong");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Specializations</h1>
        <p className="text-sm text-muted-foreground">
          Manage the global medical specialization catalog.
        </p>
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(row) => row.id}
        total={data?.total ?? 0}
        limit={PAGE_SIZE}
        offset={offset}
        onPageChange={setOffset}
        isLoading={isLoading}
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setOffset(0);
        }}
        searchPlaceholder="Search specializations..."
        canManage={canManage}
        onEdit={(row) => {
          setEditing(row);
          setServerError(null);
          setDialogOpen(true);
        }}
        onDelete={(row) => deleteMutation.mutate(row.id)}
        createAction={
          <ResourceDialog
            title={editing ? "Edit specialization" : "Create specialization"}
            triggerLabel="New specialization"
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) setEditing(null);
            }}
            form={form}
            onSubmit={onSubmit}
            serverError={serverError}
          >
            <SpecializationFields form={form} />
          </ResourceDialog>
        }
      />
    </div>
  );
}

function SpecializationFields({
  form,
}: {
  form: ReturnType<typeof useForm<SpecializationFormValues>>;
}) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          aria-invalid={errors.name ? true : undefined}
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...register("description")} />
      </div>
    </>
  );
}
