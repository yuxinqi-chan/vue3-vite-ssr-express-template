const fs = require('fs');
const path = require('path');
const express = require('express');
const asyncHandler = require('./src/utils/asyncHandler');

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD;

/**
 *
 * @returns {Promise<{app: (*|Express), vite: import('vite').ViteDevServer}>}
 */
async function createDevServer() {
    const app = express();
    const vite = await require('vite').createServer({
        root: process.cwd(),
        logLevel: isTest ? 'error' : 'info',
        server: {
            middlewareMode: 'ssr',
            watch: {
                usePolling: true,
                interval: 100
            }
        },
    });
    app.use(vite.middlewares);
    app.all('*', asyncHandler(async (req, res) => {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        let render = (await vite.ssrLoadModule('/src/entry-server.js')).render;
        const [appHtml, state, links, asyncDatas] = await render(req, {});
        const html = template
            .replace(`<!--preload-links-->`, links)
            .replace(`'<vuex-state>'`, state)
            .replace(`'<async-datas>'`, JSON.stringify(asyncDatas))
            .replace(`<!--app-html-->`, appHtml);
        res.status(200).set({'Content-Type': 'text/html'}).end(html);
    }));
    app.use(function (err, req, res, next) {
        console.log(err);
        vite.ssrFixStacktrace(err);
    });
    return {app, vite};
}

module.exports = createDevServer;
