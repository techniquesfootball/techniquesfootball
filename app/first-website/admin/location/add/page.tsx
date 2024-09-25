"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import CircularProgressBar from "@/components/ui/circular-progress-bar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { createLocation } from "@/lib/locations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

const center = {
  lat: 14.599512,
  lng: 120.984222,
};

export default function Page() {
  const router = useRouter();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [surfaceType, setSurfaceType] = React.useState("");
  const [lighting, setLighting] = React.useState(false);
  const [parking, setParking] = React.useState(false);

  const {
    ready,
    value,
    suggestions: { status, data: data2 },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      // Define search scope here
    },

    debounce: 300,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    new window.google.maps.LatLngBounds(center);
    setMap(map);
  }, []);

  const onUnmount = useCallback((map: google.maps.Map | null) => {
    setMap(null);
  }, []);

  const ref = useOnclickOutside(() => {
    clearSuggestions();
  });

  const [markerPosition, setMarkerPosition] =
    useState<google.maps.LatLngLiteral | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }: { description: string }) =>
    () => {
      setValue(description, false);
      clearSuggestions();
      getGeocode({ address: description }).then((results) => {
        const { lat, lng } = getLatLng(results[0]);
        setMarkerPosition({ lat, lng });
        setAddress(description || "Address not found");
        if (map) {
          map.panTo({ lat, lng });
        }
      });
    };

  const onMapClick = useCallback(async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setMarkerPosition(position);
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.lat},${position.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      try {
        const response = await fetch(geocodeUrl);
        if (!response.ok) {
          throw new Error(`Geocode error: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.status === "OK") {
          const formattedAddress = data.results[0]?.formatted_address;
          setAddress(formattedAddress || "Address not found");
          console.log("Address:", formattedAddress);
        } else {
          console.error("Geocode error:", data.status);
        }
      } catch (error) {
        console.error("Error during geocoding:", error);
      }
    }
  }, []);

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

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    try {
      await createLocation({
        longitude: markerPosition!.lng.toString(),
        latitude: markerPosition!.lat.toString(),
        location: address!,
        contact_person: formData.contact_person,
        email: formData.email,
        phone_number: formData.phone_number,
        surface_type: surfaceType,
        lighting: lighting ? 1 : 0,
        parking: parking ? 1 : 0,
        description: formData.description,
      });
      toast({
        title: "Success",
        description: "Location data has been saved.",
      });
      setTimeout(() => {
        router.push("/first-website/admin/location");
      }, 1000);
      reset();
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
      <div className="w-full flex justify-between">
        <Link href="/first-website/admin/location">
          <Button variant="link">
            <ChevronLeftIcon className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>
      {isLoaded ? (
        <div ref={ref} className="w-full sm:w-[780px]">
          <Input
            value={value}
            onChange={handleInput}
            disabled={!ready}
            placeholder="Where are you going?"
            className="mb-2 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
          />
          {status === "OK" && (
            <ul className="bg-white border border-gray-200 rounded-md shadow-lg mt-2">
              {data2.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={handleSelect(suggestion)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 border-b last:border-none"
                >
                  <strong>{suggestion.structured_formatting.main_text}</strong>{" "}
                  <small>
                    {suggestion.structured_formatting.secondary_text}
                  </small>
                </li>
              ))}
            </ul>
          )}
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "400px",
              marginTop: "10px",
            }}
            center={markerPosition || center}
            zoom={11}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={onMapClick}
          >
            {markerPosition && <Marker position={markerPosition} />}
          </GoogleMap>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full sm:w-[780px]">
        <Label htmlFor="contact-info" className="text-right">
          Contact Information
        </Label>
        <div className="col-span-2 grid gap-2 mt-3 mb-3">
          <Input
            {...register("contact_person")}
            placeholder="Contact Person"
            className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
          />
          <Input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
          />
          <Input
            {...register("phone_number")}
            type="tel"
            placeholder="Phone Number"
            className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
          />
        </div>
        <Label htmlFor="surface-type" className="text-right">
          Surface Type
        </Label>
        <Select value={surfaceType} onValueChange={setSurfaceType}>
          <SelectTrigger>
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
        <div className="flex flex-col mb-3 mt-3">
          <div className="flex items-center">
            <Label htmlFor="lighting" className="text-right mr-2">
              Lighting
            </Label>
            <Switch
              id="lighting"
              checked={lighting}
              onCheckedChange={setLighting}
            />
          </div>
          <div className="flex items-center mt-3">
            <Label htmlFor="parking" className="text-right mr-2">
              Parking Availability
            </Label>
            <Switch
              id="parking"
              checked={parking}
              onCheckedChange={setParking}
            />
          </div>
        </div>
        <Label htmlFor="description" className="text-right ">
          Description
        </Label>
        <Textarea
          id="description"
          {...register("description")}
          className="sm:col-span-2 mb-3 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-start space-x-2">
              <CircularProgressBar size={24} />
              <span>Saving...</span>
            </span>
          ) : (
            "Save"
          )}
        </Button>
      </form>
    </>
  );
}
