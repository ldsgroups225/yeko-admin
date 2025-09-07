import { redirect } from "next/navigation";

export default function SchoolsAddPage() {
  // Redirect to the existing /schools/new page
  redirect("/schools/new");
}
