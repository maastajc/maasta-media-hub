
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; 

const AuditionCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-32 w-full" />
      <div className="p-5">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex justify-between mt-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </Card>
  );
};

export default AuditionCardSkeleton;
