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
import { Label } from "@/components/ui/label";
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
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import {
  createLocation,
  readLocations,
  readLocationById,
  updateLocation,
} from "@/lib/locations";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const Icons = {
  spinner: Loader2,
};

export default function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<LocationModel[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [surfaceType, setSurfaceType] = React.useState("");
  const [lighting, setLighting] = React.useState(false);
  const [parking, setParking] = React.useState(false);
  const [editLocation, setEditLocation] = React.useState<LocationModel | null>(
    null
  );
  const FormSchema = z.object({
    contact_person: z.string().min(2, {
      message: "Contact person must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Invalid email address.",
    }),
    phone_number: z.string().min(11, {
      message: "Phone number must be at least 10 characters.",
    }),
    surface_type: z.string(),
    lighting: z.string(),
    parking: z.string(),
    description: z.string(),
  });

  const columns: ColumnDef<LocationModel>[] = [
    {
      accessorKey: "location_id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("location_id")}</div>,
    },
    {
      accessorKey: "contact_person",
      header: "Contact Person",
      cell: ({ row }) => <div>{row.getValue("contact_person")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge>{row.getValue("status")}</Badge>,
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Action",
      cell: ({ row }) => {
        const locationId = row.getValue("location_id") as number;
        return (
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="font-normal"
                      onClick={(event) => {
                        event.preventDefault();
                        (async () => {
                          const location = await readLocationById(locationId);
                          setEditLocation(location);
                          setIsDialogOpen(true);
                        })();
                      }}
                    >
                      <span className="text-left p-0 m-0">Edit</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg mx-auto p-6">
                    <DialogHeader>
                      <DialogTitle>Edit Location</DialogTitle>
                      <DialogDescription>
                        Fill all the required fields. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                          <Label htmlFor="contact-info" className="text-right">
                            Contact Information
                          </Label>
                          <div className="col-span-2 grid gap-2">
                            <Input
                              {...register("contact_person")}
                              placeholder="Contact Person"
                            />
                            <Input
                              {...register("email")}
                              type="email"
                              placeholder="Email"
                            />
                            <Input
                              {...register("phone_number")}
                              type="tel"
                              placeholder="Phone Number"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                          <Label htmlFor="surface-type" className="text-right">
                            Surface Type
                          </Label>
                          <Select
                            value={surfaceType}
                            onValueChange={setSurfaceType}
                          >
                            <SelectTrigger className="w-full sm:w-[180px]">
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="grass">Grass</SelectItem>
                                <SelectItem value="turf">Turf</SelectItem>
                                <SelectItem value="indoor">Indoor</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                          <Label htmlFor="lighting" className="text-right">
                            Lighting
                          </Label>
                          <Switch
                            id="lighting"
                            checked={lighting}
                            onCheckedChange={setLighting}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                          <Label htmlFor="parking" className="text-right">
                            Parking Availability
                          </Label>
                          <Switch
                            id="parking"
                            checked={parking}
                            onCheckedChange={setParking}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            {...register("description")}
                            className="w-full sm:col-span-2"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <span className="flex items-center space-x-2">
                              <Icons.spinner className="h-4 w-4 animate-spin" />
                              <span>Saving...</span>
                            </span>
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      contact_person: "",
      email: "",
      phone_number: "",
      password: "",
      lighting: "",
      parking: "",
      description: "",
      status: "",
      surface_type: "",
    },
  });

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    const result = await readLocations();
    if (typeof result === "string") {
      console.error(result);
    } else {
      setData(result);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);

    const updates: Partial<LocationModel> = {
      contact_person: formData.contact_person,
      email: formData.email,
      phone_number: formData.phone_number,
      surface_type: surfaceType,
      lighting: lighting ? 1 : 0,
      parking: parking ? 1 : 0,
      description: formData.description,
    };

    try {
      if (editLocation) {
        await updateLocation(editLocation.location_id as number, updates);
      } else {
        await createLocation({
          longitude: "1",
          latitude: "2",
          contact_person: formData.contact_person,
          email: formData.email,
          phone_number: formData.phone_number,
          surface_type: surfaceType,
          lighting: lighting ? 1 : 0,
          parking: parking ? 1 : 0,
          description: formData.description,
        });
      }
      toast({
        title: "Success",
        description: "Location data has been saved.",
      });
      reset();
      fetchData();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  React.useEffect(() => {
    if (editLocation) {
      reset({
        contact_person: editLocation.contact_person || "",
        email: editLocation.email || "",
        phone_number: editLocation.phone_number || "",
        surface_type: editLocation.surface_type || "",
        lighting: editLocation.lighting ? "1" : "0",
        parking: editLocation.parking ? "1" : "0",
        description: editLocation.description || "",
      });
      setSurfaceType(editLocation.surface_type || "");
      setLighting(editLocation.lighting ? true : false);
      setParking(editLocation.parking ? true : false);
    }
  }, [editLocation, reset]);

  const resetFields = () => {
    setEditLocation(null);
    setSurfaceType("");
    setLighting(false);
    setParking(false);
    reset({
      contact_person: "",
      email: "",
      phone_number: "",
      surface_type: "",
      lighting: "0",
      parking: "0",
      description: "",
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="mr-2"
              onClick={() => {
                resetFields();
                setIsDialogOpen(true);
              }}
            >
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-lg mx-auto p-6">
            <DialogHeader>
              <DialogTitle>Add Location</DialogTitle>
              <DialogDescription>
                Fill all the required fields. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                  <Label htmlFor="contact-info" className="text-right">
                    Contact Information
                  </Label>
                  <div className="col-span-2 grid gap-2">
                    <Input
                      {...register("contact_person")}
                      placeholder="Contact Person"
                    />
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="Email"
                    />
                    <Input
                      {...register("phone_number")}
                      type="tel"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                  <Label htmlFor="surface-type" className="text-right">
                    Surface Type
                  </Label>
                  <Select value={surfaceType} onValueChange={setSurfaceType}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="grass">Grass</SelectItem>
                        <SelectItem value="turf">Turf</SelectItem>
                        <SelectItem value="indoor">Indoor</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                  <Label htmlFor="lighting" className="text-right">
                    Lighting
                  </Label>
                  <Switch
                    id="lighting"
                    checked={lighting}
                    onCheckedChange={setLighting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                  <Label htmlFor="parking" className="text-right">
                    Parking Availability
                  </Label>
                  <Switch
                    id="parking"
                    checked={parking}
                    onCheckedChange={setParking}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    className="w-full sm:col-span-2"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center space-x-2">
                      <Icons.spinner className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </span>
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Input
          placeholder="Filter name..."
          value={
            (table.getColumn("contact_person")?.getFilterValue() as string) ??
            ""
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
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        {loading ? (
          <Skeleton className="h-52 w-full" />
        ) : (
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
        )}
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
