import { getApplicationsForJob } from "@/lib/queries/applications";
import { getJobById } from "@/lib/queries/jobs";
import ApplicationsClient from "./ApplicationsClient";
;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;
  const [job, applications] = await Promise.all([
    getJobById(id),
    getApplicationsForJob(id),
  ]);

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Job not found</p>
      </div>
    );
  }

  return <ApplicationsClient job={job} applications={applications} />;
}
