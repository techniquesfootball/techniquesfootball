import { CalendarPage } from "./calendar";

interface Params {
  location_id: string;
}

export function generateStaticParams(): Params[] {
  return [{ location_id: "1" }];
}

interface PageProps {
  params: Params;
}

export default async function Page({ params }: PageProps) {
  const locationId = params.location_id || ""; // Use the params location_id or default to an empty string

  return (
    <CalendarPage
      params={{
        location_id: locationId,
      }}
    />
  );
}
