"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CAPACITY_STATUSES } from "../_lib/constants";
import { CapacityStatus } from "../_lib/schemas";

const FILTER_LABELS: Record<CapacityStatus, string> = {
  all: "All cabins",
  small: " 1-3 guests",
  medium: "4-7 guests",
  large: "8-12 guests",
};

function Filter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const activeFilter = searchParams.get("capacity") ?? "all";

  function handleFilter(status: CapacityStatus) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", status);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex border border-primary-800">
      {CAPACITY_STATUSES.map((status) => {
        return (
          <button
            className={`px-5 py-2 hover:bg-primary-700 ${activeFilter === status ? "bg-primary-700 text-primary-50" : ""}`}
            key={status}
            disabled={activeFilter === status}
            onClick={() => handleFilter(status)}
          >
            {FILTER_LABELS[status]}
          </button>
        );
      })}
    </div>
  );
}

export default Filter;
