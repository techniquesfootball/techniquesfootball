"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ExclamationTriangleIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { add, format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePickerDemo } from "@/components/widget/datetimepicker/time-picker-demo";
import { createTeamsAndSchedule } from "@/services/team";
import { toast } from "@/components/ui/use-toast";
import { getSchedules } from "@/services/schedule";

type Schedule = {
  schedule_id: string;
  team_a: string;
  team_b: string;
  date_and_time: string;
};

export default function Page({ params }: { params: { location_id: string } }) {
  const [date, setDate] = useState<Date>();
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [teamDetails, setTeamDetails] = useState<{ [key: string]: string }>({});
  const [open, setOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const fetchSchedules = async () => {
    const result = await getSchedules(parseInt(params.location_id));
    if (typeof result === "string") {
      console.error(result);
      toast({
        title: "Error",
        description: result,
      });
    } else {
      setSchedules(result);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [params.location_id]);

  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    if (!date) {
      setDate(newDay);
      return;
    }
    const diff = newDay.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(date, { days: Math.ceil(diffInDays) });
    setDate(newDateFull);
  };

  useEffect(() => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      const games = schedules
        .filter((schedule) => schedule.date_and_time.startsWith(formattedDate))
        .map(
          (schedule) =>
            `Game: Team ${schedule.team_a} vs Team ${schedule.team_b}`
        );
      setSelectedGames(games);
    }
  }, [date, schedules]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeamDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!date) {
      alert("Please select a date");
      return;
    }
    const dateAndTime = date.toISOString();
    try {
      const result = await createTeamsAndSchedule(
        parseInt(params.location_id as string),
        dateAndTime,
        teamDetails
      );
      if (typeof result === "string") {
        alert(result);
        toast({
          title: "Error",
          description: result,
        });
      } else {
        setOpen(false);
        toast({
          title: "Success",
          description: "Teams and schedule created successfully!",
        });
        location.reload();
        setDate(undefined);
        setTeamDetails({});
      }
    } catch (error) {
      console.error("Error creating teams and schedule:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="w-full flex justify-between">
        <Link href="/first-website/admin/location">
          <Button variant="link">
            <ChevronLeftIcon className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Price</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add Schedule</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP HH:mm:ss")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => handleSelect(d)}
                  initialFocus
                />
              </PopoverContent>
              <TimePickerDemo setDate={setDate} date={date} />
            </Popover>
            <div className="grid gap-4 py-4 grid-cols-2">
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="defender1_teamA_price"
                  className="w-1/3 text-right"
                >
                  Defender 1
                </Label>
                <Input
                  id="defender1_teamA_price"
                  name="defender1_teamA_price"
                  value={teamDetails.defender1_teamA_price || ""}
                  onChange={handleInputChange}
                  className="w-2/3"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="defender1_teamB_price"
                  className="w-1/3 text-right"
                >
                  Defender 1
                </Label>
                <Input
                  id="defender1_teamB_price"
                  name="defender1_teamB_price"
                  value={teamDetails.defender1_teamB_price || ""}
                  onChange={handleInputChange}
                  className="w-2/3"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="defender2_teamA_price"
                  className="w-1/3 text-right"
                >
                  Defender 2
                </Label>
                <Input
                  id="defender2_teamA_price"
                  name="defender2_teamA_price"
                  value={teamDetails.defender2_teamA_price || ""}
                  onChange={handleInputChange}
                  className="w-2/3"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="defender2_teamB_price"
                  className="w-1/3 text-right"
                >
                  Defender 2
                </Label>
                <Input
                  id="defender2_teamB_price"
                  name="defender2_teamB_price"
                  value={teamDetails.defender2_teamB_price || ""}
                  onChange={handleInputChange}
                  className="w-2/3"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="defender3_teamA_price"
                  className="w-1/3 text-right"
                >
                  Defender 3
                </Label>
                <Input
                  id="defender3_teamA_price"
                  name="defender3_teamA_price"
                  value={teamDetails.defender3_teamA_price || ""}
                  onChange={handleInputChange}
                  className="w-2/3"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="defender3_teamB_price"
                  className="w-1/3 text-right"
                >
                  Defender 3
                </Label>
                <Input
                  id="defender3_teamB_price"
                  name="defender3_teamB_price"
                  value={teamDetails.defender3_teamB_price || ""}
                  onChange={handleInputChange}
                  className="w-2/3"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="defender4_teamA_price"
                  className="w-1/3 text-right"
                >
                  Defender 4
                </Label>
                <Input
                  id="defender4_teamA_price"
                  name="defender4_teamA_price"
                  value={teamDetails.defender4_teamA_price || ""}
                  onChange={handleInputChange}
                  className="w-2/3"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="defender4_teamB_price"
                  className="w-1/3 text-right"
                >
                  Defender 4
                </Label>
                <Input
                  id="defender4_teamB_price"
                  name="defender4_teamB_price"
                  value={teamDetails.defender4_teamB_price || ""}
                  onChange={handleInputChange}
                  className="w-2/3"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="mid_fielder1_teamA_price"
                  className="w-1/3 text-right"
                >
                  Midfielder 1
                </Label>
                <Input
                  id="mid_fielder1_teamA_price"
                  name="mid_fielder1_teamA_price"
                  value={teamDetails.mid_fielder1_teamA_price || ""}
                  onChange={handleInputChange}
                  className="w-2/3"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="mid_fielder1_teamB_price"
                  className="w-1/3 text-right"
                >
                  Midfielder 1
                </Label>
                <Input
                  id="mid_fielder1_teamB_price"
                  name="mid_fielder1_teamB_price"
                  value={teamDetails.mid_fielder1_teamB_price || ""}
                  onChange={handleInputChange}
                  className="w-2/3"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="mid_fielder2_teamA_price"
                  className="w-1/3 text-right"
                >
                  Midfielder 2
                </Label>
                <Input
                  id="mid_fielder2_teamA_price"
                  name="mid_fielder2_teamA_price"
                  value={teamDetails.mid_fielder2_teamA_price || ""}
                  onChange={handleInputChange}
                  className="w-2/3"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="mid_fielder2_teamB_price"
                  className="w-1/3 text-right"
                >
                  Midfielder 2
                </Label>
                <Input
                  id="mid_fielder2_teamB_price"
                  name="mid_fielder2_teamB_price"
                  value={teamDetails.mid_fielder2_teamB_price || ""}
                  onChange={handleInputChange}
                  className="w-2/3"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="mid_fielder3_teamA_price"
                  className="w-1/3 text-right"
                >
                  Midfielder 3
                </Label>
                <Input
                  id="mid_fielder3_teamA_price"
                  name="mid_fielder3_teamA_price"
                  value={teamDetails.mid_fielder3_teamA_price || ""}
                  onChange={handleInputChange}
                  className="w-2/3"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="mid_fielder3_teamB_price"
                  className="w-1/3 text-right"
                >
                  Midfielder 3
                </Label>
                <Input
                  id="mid_fielder3_teamB_price"
                  name="mid_fielder3_teamB_price"
                  value={teamDetails.mid_fielder3_teamB_price || ""}
                  onChange={handleInputChange}
                  className="w-2/3"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="striker1_teamA_price"
                  className="w-1/3 text-right"
                >
                  Striker 1
                </Label>
                <Input
                  id="striker1_teamA_price"
                  name="striker1_teamA_price"
                  value={teamDetails.striker1_teamA_price || ""}
                  onChange={handleInputChange}
                  className="w-2/3"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="striker1_teamB_price"
                  className="w-1/3 text-right"
                >
                  Striker 1
                </Label>
                <Input
                  id="striker1_teamB_price"
                  name="striker1_teamB_price"
                  value={teamDetails.striker1_teamB_price || ""}
                  onChange={handleInputChange}
                  className="w-2/3"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="striker2_teamA_price"
                  className="w-1/3 text-right"
                >
                  Striker 2
                </Label>
                <Input
                  id="striker2_teamA_price"
                  name="striker2_teamA_price"
                  value={teamDetails.striker2_teamA_price || ""}
                  onChange={handleInputChange}
                  className="w-2/3"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="striker2_teamB_price"
                  className="w-1/3 text-right"
                >
                  Striker 2
                </Label>
                <Input
                  id="striker2_teamB_price"
                  name="striker2_teamB_price"
                  value={teamDetails.striker2_teamB_price || ""}
                  onChange={handleInputChange}
                  className="w-2/3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="w-auto">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow flex justify-center"
          />
        </div>
        <div className="flex-grow sm:ml-6 sm:mt-0 mt-3">
          {selectedGames.length > 0 ? (
            selectedGames.map((game, index) => (
              <Alert key={index} className="mb-2">
                <RocketIcon className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>{game}</AlertDescription>
              </Alert>
            ))
          ) : (
            <Alert>
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>No game schedules</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </>
  );
}
