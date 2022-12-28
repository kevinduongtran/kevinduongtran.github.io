export interface Room {
  gameMode: string;
  map: Map;
  password: string;
  roomId: string;
  roomName: string;
  teams: Team[];
}

export interface Map {
  location: Location;
  name: string;
  zoom: number;
}

export interface Location {
  lat: number;
  long: number;
}

export interface Team {
  id: string;
  teamName: string;
  squads: Squad[];
}

export interface Player {
  iconType?: string;
  location?: Location;
  sessionId?: string;
  squadNumber?: number;
  username?: string;
}

export interface Squad {
  id: string;
  squadNumber: number;
  players: Player[];
}

export interface ModalOptions {
  title?: string;
  bodyText?: string;
  form?: ModalFormType[];
  onCloseCallback?: any;
  hasCloseButton: boolean;
  submitText: string;
}

export interface ModalFormType {
  type: string;
  id: string;
  value?: undefined;
  label: string;
}
