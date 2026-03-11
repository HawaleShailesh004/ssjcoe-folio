import { getEvents } from "@/lib/events";
import { getDepartments } from "@/lib/stats";
import { EventsClient } from "@/components/events/EventsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Technical, cultural and official events at SSJCOE.",
};

export default async function EventsPage() {
  const [events, departments] = await Promise.all([
    getEvents(),
    getDepartments(),
  ]);
  return (
    <EventsClient initialEvents={events} departments={departments} />
  );
}
