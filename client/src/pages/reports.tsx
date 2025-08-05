import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Property, ValuationReport } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

export default function Reports() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: reports = [], isLoading } = useQuery<ValuationReport[]>({
    queryKey: ["/api/valuation-reports"],
  });

  const generateReportMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const response = await apiRequest("POST", "/api/valuation-reports", { propertyId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/valuation-reports"] });
      toast({
        title: "Report generated successfully!",
        description: "Your AI valuation report is ready.",
      });
      setSelectedPropertyId("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateReport = () => {
    if (!selectedPropertyId) {
      toast({
        title: "Error",
        description: "Please select a property first.",
        variant: "destructive",
      });
      return;
    }
    generateReportMutation.mutate(selectedPropertyId);
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property?.name || "Unknown Property";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">AI Valuation Reports</h1>
        <p className="text-slate-600">Get AI-powered property valuations and insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Property</label>
              <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a property..." />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleGenerateReport}
              className="w-full bg-primary hover:bg-primary/90"
              disabled={generateReportMutation.isPending}
            >
              {generateReportMutation.isPending ? "Generating..." : "Generate AI Valuation"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Market Trend</span>
              <span className="text-secondary font-semibold flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +5.2%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Avg. ROI</span>
              <span className="text-slate-800 font-semibold">8.4%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Market Cap</span>
              <span className="text-slate-800 font-semibold">$2.4M</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          [...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="bg-slate-50 p-4 rounded-lg">
                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                  <div className="h-20 bg-slate-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">{getPropertyName(report.propertyId)}</h3>
                    <p className="text-slate-600">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge className="bg-secondary/10 text-secondary">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    AI Generated
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Current Valuation</p>
                    <p className="text-2xl font-bold text-slate-800">${report.valuation.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Confidence Score</p>
                    <p className="text-2xl font-bold text-slate-800">{report.confidence}%</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Market Trend</p>
                    <p className={`text-2xl font-bold flex items-center ${parseFloat(report.trend) > 0 ? 'text-secondary' : 'text-red-500'}`}>
                      {parseFloat(report.trend) > 0 ? (
                        <TrendingUp className="h-5 w-5 mr-1" />
                      ) : (
                        <TrendingDown className="h-5 w-5 mr-1" />
                      )}
                      {parseFloat(report.trend) > 0 ? '+' : ''}{report.trend}%
                    </p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-2">AI Insights</h4>
                  <p className="text-slate-600 text-sm">{report.insights}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
