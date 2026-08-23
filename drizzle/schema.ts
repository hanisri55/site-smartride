import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  passwordHash: text("passwordHash"),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  dateOfBirth: varchar("dateOfBirth", { length: 32 }),
  college: varchar("college", { length: 255 }),
  course: varchar("course", { length: 255 }),
  city: varchar("city", { length: 255 }),
  routeId: int("routeId"),
  pickupPoint: varchar("pickupPoint", { length: 255 }),
  bio: text("bio"),
  profileImage: text("profileImage"),
  phoneNumber: varchar("phoneNumber", { length: 32 }),
  studyYear: varchar("studyYear", { length: 32 }),
  gender: varchar("gender", { length: 64 }),
  genderPreference: varchar("genderPreference", { length: 64 }),
  verificationStatus: mysqlEnum("verificationStatus", ["unverified", "pending", "verified"]).default("unverified").notNull(),
  interests: text("interests"),
  preferences: text("preferences"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const routes = mysqlTable("routes", {
  id: int("id").autoincrement().primaryKey(),
  routeNumber: varchar("routeNumber", { length: 32 }).notNull().unique(),
  routeName: varchar("routeName", { length: 255 }).notNull(),
  origin: varchar("origin", { length: 255 }).notNull(),
  destination: varchar("destination", { length: 255 }).notNull(),
  stops: text("stops").notNull(),
  routeType: mysqlEnum("routeType", ["campus", "local"]).default("campus").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const rides = mysqlTable("rides", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(),
  routeId: int("routeId").notNull(),
  pickupPoint: varchar("pickupPoint", { length: 255 }).notNull(),
  destination: varchar("destination", { length: 255 }).notNull(),
  date: varchar("date", { length: 16 }).notNull(),
  time: varchar("time", { length: 16 }).notNull(),
  availableSeats: int("availableSeats").notNull(),
  notes: text("notes"),
  vehicleType: varchar("vehicleType", { length: 64 }),
  genderPreference: varchar("genderPreference", { length: 64 }),
  contactPreference: varchar("contactPreference", { length: 64 }),
  status: mysqlEnum("status", ["upcoming", "completed", "cancelled"]).default("upcoming").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const smartPools = mysqlTable("smartPools", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(),
  routeId: int("routeId").notNull(),
  pickupPoint: varchar("pickupPoint", { length: 255 }).notNull(),
  departureTime: varchar("departureTime", { length: 32 }).notNull(),
  capacity: int("capacity").notNull(),
  status: mysqlEnum("status", ["open", "full", "cancelled", "completed"]).default("open").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const smartPoolMembers = mysqlTable("smartPoolMembers", {
  id: int("id").autoincrement().primaryKey(),
  smartPoolId: int("smartPoolId").notNull(),
  userId: int("userId").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export const rideRequests = mysqlTable("rideRequests", {
  id: int("id").autoincrement().primaryKey(),
  rideId: int("rideId").notNull(),
  requesterId: int("requesterId").notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "rejected", "cancelled"]).default("pending").notNull(),
  message: text("message"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const passwordResets = mysqlTable("passwordResets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tokenHash: varchar("tokenHash", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const emailVerifications = mysqlTable("emailVerifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tokenHash: varchar("tokenHash", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  verifiedAt: timestamp("verifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 64 }).notNull(),
  message: text("message").notNull(),
  read: int("read").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Route = typeof routes.$inferSelect;
export type Ride = typeof rides.$inferSelect;
export type SmartPool = typeof smartPools.$inferSelect;
export type SmartPoolMember = typeof smartPoolMembers.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type RideRequest = typeof rideRequests.$inferSelect;
export type PasswordReset = typeof passwordResets.$inferSelect;
export type EmailVerification = typeof emailVerifications.$inferSelect;
