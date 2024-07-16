import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Page Builder</CardTitle>
          <CardDescription>
            Edit the fields to control the next of the website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Contact us</Label>
              <Input id="name" type="text" className="w-full" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">About us</Label>
              <Input id="name" type="text" className="w-full" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Match rules</Label>
              <Input id="name" type="text" className="w-full" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Our locations</Label>
              <Input id="name" type="text" className="w-full" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Jobs</Label>
              <Input id="name" type="text" className="w-full" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save</Button>
        </CardFooter>
      </Card>
    </>
  );
}
