import { useState } from 'react';

export function useAssessment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assessment, setAssessment] = useState(null);

  const assess = async (profile) => {
    setLoading(true);
    setError(null);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1000000);
      let response;
      try {
        response = await fetch('/api/assess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile),
          signal: controller.signal,
        });
      } catch (fetchErr) {
        if (fetchErr.name === 'AbortError') {
          throw new Error('This is taking longer than expected — NYC programs are complex. Please try again.');
        }
        throw fetchErr;
      } finally {
        clearTimeout(timeout);
      }

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Assessment failed. Please try again.');
      }

      if (!response.ok) {
        const parts = [data?.error, data?.debug].filter(Boolean);
        throw new Error(parts.length ? parts.join(' — ') : 'Assessment failed. Please try again.');
      }

      setAssessment(data);
      return data;
    } catch (err) {
      const message = err.message || 'Something went wrong. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAssessment(null);
    setError(null);
    setLoading(false);
  };

  return { assess, loading, error, assessment, reset };
}
