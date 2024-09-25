"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Loader from "@/components/ui/loader";
import { toast } from "@/components/ui/use-toast";
import { getAllSchedules, ScheduleDetails } from "@/lib/schedule";
import { updatePlayerInTeam } from "@/lib/team";
import moment from "moment";

export default function Page({ params }: { params: { location_id: string } }) {
  const [date, setDate] = useState<Date>();
  const [selectedGames, setSelectedGames] = useState<ScheduleDetails[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState<ScheduleDetails[]>([]);

  const fetchSchedules = async () => {
    try {
      const result = await getAllSchedules();
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

  const handleButtonClick = async (position: string, teamId: string) => {
    try {
      const playerId = "ace48ad8-aa3a-48a7-98b5-0cf1966dbd94";
      const result = await updatePlayerInTeam(
        Number(teamId),
        position,
        playerId
      );
      toast({
        title: "Success",
        description: `Player in position ${position} updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "error",
      });
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
                          <div className="flex flex-col gap-3">
                            <PlayerCard
                              key={"defender_1"}
                              fullName={game.team_a_defender_1_name}
                              position={"defender_1"}
                              positionText={"Defender 1"}
                              onClick={handleButtonClick}
                              teamId={game.team_a_id}
                            />
                            <PlayerCard
                              key={"defender_2"}
                              fullName={game.team_a_defender_2_name}
                              position={"defender_2"}
                              positionText={"Defender 2"}
                              teamId={game.team_a_id}
                              onClick={handleButtonClick}
                            />
                            <PlayerCard
                              key={"defender_3"}
                              fullName={game.team_a_defender_3_name}
                              position={"defender_3"}
                              positionText={"Defender 3"}
                              teamId={game.team_a_id}
                              onClick={handleButtonClick}
                            />
                            <PlayerCard
                              key={"defender_4"}
                              fullName={game.team_a_defender_4_name}
                              position={"defender_4"}
                              positionText={"Defender 4"}
                              teamId={game.team_a_id}
                              onClick={handleButtonClick}
                            />
                            <PlayerCard
                              key={"mid_fielder_1"}
                              fullName={game.team_a_mid_fielder_1_name}
                              position={"mid_fielder_1"}
                              positionText={"Midfielder 1"}
                              teamId={game.team_a_id}
                              onClick={handleButtonClick}
                            />
                            <PlayerCard
                              key={"mid_fielder_2"}
                              fullName={game.team_a_mid_fielder_2_name}
                              position={"mid_fielder_2"}
                              positionText={"Midfielder 2"}
                              teamId={game.team_a_id}
                              onClick={handleButtonClick}
                            />
                            <PlayerCard
                              key={"mid_fielder_3"}
                              fullName={game.team_a_mid_fielder_3_name}
                              position={"mid_fielder_3"}
                              positionText={"Midfielder 3"}
                              teamId={game.team_a_id}
                              onClick={handleButtonClick}
                            />
                            <PlayerCard
                              key={"striker_1"}
                              fullName={game.team_a_striker_1_name}
                              position={"striker_1"}
                              positionText={"Striker 1"}
                              teamId={game.team_a_id}
                              onClick={handleButtonClick}
                            />
                            <PlayerCard
                              key={"striker_2"}
                              fullName={game.team_a_striker_2_name}
                              position={"striker_2"}
                              positionText={"Striker 2"}
                              teamId={game.team_a_id}
                              onClick={handleButtonClick}
                            />
                          </div>
                          <div className="flex justify-center items-center ">
                            <p className="text-2xl font-bold">VS</p>
                          </div>
                          <div className="flex flex-col gap-3">
                            <PlayerCard
                              key={"defender_1"}
                              fullName={game.team_b_defender_1_name}
                              position={"defender_1"}
                              positionText={"Defender 1"}
                              teamId={game.team_b_id}
                              onClick={handleButtonClick}
                            />
                            <PlayerCard
                              key={"defender_2"}
                              fullName={game.team_b_defender_2_name}
                              position={"defender_2"}
                              positionText={"Defender 2"}
                              teamId={game.team_b_id}
                              onClick={handleButtonClick}
                            />
                            <PlayerCard
                              key={"defender_3"}
                              fullName={game.team_a_defender_3_name}
                              position={"defender_3"}
                              positionText={"Defender 3"}
                              teamId={game.team_b_id}
                              onClick={handleButtonClick}
                            />
                            <PlayerCard
                              key={"defender_4"}
                              fullName={game.team_a_defender_4_name}
                              position={"defender_4"}
                              positionText={"Defender 4"}
                              teamId={game.team_b_id}
                              onClick={handleButtonClick}
                            />
                            <PlayerCard
                              key={"mid_fielder_1"}
                              fullName={game.team_a_mid_fielder_1_name}
                              position={"mid_fielder_1"}
                              positionText={"Midfielder 1"}
                              teamId={game.team_b_id}
                              onClick={handleButtonClick}
                            />
                            <PlayerCard
                              key={"mid_fielder_2"}
                              fullName={game.team_a_mid_fielder_2_name}
                              position={"mid_fielder_2"}
                              positionText={"Midfielder 2"}
                              teamId={game.team_b_id}
                              onClick={handleButtonClick}
                            />
                            <PlayerCard
                              key={"mid_fielder_3"}
                              fullName={game.team_a_mid_fielder_3_name}
                              position={"mid_fielder_3"}
                              positionText={"Midfielder 3"}
                              teamId={game.team_b_id}
                              onClick={handleButtonClick}
                            />
                            <PlayerCard
                              key={"striker_1"}
                              fullName={game.team_a_striker_1_name}
                              position={"striker_1"}
                              positionText={"Striker 1"}
                              teamId={game.team_b_id}
                              onClick={handleButtonClick}
                            />
                            <PlayerCard
                              key={"striker_2"}
                              fullName={game.team_a_striker_2_name}
                              position={"striker_2"}
                              positionText={"Striker 2"}
                              teamId={game.team_b_id}
                              onClick={handleButtonClick}
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

const PlayerCard: React.FC<PlayerCardProps> = ({
  fullName,
  position,
  positionText,
  teamId,
  onClick,
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none capitalize">
          {fullName ? fullName : "Open Spot"}
        </p>
        <p className="text-sm text-muted-foreground">
          Position: {positionText}
        </p>
      </div>
      {!fullName && (
        <button
          className="ml-auto bg-blue-500 text-white py-1 px-2 rounded text-sm"
          onClick={() => onClick(position, teamId)}
        >
          Join
        </button>
      )}
    </div>
  );
};
