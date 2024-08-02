import { Loader2 } from "lucide-react";

const Icons = {
  spinner: Loader2,
};

const CircularProgressBar = ({ size = 16, className = "" }) => {
  return (
    <Icons.spinner
      className={`animate-spin ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default CircularProgressBar;
