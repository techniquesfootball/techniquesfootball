"use client";
import * as React from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const data: User[] = [
  {
    id: "m5gr84i9",
    fullname: "Danilo B. Santos II",
    email: "danilo1998271@gmail.com",
    phoneNumber: "09276086843",
    role: "player",
    status: "active",
  },
  {
    id: "m5gr84i9",
    fullname: "Danilo B. Santos II",
    email: "danilo1998271@gmail.com",
    phoneNumber: "09276086843",
    role: "player",
    status: "active",
  },
  {
    id: "m5gr84i9",
    fullname: "Danilo B. Santos II",
    email: "danilo1998271@gmail.com",
    phoneNumber: "09276086843",
    role: "player",
    status: "active",
  },
  {
    id: "m5gr84i9",
    fullname: "Danilo B. Santos II",
    email: "danilo1998271@gmail.com",
    phoneNumber: "09276086843",
    role: "player",
    status: "active",
  },
  {
    id: "m5gr84i9",
    fullname: "Danilo B. Santos II",
    email: "danilo1998271@gmail.com",
    phoneNumber: "09276086843",
    role: "player",
    status: "active",
  },
];

export type User = {
  id: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: "active" | "in-active";
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "fullname",
    header: "Fullname",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("fullname")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone number",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("phoneNumber")}</div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge>{row.getValue("status")}</Badge>,
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuLabel className="text-center">
              Actions
            </DropdownMenuLabel>
            <div className="flex flex-col">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="font-normal content-start!"
                  >
                    <span className=" text-left p-0 m-0">Booking History</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className=" max-w-lg mx-auto p-6">
                  <DialogHeader>
                    <DialogTitle>Booking History</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4"></div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="font-normal content-start!"
                  >
                    <span className=" text-left p-0 m-0">Send message</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className=" max-w-lg mx-auto p-6">
                  <DialogHeader>
                    <DialogTitle>Send Message</DialogTitle>
                    <DialogDescription>
                      This will be sent to the users email and messages.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Textarea placeholder="Type your message here." />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <DropdownMenuSeparator />
            <div className="flex flex-col">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="font-normal content-start!"
                  >
                    <span className=" text-left p-0 m-0">View profile</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className=" max-w-lg mx-auto p-6">
                  <DialogHeader>
                    <DialogTitle>View profile</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <CardHeader className="flex flex-row items-start bg-muted/50">
                      <div className="grid gap-0.5 flex-grow">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                          Danilo B. Santos II
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            {/* Add any icon or text if needed */}
                          </Button>
                        </CardTitle>
                        <CardDescription>Player</CardDescription>
                      </div>
                      <Avatar className="ml-auto">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="Danilo B. Santos II"
                        />
                        <AvatarFallback>DB</AvatarFallback>
                      </Avatar>
                    </CardHeader>
                    <CardContent className="p-6 text-sm">
                      <div className="grid gap-3">
                        <div className="font-semibold">User Information</div>
                        <dl className="grid gap-3">
                          <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">User</dt>
                            <dd>Liam Johnson</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Email</dt>
                            <dd>
                              <a href="mailto:">liam@acme.com</a>
                            </dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Phone</dt>
                            <dd>
                              <a href="tel:">+1 234 567 890</a>
                            </dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Address</dt>
                            <dd>
                              <a href="tel:">
                                JP Rizal St Poblacion Pandi Bulacan
                              </a>
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <Separator className="my-4" />
                      <div className="grid gap-3">
                        <div className="font-semibold">Payment Information</div>
                        <dl className="grid gap-3">
                          <div className="flex items-center justify-between">
                            <dt className="flex items-center gap-1 text-muted-foreground">
                              <CreditCard className="h-4 w-4" />
                              Visa
                            </dt>
                            <dd>**** **** **** 4532</dd>
                          </div>
                        </dl>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                      <div className="text-xs text-muted-foreground">
                        Updated{" "}
                        <time dateTime="2023-11-23">November 23, 2023</time>
                      </div>
                    </CardFooter>
                  </div>
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="font-normal content-start!"
                  >
                    <span className=" text-left p-0 m-0">Deactivate</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      The user will not be able to access his/her account while
                      deactivated
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
    <div className="w-full">
      <div className="flex items-center mb-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
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
              .map((column) => {
                return (
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
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
  );
}
