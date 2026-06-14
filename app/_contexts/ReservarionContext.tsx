"use client";

import { createContext, Dispatch, SetStateAction, use, useState } from "react";
import { DateRange } from "react-day-picker";

type ContextType = {
  range: DateRange | undefined;
  setRange: Dispatch<SetStateAction<DateRange | undefined>>;
  resetRange: () => void;
};

const ReservationContext = createContext<ContextType | null>(null);

const initialState = {
  from: undefined,
  to: undefined,
};

function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<DateRange | undefined>(initialState);

  const resetRange = () => setRange(initialState);

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = use(ReservationContext);
  if (!context) throw new Error("Context was used outside provider");

  return context;
}

export { ReservationProvider, useReservation };
