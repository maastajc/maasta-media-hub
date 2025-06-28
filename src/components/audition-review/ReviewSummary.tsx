
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ReviewSummaryProps {
  total: number;
  shortlisted: number;
  rejected: number;
  pending: number;
}

export const ReviewSummary = ({ total, shortlisted, rejected, pending }: ReviewSummaryProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-sm text-gray-500">Total Applicants</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{shortlisted}</div>
            <div className="text-sm text-gray-500">Shortlisted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{rejected}</div>
            <div className="text-sm text-gray-500">Rejected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{pending}</div>
            <div className="text-sm text-gray-500">Pending Review</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
