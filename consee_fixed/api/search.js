export default async function handler(req, res) {
  const { artist, city, date } = req.query;

  if (!artist) {
    return res.status(200).json({ events: [] });
  }

  const apiKey = process.env.TICKETMASTER_API_KEY;

  const params = new URLSearchParams({
    apikey: apiKey,
    keyword: artist,
    classificationName: "music",
    size: 20
  });

  if (city) params.append("city", city);
  if (date) params.append("startDateTime", `${date}T00:00:00Z`);

  const url = `https://app.ticketmaster.com/discovery/v2/events.json?${params}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const events =
      data._embedded?.events?.map(e => ({
        artist: e.name,
        venue: e._embedded.venues[0].name,
        city: e._embedded.venues[0].city.name,
        date: e.dates.start.localDate,
        url: e.url,
        image: e.images?.[0]?.url || ""
      })) || [];

    res.status(200).json({ events });
  } catch (err) {
    res.status(500).json({ error: "Ticketmaster API error" });
  }
}
