import z from "zod";
import { CAPACITY_STATUSES } from "./constants";

const BOOKING_STATUSES = ["checked-out", "checked-in", "unconfirmed"] as const;

export const CabinSchema = z.object({
  discount: z.number().catch(0),
  id: z.number(),
  image: z.string(),
  maxCapacity: z.number(),
  name: z.string(),
  regularPrice: z.number(),
});

export type Cabin = z.infer<typeof CabinSchema>;

export const CabinDetailSchema = CabinSchema.pick({
  id: true,
  name: true,
  image: true,
  maxCapacity: true,
  regularPrice: true,
  discount: true,
}).extend({
  description: z.string().catch(""),
  created_at: z.string(),
});

export type CabinDetail = z.infer<typeof CabinDetailSchema>;

export const CabinPriceSchema = CabinSchema.pick({
  discount: true,
  regularPrice: true,
});

export const GuestSchema = z.object({
  countryFlag: z.string().nullable(),
  created_at: z.string(),
  email: z.string(),
  fullName: z.string(),
  id: z.number(),
  nationalID: z.string().nullable(),
  nationality: z.string().nullable(),
});

export type Guest = z.infer<typeof GuestSchema>;

export const BookingSchema = z.object({
  cabinId: z.number(),
  cabins: CabinSchema.pick({
    image: true,
    name: true,
  }),
  created_at: z.string(),
  endDate: z.string(),
  guestId: z.number(),
  id: z.number(),
  numGuests: z.number(),
  numNights: z.number(),
  startDate: z.string(),
  totalPrice: z.number(),
});

export type Booking = z.infer<typeof BookingSchema>;

export const BookingDetailSchema = BookingSchema.omit({
  cabins: true,
}).extend({
  cabinPrice: z.number(),
  extrasPrice: z.number(),
  hasBreakfast: z.boolean(),
  isPaid: z.boolean(),
  status: z.enum(BOOKING_STATUSES).catch("unconfirmed"),
  observations: z.string().catch(""),
});

export type BookingDetail = z.infer<typeof BookingDetailSchema>;

export const SettingsSchema = z.object({});

export type CapacityStatus = (typeof CAPACITY_STATUSES)[number];

export function validateCapacity(
  value: string | undefined,
): value is CapacityStatus {
  if (value === undefined) return false;
  return CAPACITY_STATUSES.some((val) => val === value);
}

export const CountryFormSchema = z.object({
  name: z.string(),
  flag: z.string(),
  independent: z.boolean(),
});

export type CountryForm = z.infer<typeof CountryFormSchema>;

export const SettingSchema = z.object({
  breakfastPrice: z.number(),
  maxBookingLength: z.number(),
  maxGuestsPerBooking: z.number(),
  minBookingLength: z.number(),
});

export type Settings = z.infer<typeof SettingSchema>;

export const createBookingSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  numNights: z.number().positive().int(),
  cabinPrice: z.number(),
  cabinId: z.number().int().positive(),
  numGuests: z.coerce.number().positive().int(),
  observations: z.string().max(1000).catch(""),
});
