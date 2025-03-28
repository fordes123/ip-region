import { Adapter, Data, Region } from './base';

export class MeituanAdapter implements Adapter {
    private readonly baseUrl = 'https://apimobile.meituan.com/locate/v2/ip/loc';

    async query(base: Data): Promise<Data> {
        try {

            const ip = base.ip;
            const headers = {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
                'Referer': 'https://meituan.com/'
            }
            const response = await fetch(`${this.baseUrl}?rgeo=true&ip=${ip}`, { headers });
            const raw = await response.json();

            return this.transform(base, raw, ip);
        } catch (error) {
            throw error;
        }
    }

    private transform(base: Data, raw: any, ip: string): Data {
        const data = raw.data;
        const region: Region = {
            country: data.rgeo.country || base.region.country,
            province: data.rgeo.province || base.region.province,
            city: data.rgeo.city || base.region.city,
            district: data.rgeo.district || base.region.district
        };

        return {
            ip,
            lng: data.lng || base.lng,
            lat: data.lat || base.lat,
            region: region,
            ext: {
                adcode: data.rgeo.adcode || '',
                fromwhere: data.fromwhere || '',
            }
        };
    }
}
