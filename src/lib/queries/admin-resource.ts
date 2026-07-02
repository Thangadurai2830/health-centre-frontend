"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AdminApiError, adminGet, adminMutate, type PaginatedResponse } from "@/lib/queries/admin-client";

export interface ListParams {
  limit?: number;
  offset?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  [key: string]: string | number | undefined;
}

function toStringParams(params?: ListParams): Record<string, string | undefined> {
  if (!params) return {};
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, value === undefined ? undefined : String(value)]),
  );
}

export function createAdminResourceHooks<TItem, TCreate, TUpdate = Partial<TCreate>>(
  resourcePath: string,
) {
  const apiPath = `/api/admin/${resourcePath}`;
  const queryKey = ["admin", resourcePath] as const;

  function useList(params?: ListParams) {
    return useQuery({
      queryKey: [...queryKey, "list", params],
      queryFn: () => adminGet<PaginatedResponse<TItem>>(apiPath, toStringParams(params)),
    });
  }

  function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload: TCreate) => adminMutate<TItem>(apiPath, "POST", payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
        toast.success("Created successfully");
      },
      onError: (error) => {
        toast.error(error instanceof AdminApiError ? error.message : "Failed to create");
      },
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: TUpdate }) =>
        adminMutate<TItem>(`${apiPath}/${id}`, "PUT", payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
        toast.success("Updated successfully");
      },
      onError: (error) => {
        toast.error(error instanceof AdminApiError ? error.message : "Failed to update");
      },
    });
  }

  function useDelete() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => adminMutate<void>(`${apiPath}/${id}`, "DELETE"),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
        toast.success("Deleted successfully");
      },
      onError: (error) => {
        toast.error(error instanceof AdminApiError ? error.message : "Failed to delete");
      },
    });
  }

  return { useList, useCreate, useUpdate, useDelete };
}

export function useLookup(lookupPath: string, params?: Record<string, string | undefined>) {
  return useQuery({
    queryKey: ["admin-lookup", lookupPath, params],
    queryFn: () => adminGet<{ id: string; name: string }[]>(`/api/admin/lookups/${lookupPath}`, params),
  });
}
