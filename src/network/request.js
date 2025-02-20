import axios from 'axios'

export function request(config){
	const instance = axios.create({
		baseURL: 'http://123.207.32.32:8000',
	});

	return instance(config);
	
}


export function post_request(url, data, config){
	config.baseURL = "http://127.0.0.1:5000";
	const instance = axios.post(url, data, config);

	return instance;
}







