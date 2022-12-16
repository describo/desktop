<template>
    <el-dialog
        v-model="props.dialogVisible"
        title="Apply a profile"
        fullscreen
        destroy-on-close
        @close="closeDialog"
    >
        <template #header>Select a profile to use with this crate</template>
        <div class="flex flex-col space-y-6" v-if="props.dialogVisible">
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
                <GithubProfileExplorerComponent @load-profile="loadProfile" />
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { reactive, onMounted } from "vue"
import { isURL } from "validator"
import { debounce } from "lodash"
import GithubProfileExplorerComponent from "./GithubProfileExplorer.component.vue"

const $emit = defineEmits(["close", "load-profile"])
const props = defineProps({
    dialogVisible: { type: Boolean }
})
const data = reactive({
    loading: false,
    debouncedLoadProfileFromUrl: debounce(loadProfileFromUrl, 200)
})

function closeDialog() {
    $emit("close")
}
async function loadProfileFromDisk() {
    const { profile } = await window.api.loadProfileFromDisk()
    loadProfile(profile)
}
async function loadProfileFromUrl() {
    if (!isURL(data.url, { protocols: ["http", "https"] })) return
    const { profile } = await window.api.loadProfileFromUrl({ url: data.url })
    loadProfile(profile)
}
function loadProfile(profile) {
    $emit("load-profile", profile)
    closeDialog()
}
</script>
