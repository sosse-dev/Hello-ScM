export const copyLinkUrlPost = (postId: string) => {
  const base = process.env.NEXT_URL;
  // TODO: Ganti kalau udah deploy!

  const link = `${base}/post?id=${postId}`;
  navigator.clipboard.writeText(link);
};
