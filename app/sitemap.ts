import { MetadataRoute } from "next";
import getAllUsers from "./actions/getAllUsers";
import getAllPosts from "./actions/getAllPosts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const users = await getAllUsers();
  const posts = await getAllPosts();

  const userEntries = users?.map(({ username }) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${username}`,
    lastModified: new Date(),
    priority: 0.7,
  })) as MetadataRoute.Sitemap;

  const postEntries = posts?.map(({ id }) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/post?id=${id}`,
    lastModified: new Date(),
    priority: 0.5,
  })) as MetadataRoute.Sitemap;

  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/explore`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/setting`,
      lastModified: new Date(),
      priority: 0.3,
    },
    ...userEntries,
    ...postEntries,
  ];
}
