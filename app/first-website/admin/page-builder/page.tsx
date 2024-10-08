"use client";
import * as React from "react";
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
import { toast } from "@/components/ui/use-toast";
import {
  updatePageBuilder,
  PageBuilder,
  getValuesOfPageBuilder,
} from "@/lib/page-builder";
import CircularProgressBar from "@/components/ui/circular-progress-bar";
import Loader from "@/components/ui/loader";

export default function Page() {
  const [formValues, setFormValues] = React.useState<PageBuilder>({
    contact_us: "",
    about_us: "",
    match_rules: "",
    locations: "",
    jobs: "",
  });
  const [saving, isSaving] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getValuesOfPageBuilder();
        if (data && data.length > 0) {
          setFormValues(data[0] as PageBuilder);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load page builder data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    isSaving(true);
    setError(null);

    try {
      await updatePageBuilder(formValues);
      toast({
        title: "Success",
        description: "Page builder updated successfully.",
      });
    } catch (error) {
      setError("Failed to update page builder.");
      toast({
        title: "Error",
        description: "Failed to update page builder.",
      });
    } finally {
      isSaving(false);
    }
  };

  return (
    <>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Page Builder</CardTitle>
            <CardDescription>
              Edit the fields to control the text of the website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="contact_us">Contact us</Label>
                <Input
                  id="contact_us"
                  type="text"
                  value={formValues.contact_us || ""}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="about_us">About us</Label>
                <Input
                  id="about_us"
                  type="text"
                  value={formValues.about_us || ""}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="match_rules">Match rules</Label>
                <Input
                  id="match_rules"
                  type="text"
                  value={formValues.match_rules || ""}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="locations">Our locations</Label>
                <Input
                  id="locations"
                  type="text"
                  value={formValues.locations || ""}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="jobs">Jobs</Label>
                <Input
                  id="jobs"
                  type="text"
                  value={formValues.jobs || ""}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? (
                <span className="flex items-center">
                  <CircularProgressBar size={24} />
                  Saving...
                </span>
              ) : (
                "Save"
              )}
            </Button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </CardFooter>
        </Card>
      )}
    </>
  );
}
