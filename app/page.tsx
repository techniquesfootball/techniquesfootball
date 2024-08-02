import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <h1 className="mb-2">Techniques Football 1</h1>
          <Link href="/first-website">
            <Button size="sm" variant="outline">
              Visit
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <h1 className="mb-2">Techniques Football 2</h1>
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
