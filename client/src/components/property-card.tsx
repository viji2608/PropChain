import { Property } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  property: Property;
  showManageButton?: boolean;
}

export function PropertyCard({ property, showManageButton = false }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden card-hover">
      <img 
        src={property.image} 
        alt={property.name} 
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">{property.name}</h3>
        <p className="text-slate-600 mb-4">{property.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-sm text-slate-600">NFT Tokens</p>
            <p className="text-lg font-semibold text-slate-800">{property.nftTokens}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-sm text-slate-600">CW20 Tokens</p>
            <p className="text-lg font-semibold text-slate-800">{property.cw20Tokens.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">Monthly Income</p>
            <p className="text-lg font-semibold text-secondary">${property.monthlyIncome.toLocaleString()}</p>
          </div>
          {showManageButton && (
            <Button className="bg-primary hover:bg-primary/90">
              Manage
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
