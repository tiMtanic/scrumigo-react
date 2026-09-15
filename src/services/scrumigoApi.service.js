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
  const response = await scrumigoApiService.get(
    `/sprints?populateUserStories=${populateUserStories}`,
  );
  return response.data;
}

export async function getSprintAsync(sprintId) {
  const response = await scrumigoApiService.get(
    `/sprints/${sprintId}?populateStories=true`,
  );
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

export async function getUserStoriesAsync() {
  const response = await scrumigoApiService.get("/userStories");
  return response.data;
}

export async function deleteSprintAsync(sprintId) {
  await scrumigoApiService.delete(`/sprints/${sprintId}`);
}

export default scrumigoApiService;
