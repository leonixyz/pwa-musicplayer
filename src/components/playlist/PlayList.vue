<template>
    <PlayListControls
        :can-flush="songs.length > 0"
        @add-song="$emit('addSong')"
        @add-directory="$emit('addDirectory')"
        @save-playlist="$emit('savePlaylist')"
        @open-playlist="$emit('openPlaylist')"
        @flush-playlist="$emit('flushPlaylist')"
    />
    <div class="playlist-container">
        <PlayListItem
            v-for="item in songs"
            :key="item"
            :song="item"
            :moving-allowed="!isMoveActionStarted"
            @item-clicked="(song) => handleClick(song)"
            @item-moving="(song, moving) => beginMoveAction(song, moving)"
            @item-trashed="(song) => $emit('deleteSong', song)"
            :active="playing === item"
        />
    </div>
    <EmptyListPlaceholder v-if="songs.length === 0">
        <template v-slot>
            playlist is empty
        </template>
        <template v-slot:bottom>
            import files or folders
            <i class="fa-solid fa-folder-plus"></i><br />
            search for music
            <i class="fa-solid fa-magnifying-glass"></i><br />
            save current playlist
            <i class="fa-solid fa-floppy-disk"></i><br />
            open a saved playlist
            <i class="fa-solid fa-list"></i><br />
            flush current playlist
            <i class="fa-solid fa-trash-can"></i><br />
        </template>        
    </EmptyListPlaceholder>
</template>

<script setup>
import PlayListControls from './PlayListControls.vue'
import PlayListItem from './PlayListItem.vue'
import EmptyListPlaceholder from '../shared/EmptyListPlaceholder.vue';
import { ref, watch, toRef } from 'vue'

const props = defineProps(["songs", "playing", "fakeEvent"])
const emit = defineEmits([
    "addSong",
    "addDirectory",
    "savePlaylist",
    "openPlaylist",
    "flushPlaylist",
    "playSong",
    "deleteSong",
    "moveItem"
])

const isMoveActionStarted = ref(false)
let itemToMove = null
const fakeEventRef = toRef(props, "fakeEvent")

const handleClick = (song) => {
    isMoveActionStarted.value ?
        moveItem(song) :
        playSong(song)
}

const beginMoveAction = (song, moving) => {
    isMoveActionStarted.value = moving
    itemToMove = moving ? song : null
}

const playSong = (song) => {
    emit("playSong", song)
}

const moveItem = (where) => {
    emit("moveItem", itemToMove, where)
}

watch(fakeEventRef, () => {
    isMoveActionStarted.value = false
})
</script>

<style scoped>
.playlist-container {
    display: flex;
    flex-direction: column;
}
</style>