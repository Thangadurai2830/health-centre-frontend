"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ResourceDialog } from "@/components/admin/resource-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { canManageMasterData } from "@/lib/auth/rbac";
import type { UserRole } from "@/lib/auth/types";
import { AdminApiError } from "@/lib/queries/admin-client";
import { createAdminResourceHooks } from "@/lib/queries/admin-resource";

interface Department {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "inactive";
}

type DepartmentFormValues = {
  name: string;
  description: string;
  status: "active" | "inactive";
};

const { useList, useCreate, useUpdate, useDelete } = createAdminResourceHooks<
  Department,
  DepartmentFormValues
>("departments");

const PAGE_SIZE = 20;

export function DepartmentsClient({ role }: { role: UserRole }) {
  const canManage = canManageMasterData(role);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [editing, setEditing] = useState<Department | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data, isLoading } = useList({ limit: PAGE_SIZE, offset, search: search || undefined });
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  const form = useForm<DepartmentFormValues>({
    defaultValues: { name: "", description: "", status: "active" },
    values: editing
      ? { name: editing.name, description: editing.description ?? "", status: editing.status }
      : undefined,
  });

  const columns: DataTableColumn<Department>[] = [
    { id: "name", header: "Name", cell: (row) => row.name },
    { id: "description", header: "Description", cell: (row) => row.description ?? "—" },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge variant={row.status === "active" ? "default" : "secondary"}>{row.status}</Badge>
      ),
    },
  ];

  async function onSubmit(values: DepartmentFormValues) {
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
        <h1 className="text-2xl font-semibold tracking-tight">Departments</h1>
        <p className="text-sm text-muted-foreground">
          Manage the global department catalog shared across all health centres.
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
        searchPlaceholder="Search departments..."
        canManage={canManage}
        onEdit={(row) => {
          setEditing(row);
          setServerError(null);
          setDialogOpen(true);
        }}
        onDelete={(row) => deleteMutation.mutate(row.id)}
        createAction={
          <ResourceDialog
            title={editing ? "Edit department" : "Create department"}
            triggerLabel="New department"
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) setEditing(null);
            }}
            form={form}
            onSubmit={onSubmit}
            serverError={serverError}
          >
            <DepartmentFields form={form} />
          </ResourceDialog>
        }
      />
    </div>
  );
}

function DepartmentFields({ form }: { form: ReturnType<typeof useForm<DepartmentFormValues>> }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const status = watch("status");

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

      <div className="flex flex-col gap-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={status}
          onValueChange={(value) => setValue("status", value as DepartmentFormValues["status"])}
        >
          <SelectTrigger id="status" className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
