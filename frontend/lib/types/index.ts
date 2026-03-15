export type EventType = "HARVEST" | "PROCESSING" | "SHIPPING" | "RETAIL";

export interface Product {
  id: string;
  name: string;
  origin: string;
  owner: string; // Stellar address
  timestamp: number;
  authorizedActors: string[];
}

export interface TrackingEvent {
  productId: string;
  location: string;
  actor: string; // Stellar address
  timestamp: number;
  eventType: EventType;
  metadata: string; // JSON string
}
