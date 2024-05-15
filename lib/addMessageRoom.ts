import qs from "query-string";

export const addMessageRoom = async ({
  apiUrl,
  receiverId,
  senderId,
}: {
  receiverId: string;
  senderId: string;
  apiUrl: string;
}) => {
  const url = qs.stringifyUrl({
    url: apiUrl,
    query: {
      receiverId,
      senderId,
    },
  });

  const res = await fetch(url, {
    method: "POST",
    body: null,
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
};
