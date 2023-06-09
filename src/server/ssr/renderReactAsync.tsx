import React from 'react';
import App from '../../client/App';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import fs from 'fs';
import { HTML_TEMPLATE_PATH } from '../configuration';
import { PrerenderData } from '../../shared/PrerenderedData';
import { ServerStyleSheet } from 'styled-components';
import path from 'path';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import ReactDOMServer from 'react-dom/server';
/**
 * Renders the react App as a html string.
 * @param url The render url. It will be injected in the react router so it can render the corresponding route.
 * @param prerenderedObject An object created in the server that can be accessed in the client side.
 * @returns A html string;
 */
export async function renderReactAsync(url: string, prerenderedObject?: unknown) {
	// read the html template file

	const staticHtmlContent = await fs.promises.readFile(HTML_TEMPLATE_PATH, { encoding: 'utf-8' });

	// create an element to store server side data

	const dataElement = PrerenderData.saveToDom(prerenderedObject);

	const WrappedApp = (
		<StaticRouter location={url}>
			<App serverData={prerenderedObject ?? null} />
		</StaticRouter>
	);

	/*
        render the react html content and the styled-component style sheet as string.
        without prerendering styled-components, the page will flash a styleless version of it
     */

	const [reactContent, styleTags] = renderToStringWithStyles(WrappedApp);

	// finally combine all parts together

	const renderedHtml = buildHtml(staticHtmlContent, reactContent, styleTags, dataElement);

	return renderedHtml;
}

function buildHtml(templateHtml: string, reactHtml: string, styleTags: string, dataTag: string) {
	const pattern = /(?<head><head>)|(?<root><div\sid="root">)/g;

	return templateHtml.replace(pattern, (match, ...params: any[]) => {
		const groups = params.pop();

		if (groups.head) return groups.head + styleTags;
		if (groups.root) return dataTag + groups.root + reactHtml;

		return match;
	});
}

function renderToStringWithStyles(component: JSX.Element) {
	debugger;
	const sheet = new ServerStyleSheet();
	try {
		// In SSR, using react-router-dom/BrowserRouter will throw an exception.
		// Instead, we use react-router-dom/server/StaticRouter.
		// In the client compilation, we still use BrowserRouter (see: src/client/Index.tsx)
		const statsFile = path.resolve('./dist/loadable-stats.json');
		const extractor = new ChunkExtractor({ statsFile });
		const jsx = extractor.collectChunks(component);

		const reactHtml = `
            <html>
                <head>
                    ${extractor.getLinkTags()}
                </head>
                <body>
                    <div id="react-app">${ReactDOMServer.renderToString(jsx)}</div>
                    ${extractor.getScriptTags()}
                </body>
            </html>
        `;
		return [reactHtml, extractor.getStyleTags()];
	} finally {
		sheet.seal();
	}
}
