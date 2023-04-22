import { createServer } from './server';
import { PORT } from './configuration';
import express from 'express';
import { errorMiddleware } from './middleware/errorMiddleware';
import { reactMiddleware } from './middleware/reactMiddleware';
import { useRouting } from './middleware/routing';
import { PUBLIC_DIR_PATH } from './configuration';
import { NextFunction, Request, Response } from 'express';
import * as renderReact from './ssr/renderReactAsync';
// we split the express app definition in a module separated from the entry point because it's easier to test.
const server = express();

server.use(express.static(PUBLIC_DIR_PATH));

// server.get('/', async (req, res) => {
// 	const model = {
// 		id: 123,
// 		message: 'This data came from the server'
// 	};

// 	try {
// 		debugger;
// 		const html = await renderReact.renderReactAsync(req.url, model);
// 		return res.status(200).contentType('text/html').send(html);
// 	} catch {
// 		return res.status(500).send('Internal server error');
// 	}
// });

// // renders the react app as fallback. The corresponding route will be handled by react router
// server.use(/.*/, async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		debugger;
// 		// TODO some caching, maybe?
// 		const reactHtml = await renderReact.renderReactAsync(req.url);
// 		res.set('content-type', 'text/html').status(200).send(reactHtml);
// 	} catch (error) {
// 		next(error);
// 	}
// });

server.use(errorMiddleware());

server.listen(PORT, () => {
	console.log(`Server listening to port ${PORT}`);
});
