export type EntityType = "vehicle" | "iot_device" | "facility";

export type EntityStatus = "active" | "inactive";

export type Entity = {
  id: number;
  name: string;
  type: EntityType;
  status: EntityStatus;
  latitude: number;
  longitude: number;
};
