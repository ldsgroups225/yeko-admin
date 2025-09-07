import { getUserId, isAdmin } from "@/services/userService";
import { AssignHeadMaster } from "./AssignHeadMaster";

interface AssignHeadMasterWrapperProps {
  schoolId: string;
  schoolName: string;
}

export async function AssignHeadMasterWrapper({
  schoolId,
  schoolName,
}: AssignHeadMasterWrapperProps) {
  try {
    const userId = await getUserId();
    const hasAdminAccess = await isAdmin(userId);

    if (!hasAdminAccess) {
      return null; // Don't render the component if user is not admin
    }

    return <AssignHeadMaster schoolId={schoolId} schoolName={schoolName} />;
  } catch {
    return null; // Don't render if there's an error
  }
}
