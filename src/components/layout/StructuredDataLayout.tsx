import { StaticStructuredData } from "@/components/StructuredData";
import { commonStructuredData } from "@/lib/structured-data";

/**
 * Layout component that includes common structured data for all pages
 * This should be included in the root layout to ensure organization
 * and website schemas are present on every page
 */
export function StructuredDataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const homeStructuredData = commonStructuredData.home();

  return (
    <>
      {/* Organization Schema - appears on all pages */}
      <StaticStructuredData
        data={homeStructuredData[0]}
        id="organization-schema"
      />

      {/* Website Schema - appears on all pages */}
      <StaticStructuredData data={homeStructuredData[1]} id="website-schema" />

      {/* Software Application Schema - appears on all pages */}
      <StaticStructuredData data={homeStructuredData[2]} id="software-schema" />

      {children}
    </>
  );
}

/**
 * Page-specific structured data layout for dashboard pages
 */
export function DashboardStructuredDataLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const dashboardStructuredData = commonStructuredData.dashboard(title);

  return (
    <>
      <StaticStructuredData
        data={dashboardStructuredData[0]}
        id="dashboard-breadcrumb"
      />
      {children}
    </>
  );
}

/**
 * Profile page structured data layout
 */
export function ProfileStructuredDataLayout({
  children,
  person,
}: {
  children: React.ReactNode;
  person: {
    name: string;
    jobTitle?: string;
    description?: string;
    url: string;
    expertise?: string[];
  };
}) {
  const profileStructuredData = commonStructuredData.profile(person);

  return (
    <>
      <StaticStructuredData
        data={profileStructuredData[0]}
        id="person-schema"
      />
      <StaticStructuredData
        data={profileStructuredData[1]}
        id="profile-breadcrumb"
      />
      {children}
    </>
  );
}

/**
 * Documentation page structured data layout
 */
export function DocsStructuredDataLayout({
  children,
  title,
  url,
}: {
  children: React.ReactNode;
  title: string;
  url: string;
}) {
  const docsStructuredData = commonStructuredData.docs(title, url);

  return (
    <>
      <StaticStructuredData data={docsStructuredData[0]} id="docs-breadcrumb" />
      {children}
    </>
  );
}

/**
 * Help/FAQ page structured data layout
 */
export function HelpStructuredDataLayout({
  children,
  faqs,
}: {
  children: React.ReactNode;
  faqs: Array<{ question: string; answer: string }>;
}) {
  const helpStructuredData = commonStructuredData.help(faqs);

  return (
    <>
      <StaticStructuredData data={helpStructuredData[0]} id="faq-schema" />
      <StaticStructuredData data={helpStructuredData[1]} id="help-breadcrumb" />
      {children}
    </>
  );
}
