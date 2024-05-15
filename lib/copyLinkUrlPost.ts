export const copyLinkUrlPost = (postId: string) => {
  const base = "http://localhost:3000";
  // TODO: Ganti kalau udah deploy!

  const link = `${base}/post?id=${postId}`;
  navigator.clipboard.writeText(link);
};
