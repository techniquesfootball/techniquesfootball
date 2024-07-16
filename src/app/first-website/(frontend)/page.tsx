import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex items-center justify-center w-full">
      <Link href="/first-website/booking" className="underline">
        <Button size="sm">Book now</Button>
      </Link>
    </div>
  );
}
