"use client";

import { useCallback, useEffect, useState } from "react";
import { contentService } from "@/services/content.service";

export function useContent({ autoLoad = true } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await contentService.list();

      setItems(Array.isArray(data) ? data : []);

      return data;

    } catch (err) {
      setError(err?.message || "Unable to load content");

      setItems([]);

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      
      const timer = setTimeout(load, 0);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [autoLoad, load]);

  return { items, setItems, loading, error, refresh: load };
}
