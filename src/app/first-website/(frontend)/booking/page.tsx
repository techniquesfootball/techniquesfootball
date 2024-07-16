"use client";
import * as React from "react";
import { Step, type StepItem, Stepper, useStepper } from "@/components/stepper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// export function StepperExamples() {
//   return (
//     <div className="w-full space-y-8">
//       <div className="flex flex-col gap-4">
//         <p className="font-semibold">Footer inside the step</p>
//         <StepperFooterInside />
//       </div>
//     </div>
//   );
// }

const steps = [
  { label: "Choose location" },
  { label: "Select time" },
  { label: "Select teams" },
] satisfies StepItem[];

export default function StepperFooterInside() {
  return (
    <div className="flex w-full flex-col items-center gap-4 mt-12">
      <div className="w-full sm:w-3/4 lg:w-1/2">
        <Stepper orientation="vertical" initialStep={0} steps={steps}>
          {steps.map((stepProps, index) => (
            <Step key={stepProps.label} {...stepProps}>
              <StepContent index={index} />
              <StepButtons />
            </Step>
          ))}
          <FinalStep />
        </Stepper>
      </div>
    </div>
  );
}

const StepContent = ({ index }: { index: number }) => {
  switch (index) {
    case 0:
      return (
        <div className="h-100 flex items-center justify-center my-4  text-primary rounded-md"></div>
      );
    case 1:
      return <Page />;
    case 2:
      return (
        <div className="h-100 flex items-center justify-center my-4  text-primary rounded-md">
          <section className="pitch">
            <div className="field left">
              <div className="penalty-area"></div>
            </div>
            <div className="field right">
              <div className="penalty-area"></div>
            </div>
            <div className="center-circle"></div>
            <div className="home-team">
              <div className="player one"></div>
              <div className="player two"></div>
              <div className="player three"></div>
              <div className="player four"></div>
              <div className="player five"></div>
              <div className="player six"></div>
              <div className="player seven"></div>
              <div className="player eight"></div>
              <div className="player nine"></div>
              <div className="player ten"></div>
              <div className="player eleven"></div>
            </div>
            <div className="visitor-team">
              <div className="player one"></div>
              <div className="player two"></div>
              <div className="player three"></div>
              <div className="player four"></div>
              <div className="player five"></div>
              <div className="player six"></div>
              <div className="player seven"></div>
              <div className="player eight"></div>
              <div className="player nine"></div>
              <div className="player ten"></div>
              <div className="player eleven"></div>
            </div>
          </section>
        </div>
      );
    default:
      return null;
  }
};

const StepButtons = () => {
  const { nextStep, prevStep, isLastStep, isOptionalStep, isDisabledStep } =
    useStepper();
  return (
    <div className="w-full flex gap-2 mb-4">
      <Button
        disabled={isDisabledStep}
        onClick={prevStep}
        size="sm"
        variant="secondary"
      >
        Prev
      </Button>
      <Button size="sm" onClick={nextStep}>
        {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
      </Button>
    </div>
  );
};

const FinalStep = () => {
  const { hasCompletedAllSteps, resetSteps } = useStepper();

  if (!hasCompletedAllSteps) {
    return null;
  }

  return (
    <>
      <div className="h-40 flex items-center justify-center border bg-secondary text-primary rounded-md">
        <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
      </div>
      <div className="w-full flex justify-end gap-2">
        <Button size="sm" onClick={resetSteps}>
          Reset
        </Button>
      </div>
    </>
  );
};

interface Booking {
  title: string;
  description: string;
}

type BookingData = Record<string, Booking[]>;

const Page: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(
    null
  );

  // Sample bookings data, you should fetch this from an API or elsewhere
  const bookingData: BookingData = {
    "2024-06-13": [
      {
        title: "Appointment at 10:00 AM",
        description: "Booked by John Doe",
      },
      {
        title: "Appointment at 2:00 PM",
        description: "Booked by Jane Smith",
      },
    ],
    "2024-06-14": [
      {
        title: "Appointment at 11:30 AM",
        description: "Booked by Michael Brown",
      },
      {
        title: "Appointment at 2:00 PM",
        description: "Booked by Jane Smith",
      },
    ],
    // Add more dates as needed
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setSelectedBooking(null); // Clear the selected booking when the date changes
    if (selectedDate) {
      // Calculate the next day's date
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);

      // Format the next day's date to match the keys in bookingData
      const formattedDate = nextDay.toISOString().split("T")[0];
      console.log("Formatted Date (Next Day):", formattedDate);

      // Retrieve bookings for the formatted date or default to an empty array
      const selectedBookings = bookingData[formattedDate] || [];
      setBookings(selectedBookings);
    } else {
      setBookings([]);
    }
  };

  // Example array of enabled dates
  const enabledDates: Date[] = [
    new Date("2024-06-13"),
    new Date("2024-06-14"),
    // Add more dates as needed
  ];

  const isDateEnabled = (currentDate: Date) => {
    return enabledDates.some(
      (enabledDate) =>
        enabledDate.getFullYear() === currentDate.getFullYear() &&
        enabledDate.getMonth() === currentDate.getMonth() &&
        enabledDate.getDate() === currentDate.getDate()
    );
  };

  const handleBookingSelect = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  return (
    <div className="flex items-center justify-center w-full m-6">
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        className="rounded-md border shadow"
        disabled={(currentDate: Date) => !isDateEnabled(currentDate)}
      />
      <Card className="w-[380px] ml-2">
        <CardHeader>
          <CardTitle>Available timeslot</CardTitle>
          <CardDescription>
            {date
              ? `Available timeslot for ${date.toLocaleDateString()}`
              : "Select a date"}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            {bookings.map((booking, index) => (
              <div
                key={index}
                onClick={() => handleBookingSelect(booking)}
                className={`mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0 cursor-pointer ${
                  selectedBooking === booking ? "bg-blue-100" : ""
                }`}
              >
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {booking.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
