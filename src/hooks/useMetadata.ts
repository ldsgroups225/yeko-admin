"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/metadata";
import { generateSocialShareUrls } from "@/lib/seo";

// Client-side metadata management hook
export function useMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  noIndex?: boolean;
} = {}) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = `${title} | ${siteConfig.name}`;
    }

    // Update meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", description);
    }

    // Update meta keywords
    if (keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute(
        "content",
        [...siteConfig.keywords, ...keywords].join(", "),
      );
    }

    // Update Open Graph tags
    if (title) {
      updateMetaProperty("og:title", `${title} | ${siteConfig.name}`);
    }
    if (description) {
      updateMetaProperty("og:description", description);
    }
    if (image) {
      updateMetaProperty("og:image", image);
    }
    if (url) {
      updateMetaProperty("og:url", `${siteConfig.url}${url}`);
    }

    // Update Twitter Card tags
    if (title) {
      updateMetaName("twitter:title", `${title} | ${siteConfig.name}`);
    }
    if (description) {
      updateMetaName("twitter:description", description);
    }
    if (image) {
      updateMetaName("twitter:image", image);
    }

    // Update robots meta tag
    updateMetaName("robots", noIndex ? "noindex,nofollow" : "index,follow");

    // Update canonical URL
    if (url) {
      updateCanonicalUrl(`${siteConfig.url}${url}`);
    }
  }, [title, description, keywords, image, url, noIndex]);

  // Generate social sharing URLs
  const socialUrls =
    url && title ? generateSocialShareUrls(url, title, description) : null;

  return {
    socialUrls,
    shareUrl: url ? `${siteConfig.url}${url}` : siteConfig.url,
    shareTitle: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
    shareDescription: description || siteConfig.description,
  };
}

// Utility functions for updating meta tags
function updateMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function updateMetaName(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function updateCanonicalUrl(url: string) {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", url);
}

// Hook for managing structured data
export function useStructuredData(data: object) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    script.id = "structured-data";

    // Remove existing structured data
    const existing = document.getElementById("structured-data");
    if (existing) {
      existing.remove();
    }

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [data]);
}

// Hook for managing page-specific meta tags
export function usePageMeta({
  title,
  description,
  keywords,
  image,
  url,
  noIndex,
  structuredData,
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  noIndex?: boolean;
  structuredData?: object;
} = {}) {
  const metadata = useMetadata({
    title,
    description,
    keywords,
    image,
    url,
    noIndex,
  });

  useStructuredData(structuredData || {});

  return metadata;
}

// Social sharing hook
export function useSocialShare({
  url,
  title,
  description,
  image,
}: {
  url: string;
  title: string;
  description?: string;
  image?: string;
}) {
  const shareData = {
    title: `${title} | ${siteConfig.name}`,
    text: description || siteConfig.description,
    url: `${siteConfig.url}${url}`,
  };

  const canShare = typeof navigator !== "undefined" && "share" in navigator;

  const share = async () => {
    if (canShare) {
      try {
        await navigator.share(shareData);
        return true;
      } catch (error) {
        console.error("Error sharing:", error);
        return false;
      }
    }
    return false;
  };

  const socialUrls = generateSocialShareUrls(url, title, description);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      return true;
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      return false;
    }
  };

  return {
    share,
    canShare,
    socialUrls,
    shareData,
    copyToClipboard,
  };
}
