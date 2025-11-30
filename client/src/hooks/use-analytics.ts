import { useEffect, useCallback } from "react";

function getVisitorId(): string {
  let visitorId = localStorage.getItem("visitorId");
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem("visitorId", visitorId);
  }
  return visitorId;
}

export function useAnalytics() {
  const trackEvent = useCallback((eventType: string, page: string, section?: string) => {
    try {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          page,
          section,
          visitorId: getVisitorId(),
          userAgent: navigator.userAgent,
          referrer: document.referrer || null,
        }),
      }).catch(() => {});
    } catch {
    }
  }, []);

  const trackPageView = useCallback((page: string) => {
    trackEvent("page_view", page);
  }, [trackEvent]);

  const trackSectionView = useCallback((page: string, section: string) => {
    trackEvent("section_view", page, section);
  }, [trackEvent]);

  return { trackEvent, trackPageView, trackSectionView };
}

export function useSectionTracking(sectionId: string) {
  const { trackSectionView } = useAnalytics();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackSectionView(window.location.pathname, sectionId);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById(sectionId);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sectionId, trackSectionView]);
}
