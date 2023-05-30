import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { spawn } from "child_process";
import electronPath from 'electron'
import { build as electronBuild } from 'electron-builder';

function electron() {
    let config;
    return {
        name: 'electron-plugin',
        configResolved(resolvedConfig) {
            // 存储最终解析的配置
            config = resolvedConfig
        },
        configureServer(server) {
            server.httpServer.on('listening', () => {
                const { port } = server.httpServer.address();
                const env = {
                    DEBUG_URL: `http://localhost:${port}`
                }
                const app = spawn(
                    electronPath,
                    ['electron/main.js'],
                    {
                        stdio: 'inherit',
                        env
                    }
                );
                app.on('exit', function (code) {
                    process.exit(code);
                });
            })

        },
        async writeBundle() {
            await electronBuild({
                config: {
                    nsis: {
                        allowElevation: false,
                    },
                    win: {
                        target: 'nsis'
                    },
                    directories: {
                        output: './electron-dist'
                    },
                    extraMetadata: {
                        main: 'main.js'
                    },
                    files: [
                        "package.json",
                        {
                            "from": config.build.outDir,
                            "to": "./",
                            // "filter": "!**!/electron-out"
                        },
                        {
                            "from": './electron/',
                            "to": "./",
                        }
                    ],
                }
            })
        }
    }
}

export default defineConfig({
    base: './',
    plugins: [vue(), electron()]
});