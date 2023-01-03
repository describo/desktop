const { execSync } = require("child_process")

module.exports = {
    packagerConfig: {
        asar: true,
        name: "Describo-Desktop",
        ignore: [
            "src",
            "build",
            "electron.vite.config.js",
            "forge.config.js",
            "postcss.config.js",
            "tailwind.config.js",
            "README.md"
        ],
        osxSign: {
            optionsForFile: (filePath) => {
                // Here, we keep it simple and return a single entitlements.plist file.
                // You can use this callback to map different sets of entitlements
                // to specific files in your packaged app.
                return {
                    entitlements: "./build/entitlements.mac.plist"
                }
            }
        },
        osxNotarize: {
            tool: "notarytool",
            appleId: process.env.APPLE_ID,
            appleIdPassword: process.env.APPLE_PASSWORD,
            teamId: process.env.APPLE_TEAM_ID
        }
    },
    rebuildConfig: {},
    makers: [
        {
            name: "@electron-forge/maker-dmg",
            config: {
                format: "ULFO"
            }
        },
        {
            name: "@electron-forge/maker-squirrel",
            config: {}
        },
        {
            name: "@electron-forge/maker-zip"
        },
        {
            name: "@electron-forge/maker-deb",
            config: {}
        },
        {
            name: "@electron-forge/maker-rpm",
            config: {}
        }
    ],
    publishers: [
        {
            name: "@electron-forge/publisher-github",
            config: {
                repository: {
                    owner: "describo",
                    name: "desktop"
                },
                prerelease: true
            }
        }
    ],
    hooks: {
        generateAssets: async (forgeConfig, platform, arch) => {
            execSync("npm run build:app")
        },
        prePackage: async (forgeConfig, platform, arch) => {
            if (!process.env.GITHUB_TOKEN) {
                console.log("")
                console.log(`In order to publish you need to set process.env.GITHUB_TOKEN`)
                process.exit()
            }
            if (
                platform === "darwin" &&
                (!process.env.APPLE_ID || !process.env.APPLE_PASSWORD || !process.env.APPLE_TEAM_ID)
            ) {
                console.log("")
                console.log(
                    `To build a MacOS distributable define process.env.{APPLE_ID, APPLE_PASSWORD, APPLE_TEAM_ID}`
                )
                console.log(
                    `See https://www.electronforge.io/guides/code-signing/code-signing-macos#osxnotarize-options for more information`
                )
                process.exit()
            }
        }
    }
}
