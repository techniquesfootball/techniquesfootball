interface PlayerCardProps {
  fullName: string;
  position: string;
  positionText: string;
  teamId: string;
  onClick: (position: string, teamId: string) => void;
}
