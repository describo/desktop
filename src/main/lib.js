import { dialog } from "electron"
export async function loadCrate() {
    console.log("F:loadCrate")
    const { cancelled, filePaths } = await dialog.showOpenDialog({ properties: ["openDirectory"] })
    if (cancelled) return
    return filePaths[0]
}

export async function loadProfileFromDisk() {
    console.log("F:loadProfileFromDisk")

    // loads a file dialog and allows a user to select a locally installed profile
    // TODO: do we really want to allow this?
}

export async function loadProfileFromUrl(event, data) {
    console.log("F:loadProfileFromUrl", data.url)

    // returns the profile JSON object from the specified url
}

export async function loadProfilesFromGithub() {
    console.log("F:loadProfilesFromGithub", data.url)

    // returns the profiles in the profiles repo
}

export async function saveCrate(event, data) {
    console.log("F:saveCrate", data.crate)

    // saves the crate file back to the specified folder
}
