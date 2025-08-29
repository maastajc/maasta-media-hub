
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  buttonText?: string;
  buttonAction?: () => void;
  buttonClassName?: string;
  icon?: React.ComponentType<any>;
}

export const EmptyState = ({ 
  title, 
  description, 
  buttonText, 
  buttonAction, 
  buttonClassName,
  icon: Icon
}: EmptyStateProps) => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        {Icon && <Icon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && <p className="text-muted-foreground mb-4">{description}</p>}
        {buttonText && buttonAction && (
          <Button 
            onClick={buttonAction}
            className={buttonClassName}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
