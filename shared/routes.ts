export type RouteSeed = {
  routeNumber: string;
  routeName: string;
  origin: string;
  destination: string;
  stops: string[];
  routeType: "campus" | "local";
};

const origins = [
  "Palakollu", "Jangareddygudem", "Rajamahendravaram", "Eluru", "Bhimadole", "Gopalapuram", "Kovvuru", "Tyajampudi", "Munipalli", "Penugonda", "Ravulapalem", "Gowrupalli", "Relangi", "Nidadavole", "Bhimavaram", "Yadavolu", "Kalavalapalli", "Chagallu", "Krovvidi", "Attili", "Velagadurru", "Iragavaram", "Tanuku", "Undrajavaram", "Thimmarajupalem", "Pothavaram", "Manchili", "Velivennu", "Mandapaka", "Kaldari", "Pullalapadu", "Jagannadhapuram", "Chodavaram", "Singarajupalem", "Duvva", "Tadepalligudem", "Devarapalli", "Nallajerla", "Bommuru", "Kadiyam", "Dwarapudi", "Malkipuram",
];

const stopSets: Record<string, string[]> = {
  Palakollu: ["Palakollu RTC", "Bhimavaram Junction", "Tanuku Bypass", "SASI Main Gate"],
  Eluru: ["Eluru Bus Stand", "Bhimadole Center", "Denduluru", "SASI Main Gate"],
  Tadepalligudem: ["Town Hall", "Railway Station", "SASI Hostel Road", "SASI Main Gate"],
  default: ["Town Center", "Market Junction", "Railway Station", "SASI Main Gate"],
};

export const routeSeeds: RouteSeed[] = origins.map((origin, index) => ({
  routeNumber: `SR-${String(index + 1).padStart(2, "0")}`,
  routeName: `${origin} · SASI Campus Connector`,
  origin,
  destination: "SASI Institute of Technology & Engineering",
  stops: stopSets[origin] ?? stopSets.default,
  routeType: "campus",
}));

export const localRouteSeeds: RouteSeed[] = [
  { routeNumber: "TPG-L1", routeName: "Tadepalligudem Core Loop", origin: "Tadepalligudem", destination: "SASI Institute of Technology & Engineering", stops: ["Municipal Office", "Old Bus Stand", "SASI Main Gate"], routeType: "local" },
  { routeNumber: "TPG-L2", routeName: "Railway Station Link", origin: "Tadepalligudem", destination: "SASI Institute of Technology & Engineering", stops: ["Railway Station", "NIT Road", "SASI Main Gate"], routeType: "local" },
  { routeNumber: "TPG-L3", routeName: "Hostel District Shuttle", origin: "Tadepalligudem", destination: "SASI Institute of Technology & Engineering", stops: ["Hostel District", "Library Junction", "SASI Main Gate"], routeType: "local" },
];

export const allRouteSeeds = [...routeSeeds, ...localRouteSeeds];
