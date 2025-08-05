import { useQuery } from "@tanstack/react-query";
import { VotingProposalCard } from "@/components/voting-proposal";
import { VotingProposal } from "@shared/schema";

export default function Voting() {
  const { data: proposals = [], isLoading } = useQuery<VotingProposal[]>({
    queryKey: ["/api/voting-proposals"],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-6"></div>
                <div className="space-y-4">
                  <div className="h-2 bg-slate-200 rounded"></div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <div className="h-10 bg-slate-200 rounded flex-1"></div>
                  <div className="h-10 bg-slate-200 rounded flex-1"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">DAO Voting</h1>
        <p className="text-slate-600">Participate in property governance decisions</p>
      </div>

      <div className="space-y-6">
        {proposals.map((proposal) => (
          <VotingProposalCard key={proposal.id} proposal={proposal} />
        ))}
      </div>
    </div>
  );
}
