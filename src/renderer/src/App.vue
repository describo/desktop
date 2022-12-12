<template>
    <div class="flex flex-col">
        <div class="flex flex-row py-4 bg-indigo-200 p-2">
            <div v-if="!data.folder">
                <el-button @click="loadCrate" type="primary">select a folder to describe</el-button>
            </div>
            <div v-else class="flex flex-row space-x-2">
                <div class="pt-1">{{ data.folder }}</div>
                <div>
                    <el-button @click="unloadCrate" type="danger">
                        <i class="fa-solid fa-trash-can"></i>
                    </el-button>
                </div>
            </div>
            <div class="flex-grow"></div>
            <div v-if="!data.profile">
                <el-button
                    @click="data.profileDialogVisible = !data.profileDialogVisible"
                    type="primary"
                    >select a profile to use</el-button
                >
            </div>
            <div v-else class="flex flex-row space-x-2">
                <div class="pt-1">
                    {{ data.profile.metadata.name }} : {{ data.profile.metadata.version }}
                </div>
                <div>
                    <el-button @click="unloadProfile" type="danger">
                        <i class="fa-solid fa-trash-can"></i>
                    </el-button>
                </div>
            </div>
        </div>
        <div class="p-4">
            <describo-crate-builder :crate="data.crate" :profile="data.profile" v-if="data.crate" />
        </div>
    </div>
    <el-dialog v-model="data.profileDialogVisible" title="Apply a profile" fullscreen>
        <template #header>Select a profile to use with this crate</template>
        <div class="flex flex-col space-y-6">
            <div class="flex flex-row space-x-4 bg-indigo-200 p-4 rounded">
                <div class="text-lg">Load a profile from your computer</div>
                <div><el-button @click="loadProfileFromDisk" type="primary">Select</el-button></div>
            </div>
            <div class="flex-col bg-indigo-200 p-4 rounded">
                <div class="text-lg">Load a profile from a publically accessible URL</div>
                <div class="flex flex-row">
                    <el-input
                        v-model="data.url"
                        placeholder="Please input a url"
                        type="url"
                        @change="data.debouncedLoadProfileFromUrl"
                    />
                    <el-button @click="data.debouncedLoadProfileFromUrl" type="primary">
                        load
                    </el-button>
                </div>
                <div class="text-sm text-red-700">
                    This needs to be a valid URL : HTTP or HTTPS only
                </div>
            </div>
            <div class="flex-col bg-indigo-200 p-4 rounded">
                <div class="text-lg">
                    Load a profile from from https://github.com/describo/profiles
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { reactive } from "vue"
import { isURL } from "validator"
import { debounce } from "lodash"

const data = reactive({
    crate: undefined,
    profile: undefined,
    folder: undefined,
    url: undefined,
    profileDialogVisible: false,
    debouncedLoadProfileFromUrl: debounce(loadProfileFromUrl, 200)
})

async function loadCrate() {
    const { folder, crate } = await window.api.loadCrate()
    data.folder = folder
    data.crate = crate
}
function unloadCrate() {
    data.folder = undefined
    data.crate = undefined
}
async function loadProfileFromDisk() {
    const { profile } = await window.api.loadProfileFromDisk()
    data.profile = profile
    data.profileDialogVisible = !data.profileDialogVisible
}
async function loadProfileFromUrl() {
    if (!isURL(data.url, { protocols: ["http", "https"] })) return
    const { profile } = await window.api.loadProfileFromUrl({ url: data.url })
    data.profile = profile
    data.profileDialogVisible = !data.profileDialogVisible
}
function unloadProfile() {
    data.profile = undefined
    data.url = undefined
}

// async function saveCrate() {
//     await window.api.saveCrate({ crate: { something: "new" } })
// }
</script>
