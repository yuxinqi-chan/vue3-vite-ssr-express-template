const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const asyncHandler = require('./src/utils/asyncHandler');
const compression = require('compression');
const serveStatic = require('serve-static');
const createDevServer = require('./create-dev-server');
const {mongoClient} = require('./src/mongodb');

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD;
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
const resolve = (p) => path.resolve(__dirname, p);

async function createServer(isProd = isProduction) {
    const app = express();
    app.use(morgan('dev'));
    if (isProd) {
        app.use(compression());
        app.use(serveStatic(resolve('dist/client'), {
            index: false
        }));
    }
    app.use(express.json());
    app.use(require('./src/services'));
    app.use(require('./src/controllers'));
    if (!isProd) {
        const devServer = await createDevServer();
        app.use(devServer.app);
    } else {
        const template = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8');
        const manifest = require('./dist/client/ssr-manifest.json');
        const render = require('./dist/server/entry-server.js').render;
        app.all('*', asyncHandler(async (req, res) => {
            const [appHtml, state, links, asyncDatas] = await render(req, manifest);
            const html = template.replace(`<!--preload-links-->`, links)
                .replace(`'<vuex-state>'`, state)
                .replace(`'<async-datas>'`, JSON.stringify(asyncDatas))
                .replace(`<!--app-html-->`, appHtml);
            res.status(200).set({'Content-Type': 'text/html'}).end(html);
        }));
    }
    return app;
}

if (!isTest) {
    mongoClient.connect()
        .then(() => createServer())
        .then(app =>
            app.listen(port, host, () => {
                console.log(`http://${host}:${port}`);
            })
        );
}

exports.createServer = createServer;
