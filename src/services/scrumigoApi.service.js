import axios from "axios";

const scrumigoApiService = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
});

scrumigoApiService.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("authToken");

  if (authToken) {
    config.headers.authorization = `Bearer ${authToken}`;
  }

  return config;
});

export async function signUpAsync(name, surname, email, password) {
  const body = {
    name,
    surname,
    email,
    password,
  };

  const response = await scrumigoApiService.post(`/auth/signup`, body);
  return response.data;
}

export async function loginAsync(email, password) {
  const body = {
    email,
    password,
  };

  const response = await scrumigoApiService.post("/auth/login", body);
  return response.data;
}

export async function verifyAsync(email, password) {
  const response = await scrumigoApiService.get("/auth/verify");
  return response.data;
}

export async function getSprintsAsync(populateUserStories = false) {
  const response = await scrumigoApiService.get("/sprints", {
    params: {
      populateUserStories,
    },
  });
  return response.data;
}

export async function getSprintAsync(sprintId) {
  const response = await scrumigoApiService.get(`/sprints/${sprintId}`, {
    params: {
      populateUserStories: true,
    },
  });
  return response.data;
}

export async function createSprintAsync(sprint) {
  const response = await scrumigoApiService.post("/sprints", sprint);
  return response.data;
}

export async function updateSprintAsync(sprintId, sprint) {
  const response = await scrumigoApiService.patch(
    `/sprints/${sprintId}`,
    sprint,
  );
  return response.data;
}

export async function deleteSprintAsync(sprintId) {
  await scrumigoApiService.delete(`/sprints/${sprintId}`);
}

export async function getUserStoriesAsync(populateSprint = false) {
  const response = await scrumigoApiService.get(`/userStories`, {
    params: {
      populateSprint,
    },
  });

  return response.data;
}

export async function getUserStoryAsync(
  userStoryId,
  populateSprint = false,
  populateTasks = false,
) {
  const response = await scrumigoApiService.get(`/userStories/${userStoryId}`, {
    params: {
      populateSprint,
      populateTasks,
    },
  });

  return response.data;
}

export async function createUserStoryAsync(userStory) {
  const response = await scrumigoApiService.post("/userStories", userStory);

  return response.data;
}

export async function updateUserStoryAsync(userStoryId, userStory) {
  const response = await scrumigoApiService.patch(
    `/userStories/${userStoryId}`,
    userStory,
  );

  return response.data;
}

export async function deleteUserStoryAsync(userStoryId) {
  await scrumigoApiService.delete(`/userStories/${userStoryId}`);
}

export async function createTaskAsync(userStoryId, task) {
  const response = await scrumigoApiService.post("/tasks", {
    ...task,
    userStoryId,
  });

  return response.data;
}

export async function updateTaskAsync(taskId, task) {
  const response = await scrumigoApiService.patch(`/tasks/${taskId}`, task);

  return response.data;
}

export async function deleteTaskAsync(taskId) {
  await scrumigoApiService.delete(`/tasks/${taskId}`);
}

export default scrumigoApiService;
