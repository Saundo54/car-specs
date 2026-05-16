export interface VehicleSpec {
  id: string;
  make: string;
  model: string;
  year: number;
  variant: string;
  body_type: string;
  fuel_type: string;
  drivetrain: string;
  seats: number;
  ancap_rating: number;
  ancap_test_year?: number;
  specs: {
    mechanical: Record<string, string>;
    dimensions: Record<string, string>;
    safety: Record<string, string>;
    tech: Record<string, string>;
    interior: Record<string, string>;
  };
}

export const MOCK_VEHICLES: VehicleSpec[] = [
  {
    id: "toyota-corolla-2020-hybrid-sx",
    make: "Toyota",
    model: "Corolla",
    year: 2020,
    variant: "SX Hybrid",
    body_type: "Sedan",
    fuel_type: "Hybrid",
    drivetrain: "FWD",
    seats: 5,
    ancap_rating: 5,
    ancap_test_year: 2019,
    specs: {
      mechanical: {
        "Engine": "1.8L 4-cylinder Hybrid",
        "Power": "90 kW (Combined)",
        "Torque": "142 Nm",
        "Transmission": "CVT",
        "Fuel Consumption": "3.5 L/100km"
      },
      dimensions: {
        "Length": "4630 mm",
        "Width": "1780 mm",
        "Height": "1435 mm",
        "Boot Capacity": "470 L"
      },
      safety: {
        "Airbags": "7",
        "AEB": "Yes (Pedestrian & Cyclist)",
        "Lane Trace Assist": "Yes"
      },
      tech: {
        "Apple CarPlay": "Yes",
        "Android Auto": "Yes",
        "Screen Size": "8-inch"
      },
      interior: {
        "Climate Control": "Dual-zone",
        "Seats": "Fabric"
      }
    }
  },
  {
    id: "mazda-6-2018-atenza",
    make: "Mazda",
    model: "6",
    year: 2018,
    variant: "Atenza",
    body_type: "Sedan",
    fuel_type: "Petrol",
    drivetrain: "FWD",
    seats: 5,
    ancap_rating: 5,
    ancap_test_year: 2012,
    specs: {
      mechanical: {
        "Engine": "2.5L 4-cylinder Turbo",
        "Power": "170 kW",
        "Torque": "420 Nm",
        "Transmission": "6-speed Automatic",
        "Fuel Consumption": "7.6 L/100km"
      },
      dimensions: {
        "Length": "4865 mm",
        "Width": "1840 mm",
        "Height": "1450 mm",
        "Boot Capacity": "474 L"
      },
      safety: {
        "Airbags": "6",
        "AEB": "Yes (Forward & Reverse)",
        "Blind Spot Monitoring": "Yes"
      },
      tech: {
        "Apple CarPlay": "Yes (Retrofit)",
        "Android Auto": "Yes (Retrofit)",
        "Sound System": "11-speaker Bose"
      },
      interior: {
        "Climate Control": "Dual-zone",
        "Seats": "Nappa Leather"
      }
    }
  },
  {
    id: "toyota-camry-2025-hybrid-sl",
    make: "Toyota",
    model: "Camry",
    year: 2025,
    variant: "SL Hybrid",
    body_type: "Sedan",
    fuel_type: "Hybrid",
    drivetrain: "FWD",
    seats: 5,
    ancap_rating: 5,
    ancap_test_year: 2024,
    specs: {
      mechanical: {
        "Engine": "2.5L 4-cylinder Hybrid",
        "Power": "170 kW (Combined)",
        "Torque": "221 Nm",
        "Transmission": "e-CVT",
        "Fuel Consumption": "4.3 L/100km"
      },
      dimensions: {
        "Length": "4920 mm",
        "Width": "1840 mm",
        "Height": "1445 mm",
        "Boot Capacity": "524 L"
      },
      safety: {
        "Airbags": "9",
        "AEB": "Yes (Latest Gen)",
        "Junction Assist": "Yes"
      },
      tech: {
        "Apple CarPlay": "Wireless",
        "Android Auto": "Wireless",
        "Screen Size": "12.3-inch"
      },
      interior: {
        "Climate Control": "Tri-zone",
        "Seats": "Ventilated Leather"
      }
    }
  }
];
