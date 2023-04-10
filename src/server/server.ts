import express from 'express';
import { errorMiddleware } from 'server/middleware/errorMiddleware';
import { reactMiddleware } from 'server/middleware/reactMiddleware';
import { useRouting } from 'server/middleware/routing';
import { PUBLIC_DIR_PATH } from 'server/configuration';

// we split the express app definition in a module separated from the entry point because it's easier to test.

export function createServer() {
	const server = express();

	server.use(
		express.static(PUBLIC_DIR_PATH, {
			index: false // we don't want the static middleware to serve index.html. The SSR content won't be served otherwise.
		})
	);

	useRouting(server);

	// renders the react app as fallback. The corresponding route will be handled by react router
	server.use(/.*/, reactMiddleware());

	server.use(errorMiddleware());

	return server;
}
