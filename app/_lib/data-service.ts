import { notFound } from "next/navigation";
import { eachDayOfInterval } from "date-fns";
import { supabase } from "./supabase";
import {
  BookingSchema,
  CabinDetailSchema,
  CabinPriceSchema,
  CabinSchema,
  CountryFormSchema,
  GuestSchema,
  SettingSchema,
} from "./schemas";
import z from "zod";

/////////////
// GET

export async function getCabin(id: number) {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  // For testing
  // await new Promise((res) => setTimeout(res, 1000));

  if (error) {
    console.error(error);
    notFound();
  }

  return CabinDetailSchema.parse(data);
}

export async function getCabinPrice(id: number) {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return CabinPriceSchema.parse(data);
}

export const getCabins = async function () {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .order("name");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  const parseData = CabinSchema.array().parse(data);

  return parseData;
};

// Guests are uniquely identified by their email address
export async function getGuest(email: string) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  if (!data) return null;
  return GuestSchema.parse(data);
}

export async function getBooking(id: number) {
  const { data, error, count } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

export async function getBookings(guestId: number) {
  const { data, error, count } = await supabase
    .from("bookings")
    // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)",
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return BookingSchema.array().parse(data);
}

export async function getBookedDatesByCabinId(cabinId: number) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  // Getting all bookings
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${todayISO},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return z.array(z.date()).parse(bookedDates);
}

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();
  // await new Promise((res) => setTimeout(res, 3000));
  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return SettingSchema.parse(data);
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag",
      { signal: AbortSignal.timeout(30_000) },
    );

    if (!res.ok) throw new Error("Could not fetch countries");
    const countries = await res.json();

    console.log(countries);

    return CountryFormSchema.array().parse(countries);
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE

export async function createGuest(newGuest: {
  email: string;
  fullName: string;
}) {
  const { data, error } = await supabase.from("guests").insert([newGuest]);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

export async function createBooking(newBooking) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}

/////////////
// UPDATE

// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id: number, updatedFields) {
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  return data;
}

export async function updateBooking(id: number, updatedFields) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id: number) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

// Countries MOCK
/* 
const countries = [
  {
    name: "Burkina Faso",
    flag: "https://flagcdn.com/bf.svg",
    independent: false,
  },
  {
    name: "Burundi",
    flag: "https://flagcdn.com/bi.svg",
    independent: false,
  },
  {
    name: "Cambodia",
    flag: "https://flagcdn.com/kh.svg",
    independent: false,
  },
  {
    name: "Cameroon",
    flag: "https://flagcdn.com/cm.svg",
    independent: false,
  },
  {
    name: "Canada",
    flag: "https://flagcdn.com/ca.svg",
    independent: false,
  },
  {
    name: "Cabo Verde",
    flag: "https://flagcdn.com/cv.svg",
    independent: false,
  },
  {
    name: "Cayman Islands",
    flag: "https://flagcdn.com/ky.svg",
    independent: false,
  },
  {
    name: "Central African Republic",
    flag: "https://flagcdn.com/cf.svg",
    independent: false,
  },
  {
    name: "Chad",
    flag: "https://flagcdn.com/td.svg",
    independent: false,
  },
  {
    name: "Chile",
    flag: "https://flagcdn.com/cl.svg",
    independent: false,
  },
  {
    name: "China",
    flag: "https://flagcdn.com/cn.svg",
    independent: false,
  },
  {
    name: "Christmas Island",
    flag: "https://flagcdn.com/cx.svg",
    independent: false,
  },
  {
    name: "Cocos (Keeling) Islands",
    flag: "https://flagcdn.com/cc.svg",
    independent: false,
  },
];
*/
