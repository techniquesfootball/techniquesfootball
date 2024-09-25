"use client";
import * as React from "react";
import { useEffect } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScheduleDetails, getSchedules } from "@/lib/schedule";
import Loader from "@/components/ui/loader";

type Player = {
  name: string;
  position: string;
};

const columns: ColumnDef<ScheduleDetails>[] = [
  {
    accessorKey: "schedule_id",
    header: "Schedule ID",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("schedule_id")}</div>
    ),
  },
  {
    accessorKey: "location",
    header: () => <div className="text-center">Location</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">test location</div>
    ),
  },
  {
    accessorKey: "team_a_id",
    header: () => <div className="text-center">Team A</div>,
    cell: ({ row }) => {
      interface Team {
        defender_1: string;
        defender_2: string;
        defender_3: string;
        defender_4: string;
        mid_fielder_1: string;
        mid_fielder_2: string;
        mid_fielder_3: string;
        striker_1: string;
        striker_2: string;
      }
      interface RowData {
        team_a_id: Team;
      }
      const teamA = row.getValue<RowData["team_a_id"]>("team_a_id");
      const players = [
        teamA.defender_1,
        teamA.defender_2,
        teamA.defender_3,
        teamA.defender_4,
        teamA.mid_fielder_1,
        teamA.mid_fielder_2,
        teamA.mid_fielder_3,
        teamA.striker_1,
        teamA.striker_2,
      ];
      const playerCount = players.filter((player) => !!player).length;
      return (
        <div className="capitalize text-center">{`${playerCount}/9 players`}</div>
      );
    },
  },
  {
    accessorKey: "team_b_id",
    header: () => <div className="text-center">Team B</div>,
    cell: ({ row }) => {
      interface Team {
        defender_1: string;
        defender_2: string;
        defender_3: string;
        defender_4: string;
        mid_fielder_1: string;
        mid_fielder_2: string;
        mid_fielder_3: string;
        striker_1: string;
        striker_2: string;
      }
      interface RowData {
        team_b_id: Team;
      }
      const teamB = row.getValue<RowData["team_b_id"]>("team_b_id");
      const players = [
        teamB.defender_1,
        teamB.defender_2,
        teamB.defender_3,
        teamB.defender_4,
        teamB.mid_fielder_1,
        teamB.mid_fielder_2,
        teamB.mid_fielder_3,
        teamB.striker_1,
        teamB.striker_2,
      ];
      const playerCount = players.filter((player) => !!player).length;
      return (
        <div className="capitalize text-center">{`${playerCount}/9 players`}</div>
      );
    },
  },
  {
    accessorKey: "date_and_time",
    header: () => <div className="text-center">Date and time</div>,
    cell: ({ row }) => {
      const dateValue = row.getValue("date_and_time");
      let formattedDateTime: string;
      const formatDateTime = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        };
        return new Intl.DateTimeFormat("en-US", options).format(date);
      };
      if (dateValue instanceof Date) {
        formattedDateTime = formatDateTime(dateValue);
      } else if (typeof dateValue === "string") {
        const parsedDate = new Date(dateValue);
        formattedDateTime = formatDateTime(parsedDate);
      } else {
        formattedDateTime = "Invalid date";
      }
      return <div className="capitalize text-center">{formattedDateTime}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => {
      return (
        <div className="capitalize text-center">
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
              <div className="flex flex-col">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="font-normal w-full">
                      <span className="text-left p-0 m-0">Players</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg mx-auto p-6">
                    <DialogHeader>
                      <DialogTitle>Players</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <PlayersVersus />
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="font-normal">
                      <span className="text-left p-0 m-0">Waiting List</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg mx-auto p-6">
                    <DialogHeader>
                      <DialogTitle>Waiting List</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <WaitingList />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

const PlayersVersus: React.FC = () => (
  <div className="flex justify-center items-center space-x-8">
    <div className="flex flex-col items-end flex-1 space-y-4">
      <h2 className="font-semibold text-center mb-4">Light Tees</h2>
      {playersLightTees.map((player, index) => (
        <PlayerItem key={index} {...player} />
      ))}
    </div>
    <div className="text-2xl font-bold flex-3">VS</div>
    <div className="flex flex-col items-start flex-1 space-y-4">
      <h2 className="font-semibold text-center mb-4">Dark Tees</h2>
      {playersDarkTees.map((player, index) => (
        <PlayerItem2 key={index} {...player} />
      ))}
    </div>
  </div>
);

const WaitingList: React.FC = () => (
  <div className="flex flex-col space-y-4">
    {waitingList.map((player, index) => (
      <PlayerItemWaitingList key={index} {...player} />
    ))}
  </div>
);

const PlayerItem: React.FC<Player> = ({ name, position }) => (
  <div className="flex flex-row items-center justify-end space-x-4">
    <div className="text-right">
      <p className="font-medium">{name}</p>
      <p className="text-sm text-gray-500">{position}</p>
    </div>
    <Avatar className="w-10 h-10">
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  </div>
);

const PlayerItem2: React.FC<Player> = ({ name, position }) => (
  <div className="flex flex-row items-center justify-start space-x-4">
    <Avatar className="w-10 h-10">
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <div className="text-left">
      <p className="font-medium">{name}</p>
      <p className="text-sm text-gray-500">{position}</p>
    </div>
  </div>
);

const PlayerItemWaitingList: React.FC<Player> = ({ name, position }) => (
  <div className="flex flex-row items-center justify-between space-x-4">
    <Avatar className="w-10 h-10">
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>{name[0]}</AvatarFallback>
    </Avatar>
    <div className="text-left flex-1">
      <p className="font-medium">{name}</p>
      <p className="text-sm text-gray-500">{position}</p>
    </div>
  </div>
);

const playersLightTees: Player[] = [
  { name: "dylanbrooks", position: "Not set" },
  { name: "alejandrolb", position: "Not set" },
  { name: "luke-o-shea", position: "Not set" },
  { name: "eashwer18", position: "Not set" },
  { name: "germanwunder", position: "Not set" },
  { name: "open spot", position: "Join Game" },
];

const playersDarkTees: Player[] = [
  { name: "jv100", position: "Midfielder" },
  { name: "vern", position: "Not set" },
  { name: "bilardinho", position: "Not set" },
  { name: "ben-souris", position: "Not set" },
  { name: "illes", position: "Not set" },
  { name: "open spot", position: "Join Game" },
];

const waitingList: Player[] = [
  { name: "john_doe", position: "Forward" },
  { name: "jane_doe", position: "Defender" },
  { name: "jack_smith", position: "Midfielder" },
  { name: "jill_brown", position: "Goalkeeper" },
  { name: "open spot", position: "Join Game" },
];

export default function DataTableDemo() {
  const [data, setData] = React.useState<ScheduleDetails[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const result = await getSchedules();
        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error("Error fetching schedules:", result);
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
      setLoading(false);
    };

    fetchData();
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
      ) : (
        <div className="w-full">
          <div className="flex items-center mb-6">
            <Input
              placeholder="Filter Location"
              value={
                (table.getColumn("location")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("location")?.setFilterValue(event.target.value)
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
      )}
    </>
  );
}
