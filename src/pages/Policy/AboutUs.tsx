import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaLinkedin } from "react-icons/fa";

type TeamMember = {
  name: string;
  role: string;
  avatarUrl: string;
  linkedinUrl: string;
  fallback: string;
};

export default function AboutUs() {
  // Example data for the development team:
  const devTeam: TeamMember[] = [
    {
      name: "Sagnik Majumder",
      role: "Developer",
      avatarUrl: "https://placehold.co/200?text=SM", // Replace with actual LinkedIn photo URL
      linkedinUrl: "https://www.linkedin.com/in/sagnik-majumder-92345524b/", // Replace with actual profile URL
      fallback: "SM",
    },
    {
      name: "Pratik Sarangi",
      role: "Developer",
      avatarUrl: "https://placehold.co/200?text=PS",
      linkedinUrl: "https://www.linkedin.com/in/pratik-sarangi-382535249/",
      fallback: "PS",
    },
    {
      name: "Mayur Shastri",
      role: "Developer",
      avatarUrl: "https://placehold.co/200?text=MS",
      linkedinUrl: "https://www.linkedin.com/in/mayur-shastri-73772925b/",
      fallback: "MS",
    },
    {
      name: "Bhavya Jain",
      role: "Developer",
      avatarUrl: "https://placehold.co/200?text=BJ",
      linkedinUrl: "https://www.linkedin.com/in/bhavya-jain-5ba398273/",
      fallback: "BJ",
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4 flex-grow">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="text-lg text-muted-foreground">
          Bringing electrifying events to Agartala, Tripura! From high-energy DJ
          nights to unforgettable gatherings, Takshak Agt is your ultimate event
          organizer.
        </p>
      </div>

      {/* Our Mission */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            At Takshak Event Management, our mission is to transform every event into an
            extraordinary celebration that resonates with energy, creativity,
            and passion. We are dedicated to crafting experiences that go beyond
            the ordinary by seamlessly blending high-caliber DJ performances,
            immersive stage setups, and vibrant atmospheres. Our commitment lies
            in pushing the boundaries of what’s possible, ensuring that every
            music festival, corporate event, or themed party is a unique
            masterpiece of entertainment and innovation.
          </p>
          <p className="mt-4">
            We believe that every event should not only captivate but also
            inspire and connect people. With a keen eye for detail and a drive
            to exceed expectations, we work tirelessly to create moments that
            are as unforgettable as they are exciting.
          </p>
        </CardContent>
      </Card>

      {/* Leader Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Founder</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Avatar className="w-20 h-20 mb-4">
            <AvatarImage src="" alt="Chirag Saha" />
            <AvatarFallback>CS</AvatarFallback>
          </Avatar>
          <p className="font-semibold text-xl">Chirag Saha</p>
          <p className="text-sm text-muted-foreground">Founder & Leader</p>
        </CardContent>
      </Card>

      {/* Management & Marketing Team */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Management & Marketing Team</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Our management and marketing team details will be updated soon. Stay tuned!
          </p>
        </CardContent>
        {/* <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              name: "Raghu Rajan",
              role: "Social Media Manager",
              initials: "RR",
            },
            {
              name: "Muruli Veera",
              role: "Crowd Manager",
              initials: "MV",
            },
            {
              name: "Shreeram Hari Kumar",
              role: "Refreshment Manager",
              initials: "SH",
            },
          ].map((member, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <Avatar className="w-16 h-16">
                <AvatarImage src="" alt={member.name} />
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </CardContent> */}
      </Card>

      {/* Development Team */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Development Team</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {devTeam.map((member, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              {/* Avatar with LinkedIn image */}
              <Avatar className="w-16 h-16">
                <AvatarImage src={member.avatarUrl} alt={member.name} />
                <AvatarFallback>{member.fallback}</AvatarFallback>
              </Avatar>

              {/* Name & LinkedIn link */}
              <div className="text-center">
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group font-semibold cursor-pointer flex items-center space-x-2"
                >
                  <span>{member.name}</span>
                  <FaLinkedin className="text-blue-600 hidden group-hover:block" />
                </a>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
