import { configure } from 'axios-hooks';
import LRU from 'lru-cache';
import Axios from 'axios';

export const axios = Axios.create({
	baseURL: (window['ARGON_CHALLENGE_CONFIG'] && window['ARGON_CHALLENGE_CONFIG']['REACT_APP_API_ENDPOINT']) || 'https://argon-server-guy.herokuapp.com/',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
});

const cache = new LRU({ max: 10 });

configure({ axios, cache });
