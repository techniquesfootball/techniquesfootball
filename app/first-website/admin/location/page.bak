"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDownIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { readLocations } from "@/lib/locations";
import Loader from "@/components/ui/loader";

export default function DataTableDemo() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<LocationModel[]>([]);
  const [loading, setLoading] = useState(true);
  const columns: ColumnDef<LocationModel>[] = [
    {
      accessorKey: "location_id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("location_id")}</div>,
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => <div>{row.getValue("location")}</div>,
    },
    {
      accessorKey: "contact_person",
      header: () => <div className="text-center">Contact Person</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("contact_person")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: () => <div className="text-center">Email</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <Badge>{row.getValue("status")}</Badge>
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-center">Action</div>,
      cell: ({ row }) => {
        const locationId = row.getValue("location_id") as number;
        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-center">
                  Actions
                </DropdownMenuLabel>
                <Link
                  href={`/first-website/admin/location/${locationId}/calendar`}
                >
                  <Button variant="ghost" className="font-normal w-full">
                    Calendar
                  </Button>
                </Link>
                <DropdownMenuSeparator />
                <div className="flex flex-col">
                  <Link
                    href={`/first-website/admin/location/${locationId}/edit`}
                  >
                    <Button variant="ghost" className="font-normal w-full">
                      Edit
                    </Button>
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    async function fetchPosts() {
      const result = await readLocations();
      if (typeof result === "string") {
        console.error(result);
      } else {
        setData(result);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      {loading ? (
        <Loader />
      ) : loading ? (
        <div className="flex flex-col items-center justify-center h-24">
          <Loader />
          <span className="text-red-600">
            An error occurred. Please try again later.
          </span>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex items-center mb-6">
            <Link href="/first-website/admin/location/add" className="mr-2">
              <Button>Create location</Button>
            </Link>
            <Input
              placeholder="Filter name..."
              value={
                (table
                  .getColumn("contact_person")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn("contact_person")
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm mr-2"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
