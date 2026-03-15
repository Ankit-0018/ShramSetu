import { getCurrentUser } from "@/lib/utils/auth";
import { getEmployerAssignments } from "@/lib/queries/assignments";
import AssignmentsClient from "./AssignmentsClient";
import { redirect } from "next/navigation";

export default async function Page() {

  

  return <AssignmentsClient />;
}
