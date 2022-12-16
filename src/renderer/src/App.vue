<template>
    <div class="flex flex-col">
        <div class="flex flex-row py-4 bg-indigo-200 p-2 space-x-4">
            <div class="text-xl mr-4">Describo :: Desktop</div>
            <div class="flex-grow"></div>
            <div v-if="!data.folder">
                <el-button @click="loadCrate" type="primary">Select a folder to describe</el-button>
            </div>
            <div v-else class="flex flex-row space-x-2">
                <div class="pt-1">{{ data.folder }}</div>
                <div>
                    <el-button @click="unloadCrate" type="danger">
                        <i class="fa-solid fa-trash-can"></i>
                    </el-button>
                </div>
            </div>
            <div v-if="!data.profile">
                <el-button
                    @click="data.profileDialogVisible = !data.profileDialogVisible"
                    type="primary"
                    >Select a profile to use</el-button
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
            <describo-crate-builder
                :crate="data.crate"
                :profile="data.profile"
                v-if="data.crate"
                @ready="data.loading = false"
                v-loading="data.loading"
            />
        </div>
    </div>
    <ProfileDialogComponent
        :dialog-visible.sync="data.profileDialogVisible"
        @close="data.profileDialogVisible = false"
        @load-profile="loadProfile"
    />
</template>

<script setup>
import { reactive } from "vue"
import ProfileDialogComponent from "./components/ProfileDialog.component.vue"

const data = reactive({
    loading: false,
    crate: undefined,
    profile: undefined,
    folder: undefined,
    url: undefined,
    profileDialogVisible: false
})

async function loadCrate() {
    const { folder, crate } = await window.api.loadCrate()
    data.loading = true
    data.folder = folder
    data.crate = crate
}
function unloadCrate() {
    data.folder = undefined
    data.crate = undefined
}

function loadProfile(profile) {
    data.profile = profile
}
function unloadProfile() {
    data.profile = undefined
    data.url = undefined
}

// async function saveCrate() {
//     await window.api.saveCrate({ crate: { something: "new" } })
// }
</script>
