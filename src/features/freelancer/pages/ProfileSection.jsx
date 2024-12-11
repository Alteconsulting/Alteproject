import { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import EditProfile from "./EditProfile";
import { API } from "../../../config";
// Authsimport useFreelancerAuth from "../auth/useFreelancerAuth";
import axios from "axios";
import useFreelancerAuth from "../auth/useFreelancerAuth";

const ProfileSection = () => {
  const { user } = useFreelancerAuth(); // Get authenticated user
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all profiles
        const profilesResponse = await axios.get(
          `${API}/api/Alte/freelancer/dashboard/all-freelancers`
        );

        const profilesData = profilesResponse.data?.data || profilesResponse.data || [];

        if (profilesData && user && user.id) {
          const userProfile = profilesData.find((profile) =>
            String(profile.userId) === String(user.id) || String(profile.id) === String(user.id)
          );

          if (userProfile) {
            try {
              // Use the correct profile ID for fetching detailed profile
              const profileResponse = await axios.get(
                `${API}/api/Alte/freelancer/dashboard/all-freelancers/${userProfile.id}`
              );

              // Log the full response to understand its structure
              console.log("Full profile response:", profileResponse);

              // More defensive data extraction
              const fetchedProfile =
                profileResponse.data?.data ||
                profileResponse.data ||
                profileResponse;

              console.log("Extracted profile:", fetchedProfile);

              if (fetchedProfile) {
                setProfile(fetchedProfile);
                // Optional: set profile ID if needed
                // setProfileId(userProfile.id);
              } else {
                setError("No profile data found");
              }
            } catch (detailError) {
              console.error("Error fetching profile details:", detailError);
              setError("Failed to fetch profile details");
            }
          } else {
            setProfile(null);
            setError("No matching profile found");
          }
        }
      } catch (err) {
        console.error("Error fetching profiles:", err);
        setError("Failed to fetch profiles");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id]);



  const handleEditClick = () => {
    setIsEditing(true);
  };
  const name = user?.name || "Freelancer";
  const initials = name
    .split(" ")
    .map(word => word[0])
    .join("");

  return (
    <div className="relative rounded-lg bg-[#FBFFFE] p-8 shadow-sm">
      {!isEditing && (
        <div className="absolute right-3 top-4">
          <button
            onClick={handleEditClick}
            className="border-gray-300 flex items-center rounded-md border px-4 py-2 text-sm"
          >
            Edit Profile
            <span className="ml-2">
              <PencilIcon
                className="text-gray-600 mr-2 h-5 w-5"
                aria-hidden="true"
              />
            </span>
          </button>
        </div>
      )}

      {isEditing ? (
        <EditProfile className="w-full" />
      ) : (
        <div className="mt-12 flex flex-col md:flex-row">
          {/* Left Column - Display Picture & Name */}
          <div className="ml-8 flex flex-col items-center md:w-1/3 md:items-start">
            {/* Display Picture */}
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-black text-5xl text-white">
              {initials}
            </div>
            <h2 className="mt-4 text-center text-xl font-semibold md:text-left">
              {user?.name || "Freelancer"}
            </h2>
            {profile?.linkedIn && profile?.portfolio && (
              <div className="mt-4 mb-6">
                <h3 className="font-medium text-grey-100">LINKS</h3>
                <h3 className="flex mtext-grey-500 t-1">
                  <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
                      <path d="M10 14a4 4 0 0 1 0-5.66l2.34-2.34a4 4 0 0 1 5.66 5.66l-1 1" />
                      <path d="M14 10a4 4 0 0 1 0 5.66l-2.34 2.34a4 4 0 0 1-5.66-5.66l1-1" />
                    </svg>

                  </a>
                  <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <svg className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M19.5 0h-15A4.5 4.5 0 0 0 0 4.5v15A4.5 4.5 0 0 0 4.5 24h15a4.5 4.5 0 0 0 4.5-4.5v-15A4.5 4.5 0 0 0 19.5 0zm-11 18h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>


                </h3>
              </div>
            )}
            {profile?.rate && (
              <div className="mt-4 mb-6">
                <h3 className="font-medium text-grey-100">RATE</h3>
                <h3 className="font-semibold mtext-grey-500 t-1">{profile?.rate || '-'}</h3>
              </div>)}
            {profile?.skills && profile.skills.length > 0 && (
              <div className="mt-4 mb-6">
                <h3 className="font-medium text-grey-100">SKILL</h3>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills && profile.skills.length > 0
                    ? profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-success-100 text-normal font-medium px-2.5 py-0.5 rounded"
                      >
                        {skill}
                      </span>
                    ))
                    : '-'
                  }
                </div>
              </div>)}
          </div>

          <div className="flex justify-center">
            <div
              className="border-gray-300 mx-8 hidden border-l md:block"
              style={{ height: "450px" }}
            ></div>
          </div>

          {/* Right Column - Role & About Me */}
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="font-medium text-grey-100">ROLE</h3>
              <h3 className="font-semibold text-lg mtext-grey-500 t-1">{profile?.role || '-'}</h3>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-grey-500">ABOUT ME</h3>
              <p className="text-normal text-justify mt-1">{profile?.about || '-'}</p>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-grey-500">Time Zone</h3>
              <p className="text-normal text-justify mt-1">{profile?.timezone || '-'}</p>
            </div>
            {profile?.language && profile.language.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-grey-500">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {profile?.language && profile.language.length > 0
                    ? profile.language.map((language, index) => (
                      <span
                        key={index}
                        className="text-normal"
                      >
                        {language}
                      </span>
                    ))
                    : '-'
                  }
                </div>
              </div>)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
