export async function searchEvents(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`/api/events/search?${query}`);
  return res.json();
}

export async function nearbyEvents(postalCode) {
  const res = await fetch(`/api/events/nearby?postalCode=${postalCode}`);
  return res.json();
}
