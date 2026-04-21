export default async function handler(req, res) {
  const response = await fetch("https://api.retellai.com/create-web-call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RETELL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agent_id: process.env.RETELL_AGENT_ID,
    }),
  });

  const data = await response.json();

  return res.status(200).json({
    access_token: data.access_token,
    call_id: data.call_id,
  });
}
