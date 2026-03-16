import { getEvents } from "@/lib/events";
import { getDepartments } from "@/lib/stats";
import { EventsClient } from "@/components/events/EventsClient";
import { PageHero } from "@/components/shared/PageHero";
import { IMAGES } from "@/lib/images";
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

  const today = new Date().toISOString().split("T")[0];
  const upcomingCount = events.filter((e) => e.date >= today).length;
  const pastCount = events.filter((e) => e.date < today).length;
  const yearsCovered = new Set(events.map((e) => e.year)).size;

  return (
    <>
      <PageHero
        title="Events"
        subtitle="Technical festivals, cultural programmes, workshops, and official ceremonies at SSJCOE."
        ghostText="EVENTS"
        image={IMAGES.event_techfest}
        crumbs={[{ label: "Home", href: "/" }, { label: "Events" }]}
        stats={[
          { value: String(upcomingCount), label: "Upcoming" },
          { value: String(pastCount), label: "Past events" },
          { value: String(yearsCovered), label: "Years covered" },
        ]}
      />
      <div className="container section">
        <EventsClient initialEvents={events} departments={departments} />
      </div>
    </>
  );
}
