import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * Enhanced SSE hook with:
 * - Auto-reconnect with exponential backoff
 * - Zone-filtered subscriptions
 * - Event-type listeners
 * - Connection status tracking
 */
const useSSE = (url, options = {}) => {
  const { zone, onEvent } = options;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectDelayRef = useRef(1000);

  const buildUrl = useCallback(() => {
    if (!url) return null;
    const params = new URLSearchParams();
    if (zone) params.set('zone', zone);
    return params.toString() ? `${url}?${params.toString()}` : url;
  }, [url, zone]);

  const connect = useCallback(() => {
    const fullUrl = buildUrl();
    if (!fullUrl) return;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource(fullUrl);
    eventSourceRef.current = es;

    es.onopen = () => {
      setConnected(true);
      setError(null);
      reconnectDelayRef.current = 1000; // Reset backoff on successful connection
    };

    es.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setData(parsed);
        // Fire event-specific callbacks
        if (onEvent && parsed.type) {
          onEvent(parsed.type, parsed.data);
        }
      } catch (err) {
        console.error('[SSE] Parse error:', err);
      }
    };

    es.onerror = (err) => {
      setConnected(false);
      es.close();
      
      // Exponential backoff reconnect (max 30s)
      const delay = Math.min(reconnectDelayRef.current, 30000);
      reconnectDelayRef.current = delay * 2;
      
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, delay);
    };
  }, [buildUrl, onEvent]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (eventSourceRef.current) eventSourceRef.current.close();
      setConnected(false);
    };
  }, [connect]);

  return { data, error, connected };
};

export default useSSE;
