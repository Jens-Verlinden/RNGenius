const myGenerators = async (token: string) => {
  return fetch(
    encodeURI(process.env.EXPO_PUBLIC_API_URL + `/generator/myGenerators`),
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const generateOption = async (token: string, generatorId: number) => {
  return fetch(
    encodeURI(
      process.env.EXPO_PUBLIC_API_URL + `/generator/generate/${generatorId}`
    ),
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const addGenerator = async (
  token: string,
  title: string,
  iconNumber: number
) => {
  return fetch(encodeURI(process.env.EXPO_PUBLIC_API_URL + `/generator/add`), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, iconNumber }),
  });
};

const addOption = async (
  token: string,
  generatorId: number,
  name: string,
  categories: string[],
  description: string
) => {
  return fetch(
    encodeURI(
      process.env.EXPO_PUBLIC_API_URL + `/generator/addOption/${generatorId}`
    ),
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, categories, description }),
    }
  );
};

const addParticipant = async (
  token: string,
  generatorId: number,
  email: string
) => {
  return fetch(
    encodeURI(
      process.env.EXPO_PUBLIC_API_URL +
        `/generator/addParticipant/${generatorId}?email=${email}`
    ),
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const updateGenerator = async (
  token: string,
  generatorId: number,
  title: string,
  iconNumber: number
) => {
  return fetch(
    encodeURI(
      process.env.EXPO_PUBLIC_API_URL + `/generator/update/${generatorId}`
    ),
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, iconNumber }),
    }
  );
};

const deleteGenerator = async (token: string, generatorId: number) => {
  return fetch(
    encodeURI(
      process.env.EXPO_PUBLIC_API_URL + `/generator/delete/${generatorId}`
    ),
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const deleteOption = async (
  token: string,
  optionId: number,
  category: string
) => {
  return fetch(
    encodeURI(
      process.env.EXPO_PUBLIC_API_URL +
        `/generator/deleteOption/${optionId}?category=${category}`
    ),
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const purgeOption = async (token: string, optionId: number) => {
  return fetch(
    encodeURI(
      process.env.EXPO_PUBLIC_API_URL + `/generator/purgeOption/${optionId}`
    ),
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const deleteParticipant = async (
  token: string,
  generatorId: number,
  participantId: number
) => {
  return fetch(
    encodeURI(
      process.env.EXPO_PUBLIC_API_URL +
        `/generator/removeParticipant/${generatorId}?participantId=${participantId}`
    ),
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const leaveGenerator = async (token: string, generatorId: number) => {
  return fetch(
    encodeURI(
      process.env.EXPO_PUBLIC_API_URL + `/generator/leave/${generatorId}`
    ),
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const excludeOption = async (token: string, optionId: number) => {
  return fetch(
    encodeURI(
      process.env.EXPO_PUBLIC_API_URL + `/generator/exclude/${optionId}`
    ),
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const excludeCategory = async (
  token: string,
  generatorId: number,
  category: string
) => {
  return fetch(
    encodeURI(
      process.env.EXPO_PUBLIC_API_URL +
        `/generator/excludeCategory/${generatorId}?category=${category}`
    ),
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const favoriseOption = async (token: string, optionId: number) => {
  return fetch(
    encodeURI(
      process.env.EXPO_PUBLIC_API_URL + `/generator/favorise/${optionId}`
    ),
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const favoriseCategory = async (
  token: string,
  generatorId: number,
  category: string
) => {
  return fetch(
    encodeURI(
      process.env.EXPO_PUBLIC_API_URL +
        `/generator/favoriseCategory/${generatorId}?category=${category}`
    ),
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const myResults = async (token: string) => {
  return fetch(
    encodeURI(process.env.EXPO_PUBLIC_API_URL + `/generator/myResults`),
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const toggleNotifications = async (
  token: string,
  generatorId: number
) => {
  return fetch(
    encodeURI(
      process.env.EXPO_PUBLIC_API_URL +
        `/generator/toggleNotifications/${generatorId}`
    ),
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const GeneratorService = {
  myGenerators,
  generateOption,
  addGenerator,
  addOption,
  addParticipant,
  updateGenerator,
  deleteGenerator,
  deleteOption,
  deleteParticipant,
  leaveGenerator,
  excludeOption,
  excludeCategory,
  favoriseOption,
  favoriseCategory,
  myResults,
  toggleNotifications,
  purgeOption,
};
