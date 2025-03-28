export interface Adapter {

  query(base: Data): Promise<Data>;

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



