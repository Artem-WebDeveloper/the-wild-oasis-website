// import { connection } from "next/server";
import { getCabins } from "../_lib/data-service";
import { Cabin, CapacityStatus } from "../_lib/schemas";
import CabinCard from "./CabinCard";

function getFilteredCabins(cabins: Cabin[], filter: CapacityStatus) {
  switch (filter) {
    case "small": {
      return cabins.filter((cabin) => cabin.maxCapacity <= 3);
    }
    case "medium": {
      return cabins.filter(
        (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7,
      );
    }
    case "large": {
      return cabins.filter((cabin) => cabin.maxCapacity >= 8);
    }
    case "all":
    default: {
      return cabins;
    }
  }
}

async function CabinList({ filter }: { filter: CapacityStatus }) {
  // unstable_noStore(); - устарела
  // await connection(); // новый асинхронный стандарт для мгновенного отключения кэша

  const cabins = await getCabins();

  if (!cabins.length) return null;

  const dispalayedCabins = getFilteredCabins(cabins, filter);

  return (
    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:gap-12 xl:gap-14">
      {dispalayedCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinList;
