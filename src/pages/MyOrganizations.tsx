
import { ProfileLayout } from "@/components/layout/ProfileLayout";
import { OrganizationsTab } from "@/components/organizations/OrganizationsTab";

const MyOrganizations = () => {
  return (
    <ProfileLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Organizations</h1>
          <p className="text-gray-600">Manage your organizations and post as a company</p>
        </div>
        
        <OrganizationsTab />
      </div>
    </ProfileLayout>
  );
};

export default MyOrganizations;
