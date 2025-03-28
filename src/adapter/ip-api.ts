import { Adapter, Data, Region } from './base';

export class IPApiAdapter implements Adapter {


	private readonly baseUrl = 'http://ip-api.com/json/';

	async query(base: Data): Promise<Data> {
		try {
			const ip = base.ip;
			const headers = {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.4728.898 Safari/537.36',
				'Origin': 'https://ip-api.com',
				'Referer': 'https://ip-api.com/'
			};
			const response = await fetch(`${this.baseUrl}${ip}?lang=zh-CN`, { headers });
			const raw = await response.json();

			return this.transform(base, raw, ip);
		} catch (error) {
			throw error;
		}
	}

	private transform(base: Data, raw: any, ip: string): Data {
		const region: Region = {
			country: raw.country || base.region.country,
			province: raw.regionName || base.region.province,
			city: raw.city || base.region.city,
			district: base.region.district
		};

		return {
			ip,
			lng: raw.lng || base.lng,
			lat: raw.lat || base.lat,
			region: region,
			ext: {
				countryCode: raw.countryCode || '',
				zip: raw.zip || '',
				isp: raw.isp || '',
				timezone: raw.timezone || '',
				org: raw.org || '',
				as: raw.as || ''
			}
		};
	}
}
