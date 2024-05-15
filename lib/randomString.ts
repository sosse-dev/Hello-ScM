
function randomString(length: number) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const charactersLength = characters.length;
    let counter = 0;
    while ( counter < length ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
        counter += 1
    }
    return result
}

const checkUsername = async (username: string) => {
    try {
      const res = await fetch(`/api/userdata/byUsername/${username}`);
      const { data } = await res.json();

      if (!data) {
        return {
          data: "NOT FOUND",
        };
      }

      return data;
    } catch (err) {
      return null;
    }
  };

export async function filteredString() {
    const checkedUsername = await checkUsername(randomString(14))

    if(checkedUsername?.username === checkUsername(randomString(14))) {
        return randomString(14)
    }

    return randomString(14)
}