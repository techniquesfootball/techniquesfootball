"use client";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "./calendar";
import {
  ChevronLeftIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
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
import * as React from "react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";

type Schedule = {
  [key: string]: string[];
};

const schedule: Schedule = {
  "2024-07-01": ["Game 1: Team A vs Team B", "Game 2: Team C vs Team D"],
  "2024-07-02": ["Game 3: Team E vs Team F", "Game 4: Team G vs Team H"],
};

export default function Page() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedGames, setSelectedGames] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      setSelectedGames(schedule[formattedDate] || []);
    }
  }, [date]);

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="w-auto">
        <Link href="/first-website/admin/location" className="w-full">
          <Button variant="link" className="mb-3">
            <ChevronLeftIcon className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <DateTimePicker granularity="second" hourCycle={12} />
        <div className="mt-3"></div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="mb-3">
              Add Price
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add Schedule</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 grid-cols-2">
              <div className="flex items-center gap-4">
                <Label htmlFor="name" className="w-1/3 text-right">
                  Position 1
                </Label>
                <Input id="name" className="w-2/3" />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="name" className="w-1/3 text-right">
                  Position 1
                </Label>
                <Input id="name" className="w-2/3" />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="username" className="w-1/3 text-right">
                  Position 2
                </Label>
                <Input id="username" className="w-2/3" />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="username" className="w-1/3 text-right">
                  Position 2
                </Label>
                <Input id="username" className="w-2/3" />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="name" className="w-1/3 text-right">
                  Position 3
                </Label>
                <Input id="name" className="w-2/3" />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="name" className="w-1/3 text-right">
                  Position 3
                </Label>
                <Input id="name" className="w-2/3" />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="username" className="w-1/3 text-right">
                  Position 4
                </Label>
                <Input id="username" className="w-2/3" />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="username" className="w-1/3 text-right">
                  Position 4
                </Label>
                <Input id="username" className="w-2/3" />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="name" className="w-1/3 text-right">
                  Position 5
                </Label>
                <Input id="name" className="w-2/3" />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="name" className="w-1/3 text-right">
                  Position 5
                </Label>
                <Input id="name" className="w-2/3" />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="username" className="w-1/3 text-right">
                  Position 6
                </Label>
                <Input id="username" className="w-2/3" />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="username" className="w-1/3 text-right">
                  Position 6
                </Label>
                <Input id="username" className="w-2/3" />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="name" className="w-1/3 text-right">
                  Position 7
                </Label>
                <Input id="name" className="w-2/3" />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="name" className="w-1/3 text-right">
                  Position 7
                </Label>
                <Input id="name" className="w-2/3" />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="username" className="w-1/3 text-right">
                  Position 8
                </Label>
                <Input id="username" className="w-2/3" />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="username" className="w-1/3 text-right">
                  Position 8
                </Label>
                <Input id="username" className="w-2/3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border shadow flex justify-center"
        />
      </div>
      <div className="flex-grow sm:ml-6 mt-12">
        {selectedGames.length > 0 ? (
          selectedGames.map((game, index) => (
            <Alert className="mb-2">
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
  );
}
