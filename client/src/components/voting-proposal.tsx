import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VotingProposal } from "@shared/schema";
import { UserVoteStatus } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface VotingProposalProps {
  proposal: VotingProposal;
}

export function VotingProposalCard({ proposal }: VotingProposalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userVoteStatus } = useQuery<UserVoteStatus>({
    queryKey: ["/api/voting-proposals", proposal.id, "user-vote"],
  });

  const voteMutation = useMutation({
    mutationFn: async (voteType: "yes" | "no") => {
      const response = await apiRequest("POST", `/api/voting-proposals/${proposal.id}/vote`, {
        voteType,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/voting-proposals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/voting-proposals", proposal.id, "user-vote"] });
      toast({
        title: "Vote cast successfully!",
        description: "Your vote has been recorded.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to cast vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const yesPercentage = proposal.totalVotes > 0 ? (proposal.yesVotes / proposal.totalVotes * 100).toFixed(1) : "0";
  const noPercentage = proposal.totalVotes > 0 ? (proposal.noVotes / proposal.totalVotes * 100).toFixed(1) : "0";
  const daysLeft = Math.ceil((new Date(proposal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">{proposal.title}</h3>
            <p className="text-slate-600 mb-3">{proposal.description}</p>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              {daysLeft} days left
            </Badge>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Voting Progress</span>
            <span className="text-sm text-slate-600">{proposal.totalVotes} votes</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-secondary rounded-sm"></div>
                <span className="text-sm text-slate-600">Yes ({proposal.yesVotes})</span>
              </div>
              <span className="text-sm font-medium text-slate-800">{yesPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-secondary h-2 rounded-full" 
                style={{ width: `${yesPercentage}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-400 rounded-sm"></div>
                <span className="text-sm text-slate-600">No ({proposal.noVotes})</span>
              </div>
              <span className="text-sm font-medium text-slate-800">{noPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-red-400 h-2 rounded-full" 
                style={{ width: `${noPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {!userVoteStatus?.hasVoted ? (
          <div className="flex space-x-4">
            <Button
              onClick={() => voteMutation.mutate("yes")}
              className="flex-1 bg-secondary hover:bg-secondary/90"
              disabled={voteMutation.isPending}
            >
              Vote Yes
            </Button>
            <Button
              onClick={() => voteMutation.mutate("no")}
              variant="destructive"
              className="flex-1"
              disabled={voteMutation.isPending}
            >
              Vote No
            </Button>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
            <span className="text-slate-600">You have already voted on this proposal</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
