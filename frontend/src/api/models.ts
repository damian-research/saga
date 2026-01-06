export interface Ancestor {
  naId: number;
  title: string;
  level: string;
  distance: number;
}

export interface RawRecord {
  naId: number;
  title: string;
  level: string;
  ancestors: Ancestor[];
  path: PathSegment[];
  totalDigitalObjects?: number;
}

export interface FullRecord {
  naId: number;
  title: string;
  ancestors: Ancestor[];
  digitalObjects: DigitalObject[];
}

export interface DigitalObject {
  objectType: string;
  objectUrl: string;
  objectFileSize: number;
}

export interface PathSegment {
  type: "recordGroup" | "series" | "fileUnit" | "item";
  label: string; // render
  naId: number; // link, navigation
}
