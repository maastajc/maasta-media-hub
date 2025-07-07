
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Globe, 
  Wrench, 
  User,
  Calendar,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { Artist } from "@/types/artist";

interface ProfileAboutProps {
  artist: Artist;
}

const ProfileAbout = ({ artist }: ProfileAboutProps) => {
  const skills = artist.special_skills || [];
  const languages = artist.language_skills || [];
  const tools = artist.tools_software || [];

  const personalInfo = [
    { icon: Mail, label: "Email", value: artist.email },
    { icon: Phone, label: "Phone", value: artist.phone_number },
    { icon: Calendar, label: "Date of Birth", value: artist.date_of_birth },
    { icon: User, label: "Gender", value: artist.gender },
    { icon: MapPin, label: "Location", value: [artist.city, artist.state, artist.country].filter(Boolean).join(', ') }
  ].filter(item => item.value);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* About Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Headline */}
          {artist.headline && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <User className="mr-3 text-maasta-purple" size={24} />
                  Headline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg font-medium">{artist.headline}</p>
              </CardContent>
            </Card>
          )}

          {/* About */}
          {artist.about && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <User className="mr-3 text-maasta-purple" size={24} />
                  About {artist.full_name?.split(' ')[0]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">{artist.about}</p>
              </CardContent>
            </Card>
          )}

          {/* Fallback to bio if about is not available */}
          {!artist.about && artist.bio && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <User className="mr-3 text-maasta-purple" size={24} />
                  About {artist.full_name?.split(' ')[0]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">{artist.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Skills & Expertise */}
          {(skills.length > 0 || languages.length > 0 || tools.length > 0) && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Brain className="mr-3 text-green-600" size={24} />
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Special Skills */}
                {skills.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-maasta-purple rounded-full mr-2"></div>
                      Special Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge 
                          key={skill.id} 
                          variant="outline" 
                          className="px-3 py-1 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                        >
                          {skill.skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {languages.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-maasta-orange rounded-full mr-2"></div>
                      Languages
                    </h4>
                    <div className="space-y-2">
                      {languages.map((lang) => (
                        <div key={lang.id} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                          <span className="font-medium">{lang.language}</span>
                          <Badge className="capitalize text-xs bg-orange-100 text-orange-700">
                            {lang.proficiency}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tools & Software */}
                {tools.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                      Tools & Software
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tools.map((tool) => (
                        <Badge 
                          key={tool.id} 
                          variant="outline"
                          className="px-3 py-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        >
                          {tool.tool_name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Personal Information Sidebar */}
        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {personalInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{info.label}</p>
                      <p className="text-gray-900">{info.value}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Membership & Associations */}
          {artist.association_membership && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Professional Memberships</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                  {artist.association_membership}
                </Badge>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileAbout;
