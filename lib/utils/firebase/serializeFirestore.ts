import { Timestamp } from "firebase/firestore";

/*
serialize the firestore db data to be used eg. to convert firestore Timestamp
*/

export function serializeFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (data instanceof Timestamp) {
    return data.toDate() as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => serializeFirestore(item)) as unknown as T;
  }

  if (typeof data === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      result[key] = serializeFirestore(value);
    }

    return result as T;
  }

  return data;
}