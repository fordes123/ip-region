import { Adapter, Data, Region } from './adapter/base';
import { MeituanAdapter } from './adapter/meituan';
import { BilibiliAdapter } from './adapter/bilibili';
import { IPApiAdapter } from './adapter/ip-api';

const HEADERS = {
	'Content-Type': 'application/json',
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET'
};

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		const data = parse(request);
		const adapterName = url.searchParams.get('adapter') || env.DEFAULT_ADAPTER || 'ip-api';

		try {
			const instance = getAdapter(adapterName);
			const result = await instance.query(data);
			return new Response(JSON.stringify(result), {
				headers: HEADERS
			});

		} catch (error) {
			console.log('query error: ', error);
			return new Response(JSON.stringify(data), {
				headers: HEADERS
			});
		}


	}
} satisfies ExportedHandler<Env>;


function getAdapter(adapterName: string): Adapter {
	switch (adapterName.toLowerCase()) {
		case 'meituan':
			return new MeituanAdapter();
		case 'bilibili':
			return new BilibiliAdapter();
		case 'ip-api':
			return new IPApiAdapter();
		default:
			throw new Error(`Adapter "${adapterName}" not found`);
	}
}

function parse(request: Request): Data {
	const headers = request.headers;
	const ip = headers.get('CF-Connecting-IP') || '';

	return {
		ip: ip,
		lng: Number(request.cf?.longitude) || 0,
		lat: Number(request.cf?.latitude) || 0,
		region: {
			country: String(request.cf?.country || ''),
			province: '',
			city: String(request.cf?.city || ''),
			district: ''
		},
		ext: {
			regionCode: String(request.cf?.regionCode || '')
		}
	};
}
