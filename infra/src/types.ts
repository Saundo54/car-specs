export interface VehicleSpec {
  pk: string; // make#model
  sk: string; // year#variant
  make: string;
  model: string;
  year: number;
  variant: string;
  body_type: string;
  fuel_type: string;
  drivetrain: string;
  seats: number;
  specs: {
    mechanical: Record<string, any>;
    dimensions: Record<string, any>;
    exterior: Record<string, any>;
    interior: Record<string, any>;
    safety: Record<string, any>;
    technology: Record<string, any>;
  };
  ancap_rating?: number;
  source_url: string;
  last_updated: string;
  schema_version: string;
}
