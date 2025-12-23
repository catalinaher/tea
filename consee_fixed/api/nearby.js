import { fetchFromTicketmaster } from "../ticketmaster.js";

export default async function handler(req, res) {
  try {
    const { postalCode } = req.query;

    const data = await fetchFromTicketmaster(
      "/events.json",
      {
        postalCode,
        classificationName: "music",
      },
      process.env.TICKETMASTER_API_KEY
    );

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
