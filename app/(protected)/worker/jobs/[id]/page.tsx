import { getJobById } from "@/lib/queries/jobs";
import JobDetailsPage from "./client";
import { getEmployerProfile } from "@/lib/queries/employer";
import { serializeFirestore } from "@/lib/utils/firebase/serializeFirestore";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    return (
      <div>
        <h1>Job not found</h1>
      </div>
    );
  }

  const employer = await getEmployerProfile(job.employerId);

  // Serialize data to remove Firestore Timestamps
  const serializedJob = serializeFirestore(job);
  const serializedEmployer = serializeFirestore(employer);

  return <JobDetailsPage job={serializedJob} employer={serializedEmployer} />;
}
