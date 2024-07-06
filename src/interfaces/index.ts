export type payload = {
  userId: string;
};

export type SignToken = (
  payload: payload,
  duration?: string,
) => Promise<string | null>;
