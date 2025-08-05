export interface DashboardStats {
  totalProperties: number;
  totalTokens: number;
  monthlyIncome: number;
  activeVotes: number;
}

export interface UserVoteStatus {
  hasVoted: boolean;
  vote?: {
    voteType: string;
  };
}
