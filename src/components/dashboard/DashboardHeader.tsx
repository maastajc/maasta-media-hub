
interface DashboardHeaderProps {
  error: string | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const DashboardHeader = ({ error, isLoading, onRefresh }: DashboardHeaderProps) => {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold">My Dashboard</h1>
      <p className="text-gray-500 mt-2">Manage your events, auditions, and applications</p>
      
      {error && !isLoading && (
        <div className="mt-4">
          <div className="flex items-center p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
            <div className="h-4 w-4 text-yellow-600 mr-2">⚠</div>
            <div className="text-sm text-yellow-800">
              Some dashboard data may not be up to date.{" "}
              <button 
                onClick={onRefresh}
                className="text-yellow-700 underline hover:text-yellow-900"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
