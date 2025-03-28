import { Adapter, Data, Region } from './base';

export class BilibiliAdapter implements Adapter {


    private readonly baseUrl = 'https://api.live.bilibili.com/ip_service/v1/ip_service/get_ip_addr';
    async query(base: Data): Promise<Data> {
        try {
            const ip = base.ip;
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.4728.898 Safari/537.36',
                'Referer': 'https://www.bilibili.com/'
            }
            const response = await fetch(`${this.baseUrl}?ip=${ip}`, { headers });
            const raw = await response.json();

            return this.transform(base, raw, ip);
        } catch (error) {
            throw error;
        }
    }

    private transform(base: Data, raw: any, ip: string): Data {
        const data = raw.data;
        const region: Region = {
            country: data.country || base.region.country,
            province: data.province || base.region.province,
            city: data.city || base.region.city,
            district: base.region.district
        };

        return {
            ip,
            lng: data.longitude || base.lng,
            lat: data.latitude || base.lat,
            region: region,
            ext: {
                isp: data.isp || '',
            }
        };
    }
}
