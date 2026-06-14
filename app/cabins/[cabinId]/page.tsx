import { Suspense } from "react";

import Reservation from "@/app/_components/Reservation";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import Spinner from "@/app/_components/Spinner";
import Cabin from "@/app/_components/Cabin";

/* 
export const metadata = {
  title: "Cabin",
}; */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cabinId: string }>;
}) {
  const { cabinId } = await params;
  const cabin = await getCabin(Number(cabinId));
  return { title: `Cabin ${cabin.name}` };
}

// Чтобы из динамических маршрутов преобразовать в статические
export async function generateStaticParams() {
  const cabins = await getCabins();
  const ids = cabins.map((cabin) => ({
    cabinId: String(cabin.id),
  }));

  return ids;
}

export default async function Page({
  params,
}: {
  params: Promise<{ cabinId: string }>;
}) {
  const { cabinId } = await params;

  // Waterfall запросов
  const cabin = await getCabin(Number(cabinId));
  // const bookedDates = await getBookedDatesByCabinId(Number(cabinId));
  // const settings = await getSettings();

  return (
    <div className="mx-auto mt-8 max-w-6xl">
      <Cabin cabin={cabin} />

      <div>
        <h2 className="mb-10 text-center text-5xl font-semibold text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />} key={cabin.id}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
