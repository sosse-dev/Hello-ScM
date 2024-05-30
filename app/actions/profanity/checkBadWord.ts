export const checkBadWord = async (message: string) => {
  try {
    const res = await fetch("https://vector.profanity.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });

    const json = await res.json();
    return json.isProfanity
  } catch {
    return null;
  }
};
