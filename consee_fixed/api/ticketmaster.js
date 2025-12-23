export default async function handler(req, res) {
  const { keyword, city, startDate, postalCode } = req.query;

  const params = new URLSearchParams({
    apikey: process.env.TICKETMASTER_API_KEY,
    classificationName: "music",
    size: "12"
  });

  if (keyword) params.append("keyword", keyword);
  if (city) params.append("city", city);
  if (postalCode) params.append("postalCode", postalCode);
  if (startDate) params.append("startDateTime", new Date(startDate).toISOString());

  const url = `https://app.ticketmaster.com/discovery/v2/events.json?${params}`;

  const response = await fetch(url);
  const data = await response.json();

  res.status(200).json(data);
}
