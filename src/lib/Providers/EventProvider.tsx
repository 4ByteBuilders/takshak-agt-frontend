import { supabase } from "@/supabaseClient";
import { Event } from "@/utils/interfaces";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";

interface EventContextType {
  event: Event | null;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const getEvent = async () => {
      const event = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/event/get-latest"
      );
      event.data.photoUrls = JSON.parse(event.data.photoUrls);

      setEvent(event.data);
    };

    getEvent();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      getEvent();
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <EventContext.Provider value={{ event }}>{children}</EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an EventProvider");
  }
  return context;
};
