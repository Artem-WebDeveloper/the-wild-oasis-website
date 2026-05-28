import z, { email, number, string } from "zod";

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
  countryFlag: z.string(),
  created_at: z.string(),
  email: z.string(),
  fullName: z.string(),
  id: z.number(),
  nationalID: z.string(),
  nationality: z.string(),
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

export const SettingsSchema = z.object({});
