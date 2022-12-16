<template>
    <div class="py-4">
        <el-tree
            :load="loadNode"
            :props="data.props"
            accordion
            lazy
            @node-click="click"
            v-loading="data.loading"
        />
    </div>
</template>

<script setup>
import fetch from "cross-fetch"
import { reactive } from "vue"
const basePath = "https://api.github.com/repos/describo/profiles/contents/domain-profiles"

const $emit = defineEmits(["load-profile"])
const data = reactive({
    loading: false,
    props: {
        isLeaf: "leaf"
    }
})

async function loadNode(path, resolve) {
    path = path.data.label ? `${basePath}/${path.data.label}` : basePath
    let response = await fetch(path)
    if (response.status === 200) {
        let content = await response.json()
        content = content.map((e) => ({
            label: e.name,
            basePath: path,
            leaf: e.name.match(/.*\.json/) ? true : false
        }))
        resolve(content)
    }
}

async function click(node) {
    if (node.label.match(/.*\.json/)) {
        data.loading = true
        let { basePath, label: name } = node
        let response = await fetch(`${basePath}/${name}`)
        if (response.status === 200) {
            let profile = await response.json()
            response = await fetch(profile.download_url)
            if (response.status == 200) {
                profile = await response.json()
                $emit("load-profile", profile)
                data.loading = false
            }
        }
    }
}
</script>
