import { Adapter } from './adapter/base';
import { MeituanAdapter } from './adapter/meituan';

const HEADERS = {
	'Content-Type': 'application/json',
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET'
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const headers = request.headers;

		const ip = headers.get('CF-Connecting-IP');
		const adapterName = url.searchParams.get('adapter') || env.DEFAULT_ADAPTER || 'meituan';

		try {
			const instance = getAdapter(adapterName);
			const data = await instance.query(ip);
			return new Response(JSON.stringify(data), {
				headers: HEADERS,
			});

		} catch (error) {
			console.log('query error: ', error);
			return new Response('', {
				status: 500,
				headers: HEADERS
			});
		}


	},
} satisfies ExportedHandler<Env>;


function getAdapter(adapterName: string): Adapter {
	switch (adapterName.toLowerCase()) {
		case 'meituan':
			return new MeituanAdapter();
		default:
			throw new Error(`Adapter "${adapterName}" not found`);
	}
}
