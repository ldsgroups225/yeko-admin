# Structured Data Integration Guide

This guide shows how to integrate JSON-LD structured data into your Yeko Admin application routes.

## Overview

The structured data system has been integrated into the existing authentication and dashboard routes:

- **Authentication pages**: Minimal structured data for functional pages
- **Dashboard pages**: Rich structured data for educational content management
- **Dynamic sections**: Flexible structured data for custom dashboard sections

## Integrated Routes

### Authentication Routes (`/src/app/(auth)/`)

#### 1. Sign In Page (`/sign-in`)
```typescript
// src/app/(auth)/sign-in/page.tsx
import { SignInStructuredData } from "../structured-data";

export default function SignInPage() {
  return (
    <>
      <SignInStructuredData />
      {/* Page content */}
    </>
  );
}
```

**Included Schemas:**
- Breadcrumb navigation
- WebPage schema with LoginAction
- Minimal SEO data (noindex for privacy)

#### 2. Forgot Password Page (`/forgot-password`)
```typescript
// src/app/(auth)/forgot-password/page.tsx
import { ForgotPasswordStructuredData } from "../structured-data";

export default function ForgotPasswordPage() {
  return (
    <>
      <ForgotPasswordStructuredData />
      {/* Page content */}
    </>
  );
}
```

**Included Schemas:**
- Breadcrumb navigation
- WebPage schema for password reset
- User-friendly error handling

#### 3. Auth Error Page (`/auth-code-error`)
```typescript
// src/app/(auth)/auth-code-error/page.tsx
import { AuthErrorStructuredData } from "../structured-data";

export default function AuthCodeErrorPage() {
  return (
    <>
      <AuthErrorStructuredData />
      {/* Page content */}
    </>
  );
}
```

**Included Schemas:**
- Error page breadcrumbs
- WebPage schema for error handling
- Support contact information

### Dashboard Routes (`/src/app/(protected)/dashboard/`)

#### 1. Main Dashboard (`/dashboard`)
```typescript
// src/app/(protected)/dashboard/page.tsx
import { DashboardStructuredData } from "./structured-data";

export default function DashboardPage() {
  return (
    <>
      <DashboardStructuredData />
      {/* Dashboard content */}
    </>
  );
}
```

**Included Schemas:**
- Dashboard breadcrumb navigation
- WebPage schema for dashboard overview
- Dataset schema for statistics
- Educational audience targeting

#### 2. Dashboard Sections

Each dashboard section has its own structured data component:

```typescript
// Schools management
<SchoolsDashboardStructuredData />

// Students management  
<StudentsDashboardStructuredData />

// Teachers management
<TeachersDashboardStructuredData />

// Classes management
<ClassesDashboardStructuredData />

// Settings
<SettingsDashboardStructuredData />
```

#### 3. Custom Sections

Use the generic generator for custom dashboard sections:

```typescript
<DashboardSectionStructuredData
  sectionName="Rapports"
  sectionPath="/dashboard/reports"
  description="Génération et consultation des rapports scolaires"
  itemType="Report"
/>
```

## Implementation Examples

### Adding Structured Data to New Pages

#### Step 1: Create the Page Component
```typescript
// src/app/(protected)/dashboard/my-section/page.tsx
import { DashboardSectionStructuredData } from "../structured-data";

export default function MySectionPage() {
  return (
    <>
      <DashboardSectionStructuredData
        sectionName="Ma Section"
        sectionPath="/dashboard/my-section"
        description="Description de ma section personnalisée"
        itemType="Thing"
      />
      <div>
        <h1>Ma Section</h1>
        {/* Your content here */}
      </div>
    </>
  );
}
```

#### Step 2: Add Metadata (Optional)
```typescript
// src/app/(protected)/dashboard/my-section/page.tsx
import type { Metadata } from "next";
import { generateDashboardMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = generateDashboardMetadata(
  "Ma Section",
  "Description de ma section personnalisée"
);
```

### Educational Content Pages

For educational content like courses, events, or profiles:

```typescript
// src/app/courses/[slug]/page.tsx
import { StaticStructuredData } from "@/components/StructuredData";
import { generateCourseSchema } from "@/lib/structured-data";

export default function CoursePage({ params }: { params: { slug: string } }) {
  const course = getCourseData(params.slug);
  
  const courseSchema = generateCourseSchema({
    name: course.title,
    description: course.description,
    provider: course.school,
    instructor: course.teacher,
    educationalLevel: course.level,
    subject: course.subject,
    url: `/courses/${params.slug}`
  });

  return (
    <>
      <StaticStructuredData data={courseSchema} />
      <div>
        {/* Course content */}
      </div>
    </>
  );
}
```

### Profile Pages

For teacher or student profiles:

