<template>
    <AddDirectoryControls
        :can-poppath="path.length > 0"
        :can-add="selection.length > 0"
        :selected-count="selection.length"
        @show-playlist="$emit('showPlaylist')"
        @pop-path="popPath"
        @select-all="selectAll"
        @add-selectedsongs="addSelectedsongs"
    />
    <div>
        <div
            class="item"
            :class="{'active': isSelected(item)}"
            v-for="item in dirContent"
            :key="item"
            @click.stop="handleClick(item)"
        >
            <span class="icon-container">
                <i
                    class="fa-solid"
                    :class="{
                        'fa-folder': getType(item) === 'dir',
                        'fa-file-audio': getType(item) === 'file',
                    }"
                ></i>
            </span>
            <span class="title">
                {{ item }}
            </span>
            <span class="icon-container">
                <i
                    @click.stop="toggleSelectItem(item)"
                    class="fa-solid"
                    :class="{
                        'fa-square' : !isSelected(item),
                        'fa-square-check' : isSelected(item),
                    }"
                ></i>
            </span>
        </div>

    </div>
</template>

<script setup>
import AddDirectoryControls from "./AddDirectoryControls.vue";
import { computed, ref, toRef, onBeforeMount } from "vue"

const emit = defineEmits(["showPlaylist", "addSelectedsongs"])

let database = []
const tree = ref({})
const pointer = toRef(tree.value)
const path = ref([])
const selection = ref([])

const dirContent = computed(() => {
    if (!pointer.value) {
        return []
    }
    const keys = Object.keys(pointer.value)
    if (keys.includes(".")) {
        const i = keys.indexOf(".")
        const files = [...pointer.value["."]]
        keys.splice(i, 1)
        keys.push(...files)
    }
    return keys
})

const selectionProcessed = computed(() => {
    return selection.value.map((selected) => {
        return `/${selected.join("/")}`
    })
})

const toggleSelectItem = (item) => {
    const fullpath = [...path.value, item]
    if (isSelected(item)) {
        selection.value = selection.value.filter((select) => {
            return JSON.stringify(select) != JSON.stringify(fullpath)
        })
    } else {
        selection.value.push(fullpath)
    }

}

const isSelected = (item) => {
    const fullpath = "/" + [...path.value, item].join("/")
    return selectionProcessed.value.indexOf(fullpath) > -1
}

const getType = (token) => {
    return token
        .toLowerCase()
        .endsWith('.mp3')
            ? 'file'
            : 'dir'
}

const pushPath = (token) => {
    path.value.push(token)
    pointer.value = pointer.value[token]
}

const popPath = () => {
    path.value.pop()
    pointer.value = tree.value
    path.value.forEach((token) => {
        pointer.value = pointer.value[token]
    })
}

const selectAll = () => {
    const dir = dirContent.value.map((token) => {
        return "/" + [...path.value, token].join("/")
    })
    const anySelected = dir.some((elem) => selectionProcessed.value.includes(elem))
    if (anySelected) {
        console.log("some selected")
        dirContent.value.forEach((token) => {
            if (isSelected(token)) {
                toggleSelectItem(token)
            }
        })
    } else {
        dirContent.value.forEach((token) => {
            toggleSelectItem(token)
        })
    }
}

const addSelectedsongs = () => {
    let selectedSongs = []

    selectionProcessed.value.forEach((selectedEntry) => {
        if (selectedEntry.toLowerCase().endsWith(".mp3")) {
            selectedSongs.push(selectedEntry)
        } else {
            selectedSongs = selectedSongs.concat(
                database.filter((dbItem) => {
                    return dbItem.startsWith(selectedEntry)
                })
            )
        }
    })

    emit("addSelectedsongs", selectedSongs)
    emit("showPlaylist")
}

const populateTree = () => {
    const tmpTree = {}
    for (let j = 0; j < database.length; j++) {
        const file = database[j]

        const tokens = file.split("/").filter((t) => t)
        let pointer = tmpTree

        for (let i = 0; i < tokens.length; i++) {
            const t = tokens[i]
            if (pointer[t] === undefined) {
                if (i === tokens.length - 1) {
                    pointer["."] = pointer["."] ? pointer["."] : []
                    pointer["."].push(t)
                    continue
                }
                pointer[t] = {}
            }
            pointer = pointer[t]
        }
    }
    tree.value = tmpTree
    pointer.value = tree.value
}

const handleClick = (token) => {
    if (getType(token) === "file" || isSelected(token)) {
        toggleSelectItem(token)
    } else {
        pushPath(token)
    }
}

onBeforeMount(async () => {
  database = await (await fetch("/database.json")).json()
  populateTree()
})
</script>

<style scoped>
.item {
    background-color: var(--bg-alt);
    color: var(--fg-alt);
    margin: 0.2rem 0;
    padding: 0.3rem;
    min-height: 3rem;
    cursor: pointer;
    transition: all linear 0.5s;
    display: flex;
    align-items: center;
}

.item.active {
    background-color: var(--bg-active);
    color: var(--fg-active);
}

.title {
    flex-grow: 1;
    margin: 0 0.5rem;
}

.icon-container {
    padding: 0.3rem;
}
</style>