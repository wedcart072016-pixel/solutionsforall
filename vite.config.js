import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Invitation and example folders in public/ are standalone sites; serve their index.html
// instead of letting the SPA fallback answer /invitations/<slug>/.
const publicFolderIndex = () => {
    const middleware = (publicDir) => (req, res, next) => {
        const url = (req.url || '').split('?')[0];
        if (url.endsWith('/') && url !== '/') {
            const file = path.join(publicDir, decodeURIComponent(url), 'index.html');
            if (fs.existsSync(file)) {
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                fs.createReadStream(file).pipe(res);
                return;
            }
        }
        next();
    };

    return {
        name: 'public-folder-index',
        configureServer(server) {
            server.middlewares.use(middleware(server.config.publicDir));
        },
        configurePreviewServer(server) {
            server.middlewares.use(middleware(server.config.build.outDir));
        },
    };
};

// cPanel/Apache installations do not always apply SPA rewrite rules. Emit a
// real /templates/ entry point so that route also loads from static hosting.
const staticTemplateEntry = () => {
    let outDir;

    return {
        name: 'static-template-entry',
        apply: 'build',
        configResolved(config) {
            outDir = path.resolve(config.root, config.build.outDir);
        },
        writeBundle() {
            const templateDir = path.join(outDir, 'templates');
            fs.mkdirSync(templateDir, { recursive: true });
            fs.copyFileSync(path.join(outDir, 'index.html'), path.join(templateDir, 'index.html'));
        },
    };
};

export default defineConfig({
    plugins: [
        publicFolderIndex(),
        staticTemplateEntry(),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    server: {
        host: '127.0.0.1',
        port: 5173,
    },
    preview: {
        host: '127.0.0.1',
        port: 4173,
    },
});
