import {defineConfig, build as viteBuild } from 'vite'
import {resolve} from "path";
import vue from "@vitejs/plugin-vue";
import { spawn } from "child_process";
import electronPath from 'electron'
import { build as electronBuild } from 'electron-builder';


function electron(pluginConfig) {
    const {main, preload} = pluginConfig
    let viteConfig
    return {
        name: 'electron-build',
        configResolved(resolvedConfig) {
            viteConfig = resolvedConfig
        },
        configureServer(server) {
            server.httpServer.on('listening', () => {
                const {address, port} = server.httpServer.address()
                const url = `http://${address}:${port}`
                const env = {
                    DEBUG_URL: url,
                    DEV: viteConfig.command === 'serve'
                }
                const child = spawn(electronPath, [main], { stdio: 'inherit', windowsHide: false,env });
                child.on('close', function (code, signal) {
                    if (code === null) {
                        console.error(electron, 'exited with signal', signal);
                        process.exit(1);
                    }
                    process.exit(code);
                });
            })
        },
        async writeBundle() {
            // await viteBuild({
            //     configFile: false,
            //     root: viteConfig.root,
            //     build: {
            //         ...viteConfig.build,
            //         ssr: true,
            //         emptyOutDir: false,
            //         rollupOptions: {
            //             input: {
            //                 main,
            //                 preload,
            //             },
            //             output: {
            //                 format: 'cjs',
            //                 entryFileNames:'[name].js',
            //             },
            //         },
            //         commonjsOptions: {
            //             exclude: '**/node_modules/*',
            //             include: '**/*'
            //         }
            //     }
            // });
            await electronBuild({
                config: {
                    nsis: {
                        allowElevation: false,
                    },
                    win: {
                        target: 'nsis'
                    },
                    directories: {
                        output: resolve(viteConfig.build.outDir, 'electron-out')
                    },
                    extraMetadata: {
                        main: 'main.js'
                    },
                    files: [
                        "package.json",
                        {
                            "from": viteConfig.build.outDir,
                            "to": "./",
                            "filter": "!**/electron-out"
                        },
                        {
                            "from": './electron/',
                            "to": "./",
                        }
                    ],
                }
            })
        },

    }
}

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    build: {
        // outDir: resolve(__dirname, '.dist'),
        minify: true,
        emptyOutDir: true
    },
    plugins: [vue(), electron({
        main: resolve(__dirname, 'electron/main.js'),
        preload: resolve(__dirname, 'electron/preload.js'),
    })]
})
