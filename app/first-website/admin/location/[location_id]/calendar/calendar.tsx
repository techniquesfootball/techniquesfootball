"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import moment from "moment";
import { add, format } from "date-fns";
import {
  ChevronLeftIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { Calendar as CalendarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePickerDemo } from "@/components/datetimepicker/time-picker-demo";
import { toast } from "@/components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Loader from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { createTeamsAndSchedule } from "@/lib/team";
import { getSchedules, ScheduleDetails } from "@/lib/schedule";
import CircularProgressBar from "@/components/ui/circular-progress-bar";
import { Calendar } from "@/components/ui/calendar";

export function CalendarPage({ params }: { params: { location_id: string } }) {
  const [date, setDate] = useState<Date>();
  const [selectedGames, setSelectedGames] = useState<ScheduleDetails[]>([]);
  const [teamDetails, setTeamDetails] = useState<{ [key: string]: string }>({});
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState<ScheduleDetails[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchSchedules = async () => {
    try {
      const result = await getSchedules(parseInt(params.location_id));
      if (typeof result === "string") {
        toast({
          title: "Error",
          description: result,
        });
      } else {
        setLoading(true);
        setSchedules(result);
      }
    } catch (e) {
      setLoading(true);
    } finally {
      setLoading(true);
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
      const momentDate = moment(date).add(1, "day");
      const dateObject = momentDate.toDate();
      const formattedDate = dateObject.toISOString().split("T")[0];
      const games = schedules
        .filter((schedule) => schedule.date_and_time.startsWith(formattedDate))
        .map((schedule) => schedule);
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
    setIsSubmitting(true);
    const hasInvalidFields = Object.values(teamDetails).some(
      (value) => value === "" || value === "0" || value.length >= 4
    );
    if (!date || hasInvalidFields) {
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add correct fields!",
      });
      return;
    }
    const momentDate = moment(date).add(1, "day");
    const dateObject = momentDate.toDate();
    const dateAndTime = dateObject.toISOString();
    try {
      const result = await createTeamsAndSchedule(
        parseInt(params.location_id as string),
        dateAndTime,
        teamDetails
      );
      if (typeof result === "string") {
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
        setTimeout(() => {
          location.reload();
          setDate(undefined);
          setTeamDetails({});
        }, 1000);
      }
    } catch (error) {
      console.error("Error creating teams and schedule:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div>
          <div className="w-full flex justify-between mb-3">
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
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add Schedule</DialogTitle>
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
                      type="number"
                      max-length="3"
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
                      type="number"
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
                      type="number"
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
                      type="number"
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
                      type="number"
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
                      type="number"
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
                      type="number"
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
                      type="number"
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
                      type="number"
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
                      type="number"
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
                      type="number"
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
                      type="number"
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
                      type="number"
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
                      type="number"
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
                      type="number"
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
                      type="number"
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
                      type="number"
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
                      type="number"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSave} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center space-x-2">
                        <CircularProgressBar size={24} />
                        <span>Saving...</span>
                      </span>
                    ) : (
                      "Save"
                    )}
                  </Button>
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
                <Accordion type="single" collapsible className="w-full">
                  {selectedGames.map((game, index) => (
                    <AccordionItem key={index} value={`game-${index}`}>
                      <AccordionTrigger className="hover:no-underline font-normal">
                        123 Baker Street Marylebone London W1U 6RT United
                        Kingdom
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardContent className="grid sm:grid-cols-3 grid-cols-1 gap-4 sm:gap-8">
                          {/* Team A */}
                          <div className="flex flex-col gap-3">
                            <PlayerCard
                              key={"Defender 1"}
                              avatarSrc="/avatars/02.png"
                              fallback="JL"
                              fullName={game.team_a_defender_1_name}
                              position={"Defender 1"}
                            />
                            <PlayerCard
                              key={"Defender 2"}
                              avatarSrc="/avatars/02.png"
                              fallback="JL"
                              fullName={game.team_a_defender_2_name}
                              position={"Defender 2"}
                            />
                            <PlayerCard
                              key={"Defender 3"}
                              avatarSrc="/avatars/02.png"
                              fallback="JL"
                              fullName={game.team_a_defender_3_name}
                              position={"Defender 3"}
                            />
                            <PlayerCard
                              key={"Defender 4"}
                              avatarSrc="/avatars/02.png"
                              fallback="JL"
                              fullName={game.team_a_defender_4_name}
                              position={"Defender 4"}
                            />

                            <PlayerCard
                              key={"Midfielder 1"}
                              avatarSrc="/avatars/02.png"
                              fallback="JL"
                              fullName={game.team_a_mid_fielder_1_name}
                              position={"Midfielder 1"}
                            />
                            <PlayerCard
                              key={"Midfielder 2"}
                              avatarSrc="/avatars/02.png"
                              fallback="JL"
                              fullName={game.team_a_mid_fielder_2_name}
                              position={"Midfielder 2"}
                            />
                            <PlayerCard
                              key={"Midfielder 3"}
                              avatarSrc="/avatars/02.png"
                              fallback="JL"
                              fullName={game.team_a_mid_fielder_3_name}
                              position={"Midfielder 3"}
                            />
                            <PlayerCard
                              key={"Striker 1"}
                              avatarSrc="/avatars/02.png"
                              fallback="JL"
                              fullName={game.team_a_striker_1_name}
                              position={"Striker 1"}
                            />
                            <PlayerCard
                              key={"Striker 2"}
                              avatarSrc="/avatars/02.png"
                              fallback="JL"
                              fullName={game.team_a_striker_2_name}
                              position={"Striker 2"}
                            />
                            {/* Add more PlayerCard components for Team A */}
                          </div>
                          {/* VS */}
                          <div className="flex justify-center items-center">
                            <p className="text-2xl font-bold">VS</p>
                          </div>
                          {/* Team B */}
                          <div className="flex flex-col gap-3">
                            <PlayerCard
                              key={"Defender 1"}
                              avatarSrc="/avatars/02.png"
                              fallback="JL"
                              fullName={game.team_b_defender_1_name}
                              position={"Defender 1"}
                            />
                            <PlayerCard
                              key={"Defender 2"}
                              avatarSrc="/avatars/02.png"
                              fallback="JL"
                              fullName={game.team_b_defender_2_name}
                              position={"Defender 2"}
                            />

                            <PlayerCard
                              key={"Defender 3"}
                              avatarSrc="/avatars/02.png"
                              fallback="JL"
                              fullName={game.team_a_defender_3_name}
                              position={"Defender 3"}
                            />
                            <PlayerCard
                              key={"Defender 4"}
                              avatarSrc="/avatars/02.png"
                              fallback="JL"
                              fullName={game.team_a_defender_4_name}
                              position={"Defender 4"}
                            />

                            <PlayerCard
                              key={"Midfielder 1"}
                              avatarSrc="/avatars/02.png"
                              fallback="JL"
                              fullName={game.team_a_mid_fielder_1_name}
                              position={"Midfielder 1"}
                            />
                            <PlayerCard
                              key={"Midfielder 2"}
                              avatarSrc="/avatars/02.png"
                              fallback="JL"
                              fullName={game.team_a_mid_fielder_2_name}
                              position={"Midfielder 2"}
                            />
                            <PlayerCard
                              key={"Midfielder 3"}
                              avatarSrc="/avatars/02.png"
                              fallback="JL"
                              fullName={game.team_a_mid_fielder_3_name}
                              position={"Midfielder 3"}
                            />
                            <PlayerCard
                              key={"Striker 1"}
                              avatarSrc="/avatars/02.png"
                              fallback="JL"
                              fullName={game.team_a_striker_1_name}
                              position={"Striker 1"}
                            />
                            <PlayerCard
                              key={"Striker 2"}
                              avatarSrc="/avatars/02.png"
                              fallback="JL"
                              fullName={game.team_a_striker_2_name}
                              position={"Striker 2"}
                            />
                          </div>
                        </CardContent>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <Alert>
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>No game schedules</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}

interface PlayerCardProps {
  avatarSrc: string;
  fallback: string;
  fullName: string;
  position: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ fullName, position }) => {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="hidden sm:flex h-9 w-9">
        <AvatarImage src="/avatars/01.png" alt="Avatar" />
        <AvatarFallback>OM</AvatarFallback>
      </Avatar>
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none capitalize">
          {fullName}
        </p>
        <p className="text-sm text-muted-foreground">Position: {position}</p>
      </div>
    </div>
  );
};
