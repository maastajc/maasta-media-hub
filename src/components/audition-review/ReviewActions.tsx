
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, RotateCcw } from "lucide-react";
import { AuditionApplication } from "@/services/auditionApplicationService";

interface ReviewActionsProps {
  application: AuditionApplication;
  isUpdating: boolean;
  onStatusUpdate: (status: string) => void;
}

export const ReviewActions = ({ application, isUpdating, onStatusUpdate }: ReviewActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {application.status === 'pending' ? (
          <>
            <Button
              onClick={() => onStatusUpdate('shortlisted')}
              disabled={isUpdating}
              className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Check size={16} />
              Shortlist Applicant
            </Button>
            
            <Button
              onClick={() => onStatusUpdate('rejected')}
              disabled={isUpdating}
              variant="destructive"
              className="w-full flex items-center gap-2"
            >
              <X size={16} />
              Reject Application
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                Currently marked as: <span className="font-semibold capitalize">{application.status}</span>
              </p>
            </div>
            
            <Button
              onClick={() => onStatusUpdate('pending')}
              disabled={isUpdating}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset to Pending
            </Button>
            
            {application.status === 'rejected' && (
              <Button
                onClick={() => onStatusUpdate('shortlisted')}
                disabled={isUpdating}
                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Check size={16} />
                Change to Shortlisted
              </Button>
            )}
            
            {application.status === 'shortlisted' && (
              <Button
                onClick={() => onStatusUpdate('rejected')}
                disabled={isUpdating}
                variant="destructive"
                className="w-full flex items-center gap-2"
              >
                <X size={16} />
                Change to Rejected
              </Button>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 text-center mt-4">
          Use keyboard shortcuts: ← Previous | → Next
        </div>
      </CardContent>
    </Card>
  );
};
