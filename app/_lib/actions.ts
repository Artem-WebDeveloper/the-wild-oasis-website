"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";

export async function updateGuest(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const nationalityRaw = formData.get("nationality");

  if (typeof nationalID !== "string" || typeof nationalityRaw !== "string") {
    throw new Error("Invalid form data");
  }

  const [nationality, countryFlag] = nationalityRaw.split("%");

  if (!/^[A-Za-z0-9]{6,12}$/.test(nationalID)) {
    throw new Error("Please provide a valid national ID");
  }

  const updateData = { nationalID, nationality, countryFlag };

  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) {
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function deleteReservation(bookingId: number) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);

  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingsIds.includes(bookingId)) {
    throw new Error("You are not allowed to delete this booking");
  }

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
}

export async function updateBooking(formData: FormData) {
  const reservationId = formData.get("reservationId");
  // 1. Аутентификация
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2. Авторизация
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingsIds.includes(Number(reservationId))) {
    throw new Error("You are not allowed to update this booking");
  }

  // 3. Получение обновленных данных
  const observations = formData.get("observations")?.slice(0, 1000);
  const numGuests = formData.get("numGuests");

  if (
    typeof reservationId !== "string" ||
    typeof observations !== "string" ||
    typeof numGuests !== "string"
  ) {
    throw new Error("Invalid form data");
  }

  // 4. Мутация
  const { error } = await supabase
    .from("bookings")
    .update({ observations, numGuests: Number(numGuests) })
    .eq("id", Number(reservationId))
    .select()
    .single();

  // 5. Обработка ошибок
  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  // 6. Перенаправление на другую страницу
  redirect("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
