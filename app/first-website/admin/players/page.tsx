"use client";
import * as React from "react";
import { getUsers, getUserById, UserData } from "@/lib/auth";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
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
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import Loader from "@/components/ui/loader";

type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
};

const DataTableDemo: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState<UserData[]>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedUserProfile, setSelectedUserProfile] =
    React.useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = React.useState(false);

  const fetchUserProfile = async (userId: number) => {
    setLoadingProfile(true);
    try {
      const profile = await getUserById(userId);
      setSelectedUserProfile(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const table = useReactTable({
    data: users,
    columns: [
      {
        accessorKey: "full_name",
        header: "Full Name",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("full_name")}</div>
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
        accessorKey: "phone_number",
        header: () => <div className="text-center">Phone Number</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("phone_number")}</div>
        ),
      },
      {
        accessorKey: "role",
        header: () => <div className="text-center">Role</div>,
        cell: ({ row }) => (
          <div className="capitalize text-center">{row.getValue("role")}</div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        enableHiding: false,
        cell: ({ row }) => {
          const userId = row.original.id;

          return (
            <div className="flex justify-center">
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
                          <span className="text-left p-0 m-0">
                            View profile
                          </span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className=" max-w-lg mx-auto p-6">
                        {loadingProfile ? (
                          <div className="h-36">
                            <Loader />
                          </div>
                        ) : selectedUserProfile ? (
                          <>
                            <DialogHeader>
                              <DialogTitle>View profile</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <CardHeader className="flex flex-row items-start bg-muted/50">
                                <div className="grid gap-0.5 flex-grow">
                                  <CardTitle className="group flex items-center gap-2 text-lg">
                                    {selectedUserProfile.full_name}
                                  </CardTitle>
                                  <CardDescription>Player</CardDescription>
                                </div>
                                <Avatar className="ml-auto">
                                  <AvatarImage
                                    src="https://github.com/shadcn.png"
                                    alt={selectedUserProfile.full_name}
                                  />
                                  <AvatarFallback>DB</AvatarFallback>
                                </Avatar>
                              </CardHeader>
                              <CardContent className="p-6 text-sm">
                                <div className="grid gap-3">
                                  <div className="font-semibold">
                                    User Information
                                  </div>
                                  <dl className="grid gap-3">
                                    <div className="flex items-center justify-between">
                                      <dt className="text-muted-foreground">
                                        User
                                      </dt>
                                      <dd>{selectedUserProfile.full_name}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <dt className="text-muted-foreground">
                                        Email
                                      </dt>
                                      <dd>
                                        <a
                                          href={`mailto:${selectedUserProfile.email}`}
                                        >
                                          {selectedUserProfile.email}
                                        </a>
                                      </dd>
                                    </div>
                                  </dl>
                                </div>
                              </CardContent>
                            </div>
                          </>
                        ) : (
                          <div>No profile data available.</div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    state: {
      columnVisibility,
      columnFilters,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getUsers();
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex items-center">
            <Input
              placeholder="Search users..."
              value={
                (table.getColumn("full_name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("full_name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
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
                    <TableRow key={row.id}>
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
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </>
  );
};

export default DataTableDemo;
