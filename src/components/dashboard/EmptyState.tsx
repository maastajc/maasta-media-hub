
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface EmptyStateProps {
  title: string;
  buttonText: string;
  buttonAction: () => void;
  buttonClassName?: string;
}

export const EmptyState = ({ title, buttonText, buttonAction, buttonClassName }: EmptyStateProps) => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <p className="text-gray-500 mb-4">{title}</p>
        <Button 
          onClick={buttonAction}
          className={buttonClassName}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};
