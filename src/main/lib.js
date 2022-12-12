import { dialog } from "electron"
import { readJSON, pathExists } from "fs-extra"
import path from "path"
import fetch from "cross-fetch"

export async function loadCrate() {
    console.log("F:loadCrate")
    const { filePaths } = await dialog.showOpenDialog({ properties: ["openDirectory"] })
    if (!filePaths.length) return

    const folder = filePaths[0]
    const crateFilePath = path.join(filePaths[0], "ro-crate-metadata.json")
    let crate
    if (await pathExists(crateFilePath)) {
        crate = await readJSON(crateFilePath)
    } else {
        crate = getCrateSkeleton()
    }
    return { crate, folder }
}

export async function loadProfileFromDisk() {
    console.log("F:loadProfileFromDisk")

    const { filePaths } = await dialog.showOpenDialog({ properties: ["openFile"] })
    if (!filePaths.length) return

    const filePath = filePaths[0]
    let profile = await readJSON(filePath)
    return { profile }
}

export async function loadProfileFromUrl(event, data) {
    console.log("F:loadProfileFromUrl", data.url)

    // returns the profile JSON object from the specified url
    let response = await fetch(data.url, { method: "GET" })
    if (response.status === 200) {
        let profile = await response.json()
        return { profile }
    }
    return
}

export async function loadProfilesFromGithub() {
    console.log("F:loadProfilesFromGithub", data.url)

    // returns the profiles in the profiles repo
}

export async function saveCrate(event, data) {
    console.log("F:saveCrate", data.crate)

    // saves the crate file back to the specified folder
}

function getCrateSkeleton() {
    return {
        "@context": [
            "https://w3id.org/ro/crate/1.1/context",
            {
                "@base": null
            }
        ],
        "@graph": [
            {
                "@id": "ro-crate-metadata.json",
                "@type": "CreativeWork",
                conformsTo: {
                    "@id": "https://w3id.org/ro/crate/1.1"
                },
                about: {
                    "@id": "./"
                }
            },
            {
                "@id": "./",
                "@type": ["Dataset"],
                name: "My Research Object Crate"
            }
        ]
    }
}
