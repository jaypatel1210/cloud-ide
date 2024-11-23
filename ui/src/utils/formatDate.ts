function formatDate(timestamp: { _seconds: number; _nanoseconds: number }) {
  if (
    typeof timestamp._seconds !== 'number' ||
    typeof timestamp._nanoseconds !== 'number'
  ) {
    throw new Error('Invalid timestamp format');
  }

  const milliseconds =
    timestamp._seconds * 1000 + Math.floor(timestamp._nanoseconds / 1_000_000);
  const date = new Date(milliseconds);

  // Format the date using Intl.DateTimeFormat
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export default formatDate;
