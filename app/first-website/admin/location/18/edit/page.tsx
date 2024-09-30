"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { readLocationById, updateLocation } from "@/lib/locations";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import CircularProgressBar from "@/components/ui/circular-progress-bar";
import Loader from "@/components/ui/loader";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { location_id: number } }) {
  const router = useRouter();
  const [surfaceType, setSurfaceType] = React.useState("");
  const [lighting, setLighting] = React.useState(false);
  const [parking, setParking] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editLocation, setEditLocation] = React.useState<LocationModel | null>(
    null
  );
  const [isLoading, setLoading] = useState(false);
  const FormSchema = z.object({
    contact_person: z.string().min(2, {
      message: "Contact person must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Invalid email address.",
    }),
    phone_number: z.string().min(11, {
      message: "Phone number must be at least 10 characters.",
    }),
    surface_type: z.string(),
    lighting: z.string(),
    parking: z.string(),
    description: z.string(),
  });

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const location = await readLocationById(params.location_id);

        if (typeof location === "string") {
          toast({
            title: "Error",
            description: "Error",
          });
          setLoading(false);
        } else {
          setEditLocation(location);
          setLoading(true);
        }
      } catch (e) {
        setLoading(true);
      } finally {
        setLoading(true);
      }
    };
  }, [params.location_id]);

  const resetFields = () => {
    setEditLocation(null);
    setSurfaceType("");
    setLighting(false);
    setParking(false);
    reset({
      contact_person: "",
      email: "",
      phone_number: "",
      surface_type: "",
      lighting: "0",
      parking: "0",
      description: "",
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      contact_person: "",
      email: "",
      phone_number: "",
      password: "",
      lighting: "",
      parking: "",
      description: "",
      status: "",
      surface_type: "",
    },
  });

  React.useEffect(() => {
    if (editLocation) {
      reset({
        contact_person: editLocation.contact_person || "",
        email: editLocation.email || "",
        phone_number: editLocation.phone_number || "",
        surface_type: editLocation.surface_type || "",
        lighting: editLocation.lighting ? "1" : "0",
        parking: editLocation.parking ? "1" : "0",
        description: editLocation.description || "",
      });
      setSurfaceType(editLocation.surface_type || "");
      setLighting(editLocation.lighting ? true : false);
      setParking(editLocation.parking ? true : false);
    }
  }, [editLocation, reset]);

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    const updates: Partial<LocationModel> = {
      contact_person: formData.contact_person,
      email: formData.email,
      phone_number: formData.phone_number,
      surface_type: surfaceType,
      lighting: lighting ? 1 : 0,
      parking: parking ? 1 : 0,
      description: formData.description,
    };

    try {
      await updateLocation(editLocation!.location_id as number, updates);

      toast({
        title: "Success",
        description: "Location data has been saved.",
      });
      setTimeout(() => {
        router.push("/first-website/admin/location");
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {isLoading ? (
        <>
          <div className="w-full flex justify-between mb-3">
            <Link href="/first-website/admin/location">
              <Button variant="link">
                <ChevronLeftIcon className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                <Label htmlFor="contact-info" className="text-right">
                  Contact Information
                </Label>
                <div className="col-span-2 grid gap-2">
                  <Input
                    {...register("contact_person")}
                    placeholder="Contact Person"
                  />
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="Email"
                  />
                  <Input
                    {...register("phone_number")}
                    type="tel"
                    placeholder="Phone Number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                <Label htmlFor="surface-type" className="text-right">
                  Surface Type
                </Label>
                <Select value={surfaceType} onValueChange={setSurfaceType}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="grass">Grass</SelectItem>
                      <SelectItem value="turf">Turf</SelectItem>
                      <SelectItem value="indoor">Indoor</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                <Label htmlFor="lighting" className="text-right">
                  Lighting
                </Label>
                <Switch
                  id="lighting"
                  checked={lighting}
                  onCheckedChange={setLighting}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                <Label htmlFor="parking" className="text-right">
                  Parking Availability
                </Label>
                <Switch
                  id="parking"
                  checked={parking}
                  onCheckedChange={setParking}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  className="w-full sm:col-span-2"
                />
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center space-x-2">
                  <CircularProgressBar size={24} />
                  <span>Saving...</span>
                </span>
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}
