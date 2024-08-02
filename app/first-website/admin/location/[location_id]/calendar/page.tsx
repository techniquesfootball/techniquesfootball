import { CalendarPage } from "./calendar";

// interface Params {
//   location_id: string;
// }

// export async function generateStaticParams() {
//   return [{ location_id: "1" }];
// }

// interface PageProps {
//   params: Params;
// }

// export default function Page({ params }: PageProps) {
//   const locationId = params.location_id || ""; // Use the params location_id or default to an empty string

//   return (
//     <CalendarPage
//       params={{
//         location_id: locationId,
//       }}
//     />
//   );
// }

export async function generateStaticParams() {
  return [{ location_id: "1" }];
}

// Three versions of this page will be statically generated
// using the params returned by generateStaticParams
// - /product/1
// - /product/2
// - /product/3
export default async function Page({
  params,
}: {
  params: { location_id: string };
}) {
  const { location_id } = params;

  return (
    <CalendarPage
      params={{
        location_id: location_id,
      }}
    />
  );

  // ...
}
