export type ApplicationStatus = 'approved' | 'pending' | 'rejected' | 'not_found';

export async function submitApplication(data: {
  evmAddress: string;
  xUsername: string;
  quoteTweet: string;
}): Promise<void> {
  const res = await fetch('/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Submission failed');
  }
}

export async function checkStatus(address: string): Promise<ApplicationStatus> {
  const res = await fetch(`/api/status/${encodeURIComponent(address)}`);

  if (res.status === 404) return 'not_found';

  if (!res.ok) throw new Error('Status check failed');

  const data = await res.json();
  return data.status ?? 'not_found';
}
