export interface Adapter {

  query(ip: string | null): Promise<Data>;
  
}

export interface Data {
  lng: number;
  ip: string;
  region: Region;
  lat: number;
  ext: Record<string, any>;
}


export interface Region {
  country: string;
  province: string;
  city: string;
  district: string;
}



