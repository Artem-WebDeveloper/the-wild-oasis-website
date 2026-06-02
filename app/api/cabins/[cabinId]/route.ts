import { NextRequest } from "next/server";
import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cabinId: string }> },
) {
  const { cabinId } = await params;

  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(Number(cabinId)),
      getBookedDatesByCabinId(Number(cabinId)),
    ]);
    return Response.json({ cabin, bookedDates });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Error";
    return Response.json({ message: `Cabin not found! Error: ${message}` });
  }
}

// export async function POST() {}
