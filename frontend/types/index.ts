export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

export type Generator = {
  id: number;
  title: string;
  iconNumber: number;
  user: User;
  options: Option[];
  participants: Participant[];
};

export type Participant = {
  id: number;
  user: User;
  notifications: boolean;
  selections: Selection[];
};

export type Selection = {
  id: number;
  option: Option;
  favorised: boolean;
  excluded: boolean;
};

export type Option = {
  id: number;
  name: string;
  description: string;
  categories: string[];
};

export type Category = {
  category: string;
  options: Option[] | undefined;
};

export type Result = {
  id: number;
  dateTime: Date;
  option: Option;
  user: User;
  generatorId: number;
};
