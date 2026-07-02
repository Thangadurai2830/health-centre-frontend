"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface DataTableColumn<TRow> {
  id: string;
  header: string;
  cell: (row: TRow) => React.ReactNode;
}

export interface DataTableProps<TRow> {
  columns: DataTableColumn<TRow>[];
  rows: TRow[];
  rowKey: (row: TRow) => string;
  total: number;
  limit: number;
  offset: number;
  onPageChange: (offset: number) => void;
  isLoading?: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  canManage?: boolean;
  onEdit?: (row: TRow) => void;
  onDelete?: (row: TRow) => void;
  createAction?: React.ReactNode;
}

export function DataTable<TRow>({
  columns,
  rows,
  rowKey,
  total,
  limit,
  offset,
  onPageChange,
  isLoading,
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  canManage = false,
  onEdit,
  onDelete,
  createAction,
}: DataTableProps<TRow>) {
  const [pendingDelete, setPendingDelete] = useState<TRow | null>(null);
  const page = Math.floor(offset / limit) + 1;
  const pageCount = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="max-w-xs"
        />
        {canManage && createAction}
      </div>

      <div className="rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id}>{column.header}</TableHead>
              ))}
              {canManage && (onEdit || onDelete) && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                  {canManage && (onEdit || onDelete) && (
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  )}
                </TableRow>
              ))}

            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (canManage ? 1 : 0)}
                  className="py-8 text-center text-muted-foreground"
                >
                  No records found.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              rows.map((row) => (
                <TableRow key={rowKey(row)}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>{column.cell(row)}</TableCell>
                  ))}
                  {canManage && (onEdit || onDelete) && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Edit"
                            onClick={() => onEdit(row)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Delete"
                            onClick={() => setPendingDelete(row)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total === 0 ? "0 results" : `Page ${page} of ${pageCount} — ${total} results`}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={offset === 0}
            onClick={() => onPageChange(Math.max(0, offset - limit))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={offset + limit >= total}
            onClick={() => onPageChange(offset + limit)}
          >
            Next
          </Button>
        </div>
      </div>

      {pendingDelete && onDelete && (
        <ConfirmDeleteDialog
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            onDelete(pendingDelete);
            setPendingDelete(null);
          }}
        />
      )}
    </div>
  );
}

function ConfirmDeleteDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
      <div className="w-full max-w-sm rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10">
        <p className="mb-4 font-medium">Delete this record? This cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
