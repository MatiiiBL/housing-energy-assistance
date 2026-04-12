import { useState } from 'react';

export function useAssessment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assessment, setAssessment] = useState(null);

  const assess = async (profile) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (!response.ok) {
        const parts = [data.error, data.debug].filter(Boolean);
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
