// mostly taken from https://github.com/sindresorhus/wait-for-localhost
// copy pasted as we do not use esm at the moment
import http from 'node:http';

export default function waitForLocalhost(timeout: number) {
	return new Promise(resolve => {
        const request = http.request({method: "head", port: 9000, family: 4, timeout}, response => {
            if (response.statusCode === 200) {
                resolve(200);
                return;
            }
        });

        request.end();
	});
}