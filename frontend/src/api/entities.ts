import type { Entity } from "@/types/entity";
import type { EntityFormValues } from "@/schemas/enetitySchema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ApiResponse<T> = {
  message: string;
  data: T;
};

type DeleteResponse = {
  message: string;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result as T;
};

export const getEntities = async (): Promise<Entity[]> => {
  const response = await fetch(`${API_BASE_URL}/api/entities`);

  const result = await handleResponse<ApiResponse<Entity[]>>(response);

  return result.data;
};

export const createEntity = async (data: EntityFormValues): Promise<Entity> => {
  const response = await fetch(`${API_BASE_URL}/api/entities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await handleResponse<ApiResponse<Entity>>(response);

  return result.data;
};

export const updateEntity = async (id: number, data: EntityFormValues): Promise<Entity> => {
  const response = await fetch(`${API_BASE_URL}/api/entities/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await handleResponse<ApiResponse<Entity>>(response);

  return result.data;
};

export const deleteEntity = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/entities/${id}`, {
    method: "DELETE",
  });

  await handleResponse<DeleteResponse>(response);
};
