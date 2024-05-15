export const getUserByUsername = async (username: string) => {
  const res = await fetch(`/api/userdata/by-username/${username}`);
  const { data: user } = await res.json();

  return user;
};
