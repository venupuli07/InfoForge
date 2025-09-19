import type { Schema } from "./App";

export const SCHEMAS: Schema[] = [
  {
    id: "bikes",
    title: "Bikes",
    fields: [
      { key: "ID", label: "ID", kind: "Integer", required: true },
      { key: "Brand", label: "Brand", kind: "SmallText", required: true },
      { key: "Model", label: "Model", kind: "SmallText", required: true },
      { key: "Type", label: "Type", kind: "SmallText" },
      { key: "EngineCC", label: "Engine CC", kind: "Integer" }
    ]
  },
  {
    id: "games",
    title: "Games",
    fields: [
      { key: "ID", label: "ID", kind: "Integer", required: true },
      { key: "Title", label: "Title", kind: "SmallText", required: true },
      { key: "Genre", label: "Genre", kind: "SmallText" },
      { key: "Platform", label: "Platform", kind: "SmallText" },
      { key: "Developer", label: "Developer", kind: "SmallText" },
      { key: "Rating", label: "Rating", kind: "Float" }
    ]
  },
  {
    id: "movies",
    title: "Movies",
    fields: [
      { key: "ID", label: "ID", kind: "Integer", required: true },
      { key: "Title", label: "Title", kind: "SmallText", required: true },
      { key: "Genre", label: "Genre", kind: "SmallText" },
      { key: "Director", label: "Director", kind: "SmallText" },
      { key: "ReleaseYear", label: "Release Year", kind: "Integer" },
      { key: "DurationMinutes", label: "Duration (Minutes)", kind: "Integer" }
    ]
  },
  {
    id: "events",
    title: "Events",
    fields: [
      { key: "ID", label: "ID", kind: "Integer", required: true },
      { key: "Name", label: "Name", kind: "SmallText", required: true },
      { key: "Type", label: "Type", kind: "SmallText" },
      { key: "Location", label: "Location", kind: "SmallText" },
      { key: "EventDate", label: "Event Date", kind: "DateTime", required: true },
      { key: "Organizer", label: "Organizer", kind: "SmallText" },
      { key: "TicketPrice", label: "Ticket Price", kind: "Integer" }
    ]
  }
];