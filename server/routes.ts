import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertValuationReportSchema, insertUserVoteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Properties routes
  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const validatedData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(validatedData);
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid property data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  // Voting proposals routes
  app.get("/api/voting-proposals", async (req, res) => {
    try {
      const proposals = await storage.getVotingProposals();
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch voting proposals" });
    }
  });

  app.post("/api/voting-proposals/:id/vote", async (req, res) => {
    try {
      const { voteType } = req.body;
      const proposalId = req.params.id;
      const userId = "user1"; // Simplified for demo

      // Check if user already voted
      const existingVote = await storage.getUserVote(proposalId, userId);
      if (existingVote) {
        return res.status(400).json({ message: "User has already voted on this proposal" });
      }

      // Get proposal
      const proposal = await storage.getVotingProposal(proposalId);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      // Create vote
      const voteData = insertUserVoteSchema.parse({ proposalId, voteType });
      await storage.createUserVote(voteData);

      // Update proposal vote counts
      const updates = {
        totalVotes: proposal.totalVotes + 1,
        yesVotes: voteType === "yes" ? proposal.yesVotes + 1 : proposal.yesVotes,
        noVotes: voteType === "no" ? proposal.noVotes + 1 : proposal.noVotes,
      };

      const updatedProposal = await storage.updateVotingProposal(proposalId, updates);
      res.json(updatedProposal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vote data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to cast vote" });
    }
  });

  // Check if user has voted
  app.get("/api/voting-proposals/:id/user-vote", async (req, res) => {
    try {
      const proposalId = req.params.id;
      const userId = "user1"; // Simplified for demo
      
      const vote = await storage.getUserVote(proposalId, userId);
      res.json({ hasVoted: !!vote, vote });
    } catch (error) {
      res.status(500).json({ message: "Failed to check user vote" });
    }
  });

  // Valuation reports routes
  app.get("/api/valuation-reports", async (req, res) => {
    try {
      const reports = await storage.getValuationReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch valuation reports" });
    }
  });

  app.post("/api/valuation-reports", async (req, res) => {
    try {
      const { propertyId } = req.body;
      
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      // Generate AI valuation data
      const reportData = {
        propertyId,
        valuation: property.valuation + Math.floor(Math.random() * 100000) - 50000,
        confidence: Math.floor(Math.random() * 20) + 80,
        trend: ((Math.random() * 10 - 5).toFixed(1)),
        insights: "Based on recent market analysis, this property shows strong potential for appreciation. Location factors and recent comparable sales support the current valuation range.",
      };

      const validatedData = insertValuationReportSchema.parse(reportData);
      const report = await storage.createValuationReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid report data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to generate valuation report" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const properties = await storage.getProperties();
      const proposals = await storage.getVotingProposals();
      
      const stats = {
        totalProperties: properties.length,
        totalTokens: properties.reduce((sum, p) => sum + p.cw20Tokens, 0),
        monthlyIncome: properties.reduce((sum, p) => sum + p.monthlyIncome, 0),
        activeVotes: proposals.length,
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
