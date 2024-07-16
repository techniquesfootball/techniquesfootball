import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <Avatar className="w-64 h-64 mb-2">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="mb-2">Techniques Football</h1>
          <Button size="sm" variant="outline">
            Visit
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <Avatar className="w-64 h-64 mb-2">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="mb-2">Techniques Football</h1>
          <Link href="/first-website">
            <Button size="sm" variant="outline">
              Visit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
