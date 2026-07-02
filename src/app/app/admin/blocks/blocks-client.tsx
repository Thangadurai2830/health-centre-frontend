"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ResourceDialog } from "@/components/admin/resource-dialog";
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
import { createAdminResourceHooks, useLookup } from "@/lib/queries/admin-resource";

interface Block {
  id: string;
  district_id: string;
  name: string;
  code: string;
}

type BlockFormValues = {
  district_id: string;
  name: string;
  code: string;
};

const { useList, useCreate, useUpdate, useDelete } = createAdminResourceHooks<
  Block,
  BlockFormValues
>("blocks");

const PAGE_SIZE = 20;

export function BlocksClient({ role }: { role: UserRole }) {
  const canManage = canManageMasterData(role);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [editing, setEditing] = useState<Block | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data, isLoading } = useList({ limit: PAGE_SIZE, offset, search: search || undefined });
  const { data: districts } = useLookup("districts");
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  const form = useForm<BlockFormValues>({
    defaultValues: { district_id: "", name: "", code: "" },
    values: editing ?? undefined,
  });

  const districtNameById = new Map((districts ?? []).map((d) => [d.id, d.name]));

  const columns: DataTableColumn<Block>[] = [
    { id: "name", header: "Name", cell: (row) => row.name },
    { id: "code", header: "Code", cell: (row) => row.code },
    {
      id: "district",
      header: "District",
      cell: (row) => districtNameById.get(row.district_id) ?? row.district_id,
    },
  ];

  async function onSubmit(values: BlockFormValues) {
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
        <h1 className="text-2xl font-semibold tracking-tight">Blocks</h1>
        <p className="text-sm text-muted-foreground">Manage blocks within districts.</p>
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
        searchPlaceholder="Search blocks..."
        canManage={canManage}
        onEdit={(row) => {
          setEditing(row);
          setServerError(null);
          setDialogOpen(true);
        }}
        onDelete={(row) => deleteMutation.mutate(row.id)}
        createAction={
          <ResourceDialog
            title={editing ? "Edit block" : "Create block"}
            triggerLabel="New block"
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) setEditing(null);
            }}
            form={form}
            onSubmit={onSubmit}
            serverError={serverError}
          >
            <BlockFields form={form} districts={districts ?? []} />
          </ResourceDialog>
        }
      />
    </div>
  );
}

function BlockFields({
  form,
  districts,
}: {
  form: ReturnType<typeof useForm<BlockFormValues>>;
  districts: { id: string; name: string }[];
}) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const districtId = watch("district_id");

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="district_id">District</Label>
        <Select value={districtId} onValueChange={(value) => setValue("district_id", value)}>
          <SelectTrigger id="district_id" className="w-full">
            <SelectValue placeholder="Select district" />
          </SelectTrigger>
          <SelectContent>
            {districts.map((district) => (
              <SelectItem key={district.id} value={district.id}>
                {district.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
        <Label htmlFor="code">Code</Label>
        <Input
          id="code"
          aria-invalid={errors.code ? true : undefined}
          {...register("code", { required: "Code is required" })}
        />
        {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
      </div>
    </>
  );
}