```typescript
// src/app/profile/[username]/page.tsx
import { StaticStructuredData } from "@/components/StructuredData";
import { generateEducationalPersonSchema } from "@/lib/structured-data-utils";

export default function ProfilePage({ params }: { params: { username: string } }) {
  const user = getUserData(params.username);
  
  const personSchema = generateEducationalPersonSchema({
    name: user.name,
    role: user.role, // "enseignant" | "élève" | "administrateur" | "parent"
    url: `/profile/${params.username}`,
    institution: user.school,
    subjects: user.subjects
  });

  return (
    <>
      <StaticStructuredData data={personSchema} />
      <div>
        {/* Profile content */}
      </div>
    </>
  );
}
```

### Event Pages

For school events:

```typescript
// src/app/events/[id]/page.tsx
import { StaticStructuredData } from "@/components/StructuredData";
import { generateSchoolEventSchema } from "@/lib/structured-data-utils";

export default function EventPage({ params }: { params: { id: string } }) {
  const event = getEventData(params.id);
  
  const eventSchema = generateSchoolEventSchema({
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: event.location,
    organizer: event.organizer,
    url: `/events/${params.id}`
  });

  return (
    <>
      <StaticStructuredData data={eventSchema} />
      <div>
        {/* Event content */}
      </div>
    </>
  );
}
```

## Root Layout Integration

Add the main structured data to your root layout:

```typescript
// src/app/layout.tsx
import { StructuredDataLayout } from "@/components/layout/StructuredDataLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <StructuredDataLayout>
          {children}
        </StructuredDataLayout>
      </body>
    </html>
  );
}
```

## Dynamic Structured Data

For client-side updates:

```typescript
// components/DynamicContent.tsx
import { useStructuredData } from "@/components/StructuredData";
import { generatePersonSchema } from "@/lib/structured-data";

export function DynamicProfile({ user }: { user: User }) {
  // Update structured data when user changes
  useStructuredData(
    generatePersonSchema({
      name: user.name,
      jobTitle: user.role,
      url: `/profile/${user.username}`,
      description: user.bio
    }),
    'dynamic-profile'
  );

  return <div>{/* Profile UI */}</div>;
}
```

## Best Practices

### 1. Page-Specific Schemas
- Use appropriate schema types for each page
- Include relevant educational context
- Add breadcrumb navigation for all pages

### 2. Private vs Public Pages
- **Public pages**: Full structured data with SEO optimization
- **Private pages** (dashboard): Minimal structured data, noindex
- **Auth pages**: Basic structured data for functionality

### 3. Educational Context
- Always use French language (`inLanguage: "fr-FR"`)
- Include educational audience targeting
- Specify educational levels and subjects when relevant

### 4. Performance
- Use `StaticStructuredData` for SSR pages
- Use `StructuredData` for client-side updates
- Avoid duplicate schemas on the same page

### 5. Validation
- Test schemas with Google's Rich Results Test
- Validate JSON-LD syntax
- Check for required properties

## Testing Your Implementation

### 1. Development Validation
The system automatically validates structured data in development mode and logs warnings for invalid schemas.

### 2. Google Rich Results Test
Test your pages at: https://search.google.com/test/rich-results

### 3. Schema.org Validator
Validate at: https://validator.schema.org/

### 4. JSON-LD Playground
Test and debug at: https://json-ld.org/playground/

## Troubleshooting

### Common Issues

1. **Missing Required Fields**
   ```typescript
   // ❌ Missing required fields
   const schema = generatePersonSchema({
     name: user.name
     // Missing url
   });
   
   // ✅ Include all required fields
   const schema = generatePersonSchema({
     name: user.name,
     url: `/profile/${user.username}`
   });
   ```

2. **Duplicate Schemas**
   ```typescript
   // ❌ Duplicate IDs
   <StaticStructuredData data={schema1} id="schema" />
   <StaticStructuredData data={schema2} id="schema" />
   
   // ✅ Unique IDs
   <StaticStructuredData data={schema1} id="person-schema" />
   <StaticStructuredData data={schema2} id="breadcrumb-schema" />
   ```

3. **Invalid Dates**
   ```typescript
   // ❌ Invalid date format
   publishedTime: "2024-01-01"
   
   // ✅ ISO 8601 format
   publishedTime: "2024-01-01T00:00:00Z"
   ```

### Debug Mode

Enable debug logging:
```bash
NEXT_PUBLIC_DEBUG_STRUCTURED_DATA=true
```

## Migration Checklist

- [ ] Add structured data to all authentication pages
- [ ] Add structured data to all dashboard sections
- [ ] Include breadcrumb navigation
- [ ] Test with validation tools
- [ ] Verify French language settings
- [ ] Check educational context
- [ ] Validate required fields
- [ ] Test in development mode
- [ ] Monitor for console warnings

## Next Steps

1. **Extend to More Pages**: Add structured data to additional routes
2. **Dynamic Content**: Implement client-side updates for dynamic content
3. **Analytics**: Monitor structured data performance in search results
4. **Internationalization**: Add support for multiple languages if needed