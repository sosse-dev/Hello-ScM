export const copyLinkUrlPost = (postId: string) => {
  const base = process.env.NEXT_PUBLIC_BASE_URL;

  const link = `${base}/post?id=${postId}`;
  navigator.clipboard.writeText(link);
};
