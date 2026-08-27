import { useUserStore } from "@/lib/stores/useUserStore";

export default function WorkerProfile() {
    const {user} = useUserStore();
    const workerProfile = user?.workerProfile;
    return (
        <>
         {/* Profile Summary Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Your Profile
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Skill</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {workerProfile?.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-sm font-semibold text-gray-900"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <span className="text-xs text-gray-600">Minimum Wage</span>
                <span className="text-sm font-semibold text-gray-900">
                  ₹{workerProfile?.minimumWage ?? "N/A"}
                </span>
              </div>
              {/* TODO: jobs-completed count and rating aren't exposed by the
                  backend yet, so those stats are hidden rather than faked. */}
            </div>
          </div>
        </>

    );
}