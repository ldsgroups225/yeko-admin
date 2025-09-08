"use client";

import { useEffect } from "react";
import type { StructuredData } from "@/lib/structured-data";
import {
  generateStructuredDataScript,
  validateStructuredData,
} from "@/lib/structured-data";

interface StructuredDataProps {
  data: StructuredData | StructuredData[];
  id?: string;
}

/**
 * Component for adding JSON-LD structured data to pages
 *
 * @example
 * ```tsx
 * import { StructuredData } from '@/components/StructuredData';
 * import { generateOrganizationSchema } from '@/lib/structured-data';
 *
 * export default function HomePage() {
 *   return (
 *     <>
 *       <StructuredData data={generateOrganizationSchema()} />
 *       <main>Page content</main>
 *     </>
 *   );
 * }
 * ```
 */
export function StructuredDataComponent({
  data,
  id = "structured-data",
}: StructuredDataProps) {
  useEffect(() => {
    // Validate structured data in development
    if (process.env.NODE_ENV === "development") {
      const schemas = Array.isArray(data) ? data : [data];
      schemas.forEach((schema, index) => {
        if (!validateStructuredData(schema)) {
          console.warn(`Invalid structured data at index ${index}:`, schema);
        }
      });
    }

    // Create script element
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.textContent = generateStructuredDataScript(data);

    // Remove existing script with same ID
    const existing = document.getElementById(id);
    if (existing) {
      existing.remove();
    }

    // Add new script to head
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById(id);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data, id]);

  // This component doesn't render anything visible
  return null;
}

/**
 * Server-side structured data component for static generation
 * Use this in server components or when you need the structured data
 * to be present during SSR
 */
export function StaticStructuredData({
  data,
  id = "structured-data",
}: StructuredDataProps) {
  // Validate in development
  if (process.env.NODE_ENV === "development") {
    const schemas = Array.isArray(data) ? data : [data];
    schemas.forEach((schema, index) => {
      if (!validateStructuredData(schema)) {
        console.warn(`Invalid structured data at index ${index}:`, schema);
      }
    });
  }

  return (
    <script
      id={id}
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data injection
      dangerouslySetInnerHTML={{
        __html: generateStructuredDataScript(data),
      }}
    />
  );
}

/**
 * Hook for managing structured data in React components
 *
 * @example
 * ```tsx
 * import { useStructuredData } from '@/components/StructuredData';
 * import { generatePersonSchema } from '@/lib/structured-data';
 *
 * export function ProfilePage({ user }) {
 *   useStructuredData(generatePersonSchema({
 *     name: user.name,
 *     jobTitle: user.jobTitle,
 *     url: `/profile/${user.username}`,
 *   }));
 *
 *   return <div>Profile content</div>;
 * }
 * ```
 */
export function useStructuredData(
  data: StructuredData | StructuredData[],
  id?: string,
) {
  useEffect(() => {
    const _component = { data, id };

    // Validate structured data in development
    if (process.env.NODE_ENV === "development") {
      const schemas = Array.isArray(data) ? data : [data];
      schemas.forEach((schema, index) => {
        if (!validateStructuredData(schema)) {
          console.warn(`Invalid structured data at index ${index}:`, schema);
        }
      });
    }

    // Create script element
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id || "structured-data";
    script.textContent = generateStructuredDataScript(data);

    // Remove existing script with same ID
    const existing = document.getElementById(id || "structured-data");
    if (existing) {
      existing.remove();
    }

    // Add new script to head
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById(id || "structured-data");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data, id]);
}

/**
 * Multiple structured data component for pages with multiple schemas
 */
export function MultipleStructuredData({
  schemas,
  baseId = "structured-data",
}: {
  schemas: StructuredData[];
  baseId?: string;
}) {
  return (
    <>
      {schemas.map((schema, index) => (
        <StructuredDataComponent
          key={`${baseId}-${schema["@type"] || index}`}
          data={schema}
          id={`${baseId}-${index}`}
        />
      ))}
    </>
  );
}

/**
 * Conditional structured data component
 * Only renders structured data if condition is met
 */
export function ConditionalStructuredData({
  condition,
  data,
  id,
}: {
  condition: boolean;
  data: StructuredData | StructuredData[];
  id?: string;
}) {
  if (!condition) {
    return null;
  }

  return <StructuredDataComponent data={data} id={id} />;
}
