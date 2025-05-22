
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// Mock data for recent auditions
const recentAuditions = [
  {
    id: 1,
    title: "Lead Actress for Feature Film",
    company: "Stellar Productions",
    location: "Mumbai",
    deadline: "2025-06-15",
    requirements: "Female, 25-35 years, Hindi & English speaking",
    tags: ["Acting", "Film", "Lead Role"],
    urgent: true,
  },
  {
    id: 2,
    title: "Music Composer for Web Series",
    company: "Digital Dreams",
    location: "Remote",
    deadline: "2025-06-10",
    requirements: "3+ years experience, portfolio required",
    tags: ["Music", "Composition", "Web Series"],
    urgent: false,
  },
  {
    id: 3,
    title: "Dancers for Music Video",
    company: "Rhythm Productions",
    location: "Delhi",
    deadline: "2025-06-20",
    requirements: "Proficient in contemporary and hip-hop styles",
    tags: ["Dance", "Music Video", "Contemporary"],
    urgent: true,
  },
];

const RecentAuditions = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Recent Audition Calls</h2>
          <Link to="/auditions">
            <Button variant="ghost" className="text-maasta-purple hover:text-maasta-purple/90 hover:bg-maasta-purple/10">
              View all auditions
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentAuditions.map((audition) => {
            // Calculate days remaining until deadline
            const today = new Date();
            const deadline = new Date(audition.deadline);
            const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card key={audition.id} className="card-hover">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{audition.title}</h3>
                    {audition.urgent && (
                      <Badge className="bg-red-500">Urgent</Badge>
                    )}
                  </div>
                  <p className="text-maasta-purple font-medium text-sm mt-1">{audition.company}</p>
                  
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {audition.location}
                  </div>
                  
                  <div className="mt-2 text-sm">
                    <p className="font-medium">Requirements:</p>
                    <p className="text-gray-600">{audition.requirements}</p>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap">
                    {audition.tags.map((tag, idx) => (
                      <span key={idx} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">Deadline:</span> 
                      <span className={`ml-1 ${daysRemaining <= 5 ? "text-red-500" : "text-gray-600"}`}>
                        {daysRemaining} days left
                      </span>
                    </div>
                    <Link to={`/auditions/${audition.id}`}>
                      <Button size="sm" className="bg-maasta-purple hover:bg-maasta-purple/90">
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecentAuditions;
