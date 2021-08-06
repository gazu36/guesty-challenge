const axios = require('axios').default;

class RequstsHandler {
	#axiosInstance
	constructor(baseUrl) {
		this.#axiosInstance = axios.create({
			baseURL: baseUrl || process.env.REQ_HANDLER_BASE_URL
		})
	}

	async request(url, reqOpts) {
		return await this.#axiosInstance.request({
			url,
			...reqOpts,
			data: reqOpts.body,
			headers: {
				...reqOpts?.headers,
				Authorization: process.env.AUTHTOKEN
			}
		}).then(res => res.data);
	}
}

module.exports = RequstsHandler;