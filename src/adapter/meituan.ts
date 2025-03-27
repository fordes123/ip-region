import { Adapter, Data, Region } from './base';

export class MeituanAdapter implements Adapter {
    private readonly baseUrl = 'https://apimobile.meituan.com/locate/v2/ip/loc';

    async query(ip: string): Promise<Data> {
        try {

            const headers = {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
                'Referer': 'https://meituan.com/'
            }
            const response = await fetch(`${this.baseUrl}?rgeo=true&ip=${ip}`, { headers });
            const raw = await response.json();

            return this.transform(raw, ip);
        } catch (error) {
            throw error;
        }
    }

    private transform(raw: any, ip: string): Data {
        const data = raw.data;
        const region: Region = {
            country: data.rgeo.country,
            province: data.rgeo.province,
            city: data.rgeo.city,
            district: data.rgeo.district
        };

        return {
            ip,
            lng: data.lng || 0,
            lat: data.lat || 0,
            region: region,
            ext: {
                adcode: data.rgeo.adcode || '',
                fromwhere: data.fromwhere || '',
            }
        };
    }
}
