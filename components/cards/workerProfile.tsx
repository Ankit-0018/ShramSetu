import { useUserStore } from "@/lib/stores/useUserStore";

export default function WorkerProfile() {
    const {user} = useUserStore();
    const workerProfile = user?.workerProfile;
    return (
        <>
         {/* Profile Summary Card */}
          <div className="bg-white rounded-2xl p-4 border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Your Profile
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-muted-foreground">Skills</span>
                <div className="flex gap-1.5 flex-wrap mt-1.5">
                  {workerProfile?.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium text-foreground bg-secondary rounded-full px-3 py-1"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Minimum Wage</span>
                <span className="text-sm font-semibold text-primary">
                  ₹{workerProfile?.minimumWage ?? "N/A"} / day
                </span>
              </div>
              {/* TODO: jobs-completed count and rating aren't exposed by the
                  backend yet, so those stats are hidden rather than faked. */}
            </div>
          </div>
        </>

    );
}