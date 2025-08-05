import { type Property, type InsertProperty, type VotingProposal, type InsertVotingProposal, type ValuationReport, type InsertValuationReport, type UserVote, type InsertUserVote } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Properties
  getProperties(): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  
  // Voting Proposals
  getVotingProposals(): Promise<VotingProposal[]>;
  getVotingProposal(id: string): Promise<VotingProposal | undefined>;
  createVotingProposal(proposal: InsertVotingProposal): Promise<VotingProposal>;
  updateVotingProposal(id: string, proposal: Partial<VotingProposal>): Promise<VotingProposal | undefined>;
  
  // Valuation Reports
  getValuationReports(): Promise<ValuationReport[]>;
  getValuationReportsByProperty(propertyId: string): Promise<ValuationReport[]>;
  createValuationReport(report: InsertValuationReport): Promise<ValuationReport>;
  
  // User Votes
  getUserVote(proposalId: string, userId: string): Promise<UserVote | undefined>;
  createUserVote(vote: InsertUserVote): Promise<UserVote>;
}

export class MemStorage implements IStorage {
  private properties: Map<string, Property>;
  private votingProposals: Map<string, VotingProposal>;
  private valuationReports: Map<string, ValuationReport>;
  private userVotes: Map<string, UserVote>;

  constructor() {
    this.properties = new Map();
    this.votingProposals = new Map();
    this.valuationReports = new Map();
    this.userVotes = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample properties
    const property1: Property = {
      id: "1",
      name: "Sunset Villa",
      description: "Luxury beachfront villa with stunning ocean views",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      nftTokens: 100,
      cw20Tokens: 10000,
      monthlyIncome: 2500,
      valuation: 850000,
      createdAt: new Date(),
    };

    const property2: Property = {
      id: "2",
      name: "Urban Loft",
      description: "Modern loft in downtown financial district",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      nftTokens: 50,
      cw20Tokens: 5000,
      monthlyIncome: 1750,
      valuation: 425000,
      createdAt: new Date(),
    };

    this.properties.set("1", property1);
    this.properties.set("2", property2);

    // Sample voting proposals
    const proposal1: VotingProposal = {
      id: "1",
      title: "Renovate Sunset Villa Kitchen",
      description: "Proposal to upgrade kitchen appliances and countertops",
      propertyId: "1",
      yesVotes: 42,
      noVotes: 8,
      totalVotes: 50,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    };

    const proposal2: VotingProposal = {
      id: "2",
      title: "Install Solar Panels on Urban Loft",
      description: "Reduce energy costs and increase property value",
      propertyId: "2",
      yesVotes: 28,
      noVotes: 15,
      totalVotes: 43,
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    };

    const proposal3: VotingProposal = {
      id: "3",
      title: "Property Manager Change",
      description: "Switch to a new property management company",
      propertyId: "1",
      yesVotes: 18,
      noVotes: 32,
      totalVotes: 50,
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    };

    this.votingProposals.set("1", proposal1);
    this.votingProposals.set("2", proposal2);
    this.votingProposals.set("3", proposal3);
  }

  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = randomUUID();
    const property: Property = {
      ...insertProperty,
      id,
      nftTokens: Math.floor(Math.random() * 50) + 25,
      cw20Tokens: Math.floor(Math.random() * 5000) + 2500,
      monthlyIncome: Math.floor(Math.random() * 2000) + 1000,
      valuation: Math.floor(Math.random() * 500000) + 300000,
      createdAt: new Date(),
    };
    this.properties.set(id, property);
    return property;
  }

  async getVotingProposals(): Promise<VotingProposal[]> {
    return Array.from(this.votingProposals.values());
  }

  async getVotingProposal(id: string): Promise<VotingProposal | undefined> {
    return this.votingProposals.get(id);
  }

  async createVotingProposal(insertProposal: InsertVotingProposal): Promise<VotingProposal> {
    const id = randomUUID();
    const proposal: VotingProposal = {
      ...insertProposal,
      id,
      yesVotes: 0,
      noVotes: 0,
      totalVotes: 0,
      createdAt: new Date(),
    };
    this.votingProposals.set(id, proposal);
    return proposal;
  }

  async updateVotingProposal(id: string, updates: Partial<VotingProposal>): Promise<VotingProposal | undefined> {
    const proposal = this.votingProposals.get(id);
    if (!proposal) return undefined;
    
    const updatedProposal = { ...proposal, ...updates };
    this.votingProposals.set(id, updatedProposal);
    return updatedProposal;
  }

  async getValuationReports(): Promise<ValuationReport[]> {
    return Array.from(this.valuationReports.values());
  }

  async getValuationReportsByProperty(propertyId: string): Promise<ValuationReport[]> {
    return Array.from(this.valuationReports.values()).filter(report => report.propertyId === propertyId);
  }

  async createValuationReport(insertReport: InsertValuationReport): Promise<ValuationReport> {
    const id = randomUUID();
    const report: ValuationReport = {
      ...insertReport,
      id,
      createdAt: new Date(),
    };
    this.valuationReports.set(id, report);
    return report;
  }

  async getUserVote(proposalId: string, userId: string): Promise<UserVote | undefined> {
    return Array.from(this.userVotes.values()).find(
      vote => vote.proposalId === proposalId && vote.userId === userId
    );
  }

  async createUserVote(insertVote: InsertUserVote): Promise<UserVote> {
    const id = randomUUID();
    const vote: UserVote = {
      ...insertVote,
      id,
      userId: "user1", // Simplified for demo
      createdAt: new Date(),
    };
    this.userVotes.set(id, vote);
    return vote;
  }
}

export const storage = new MemStorage();
