export type TokenCard = {
  name: string;
  number: string;
  cvc: string;
  expMonth: string;
  expYear: string;
};

export type TokenData = {
  id: string;
  livemode: boolean;
  object: "token";
  used: boolean;
  createdAt: number;
  card?: Record<string, unknown>;
} & Record<string, unknown>;
