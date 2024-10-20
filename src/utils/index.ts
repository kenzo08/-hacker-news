export function formatDate (timestamp: number)  {
  const date = new Date(timestamp * 1000); // Преобразуем Unix timestamp в миллисекунды
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
