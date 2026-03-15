import { useUserStore } from "@/lib/stores/useUserStore";

export default function WorkerProfile() {
    const {user} = useUserStore();
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
                  {user?.skills?.map((skill, idx) => (
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
                <span className="text-xs text-gray-600">Daily Rate</span>
                <span className="text-sm font-semibold text-gray-900">
                  ₹{user?.dailyWage}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <span className="text-xs text-gray-600">Jobs Done</span>
                <span className="text-sm font-semibold text-gray-900">
                  {user?.completedJobsCount}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <span className="text-xs text-gray-600">Rating</span>
                <span className="text-sm font-semibold text-yellow-500">
                  {user?.averageRating} ⭐ ({user?.ratingCount})
                </span>
              </div>
            </div>
          </div>
        </>

    );
}