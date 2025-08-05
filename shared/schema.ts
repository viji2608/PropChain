import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  nftTokens: integer("nft_tokens").notNull().default(0),
  cw20Tokens: integer("cw20_tokens").notNull().default(0),
  monthlyIncome: integer("monthly_income").notNull().default(0),
  valuation: integer("valuation").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const votingProposals = pgTable("voting_proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  propertyId: varchar("property_id").references(() => properties.id).notNull(),
  yesVotes: integer("yes_votes").notNull().default(0),
  noVotes: integer("no_votes").notNull().default(0),
  totalVotes: integer("total_votes").notNull().default(0),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const valuationReports = pgTable("valuation_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").references(() => properties.id).notNull(),
  valuation: integer("valuation").notNull(),
  confidence: integer("confidence").notNull(),
  trend: text("trend").notNull(),
  insights: text("insights").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userVotes = pgTable("user_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: varchar("proposal_id").references(() => votingProposals.id).notNull(),
  userId: varchar("user_id").notNull().default("user1"), // Simplified for demo
  voteType: text("vote_type").notNull(), // 'yes' or 'no'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  nftTokens: true,
  cw20Tokens: true,
  monthlyIncome: true,
  valuation: true,
});

export const insertVotingProposalSchema = createInsertSchema(votingProposals).omit({
  id: true,
  createdAt: true,
  yesVotes: true,
  noVotes: true,
  totalVotes: true,
});

export const insertValuationReportSchema = createInsertSchema(valuationReports).omit({
  id: true,
  createdAt: true,
});

export const insertUserVoteSchema = createInsertSchema(userVotes).omit({
  id: true,
  createdAt: true,
  userId: true,
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type VotingProposal = typeof votingProposals.$inferSelect;
export type InsertVotingProposal = z.infer<typeof insertVotingProposalSchema>;
export type ValuationReport = typeof valuationReports.$inferSelect;
export type InsertValuationReport = z.infer<typeof insertValuationReportSchema>;
export type UserVote = typeof userVotes.$inferSelect;
export type InsertUserVote = z.infer<typeof insertUserVoteSchema>;
