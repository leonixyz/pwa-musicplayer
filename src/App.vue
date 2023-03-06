<template>
    <main class="frame">
        <PlayList
            v-if="currentView === 'playlist'"
            :songs="playlist"
            :fake-event="fakeMoveEndedEventTrigger"
            :playing="playlist[index]"
            @play-song="(song) => playSong(song)"
            @delete-song="(song) => removeFromPlaylist(song)"
            @add-song="addSong"
            @add-directory="addDirectory"
            @save-playlist="savePlaylist"
            @open-playlist="openPlaylist"
            @flush-playlist="flushPlaylist"
            @move-item="(item, where) => moveItem(item, where)"
        />
        <PlayListManagement
            v-if="currentView === 'playlist-management'"
            @show-playlist="showPlaylist"
            @load-playlist="(data) => loadPlaylist(data)"
            :management-mode="managementMode"
            :playlist="playlist"
        />
        <SearchMusic
            v-if="currentView === 'search-music'"
            @add-selectedsongs="(selectedSongs) => addSelectedsongs(selectedSongs)"
            @show-playlist="showPlaylist"
        />
        <AddDirectory 
            v-if="currentView === 'add-directory'"
            @add-selectedsongs="(selectedSongs) => addSelectedsongs(selectedSongs)"
            @show-playlist="showPlaylist"
        />
        <AudioPlayer
            :src="audioFile"
            @previous-track="loadPreviousTrack"
            @next-track="loadNextTrack"
        />
    </main>
</template>

<script setup>
import { computed, ref, onBeforeMount } from 'vue'
import AudioPlayer from './components/player/AudioPlayer.vue'
import PlayList from './components/playlist/PlayList.vue'
import PlayListManagement from './components/playlist-management/PlayListManagement.vue'
import SearchMusic from './components/search-music/SearchMusic.vue'
import AddDirectory from './components/add-directory/AddDirectory.vue'

const playlist = ref([])
let currentView = ref('playlist')
let managementMode = ref('')
let index = ref(0)
let fakeMoveEndedEventTrigger = ref(0)

const audioFile = computed(() => {
    let path = playlist.value[index.value]
    if (!path) {
        return ''
    }
    path = encodeURI(path)
    path = path.replace("#", "%23")
    path = path.replace("+", "%2B")
    path = path.replace("?", "%3F")
    path = path.replace(":", "%3A")
    return `${import.meta.env.VITE_MUSIC_BASE_URL}${path}`
})

const setIndex = (value) => {
    index.value = value
    localStorage.setItem("lastPlayedIndex", value)
}

const playSong = (song) => {
    setIndex(playlist.value.indexOf(song))
}

const addSong = () => {
    currentView.value = "search-music"
}

const addDirectory = () => {
    currentView.value = "add-directory"
}

const loadPreviousTrack = () => {
    setIndex(index.value - 1)
}
const loadNextTrack = () => {
    setIndex(index.value + 1)
}

const showPlaylist = () => {
    currentView.value = "playlist"
}

const savePlaylist = () => {
    currentView.value = "playlist-management"
    managementMode.value = "save"
}

const openPlaylist = () => {
    currentView.value = "playlist-management"
    managementMode.value = "open"
}

const cachePlaylist = () => {
    localStorage.setItem(
        "lastPlayedPlaylist",
        JSON.stringify(playlist.value)
    )
}

const flushPlaylist = () => {
    if (!confirm("Remove all tracks from the current playlist?")) {
        return
    }
    playlist.value = []
    cachePlaylist()
}

const loadPlaylist = (data) => {
    playlist.value = data.tracks
    setIndex(0)
    cachePlaylist()
}

const addSelectedsongs = (selectedSongs) => {
    playlist.value.push(...selectedSongs)
    cachePlaylist()
}

const removeFromPlaylist = (song) => {
    const i = playlist.value.indexOf(song)
    if (i < index.value) {
        index.value -= 1
    }
    playlist.value.splice(i, 1)
    cachePlaylist()
}

const moveItem = (item, where) => {

    let itemId = playlist.value.indexOf(item)
    const whereId = playlist.value.indexOf(where)

    // handle cases where the currently playing song is going to
    // be moved, or is in between two songs that are moved
    if (itemId === index.value) {
        index.value = whereId
    } else if (itemId < index.value && whereId > index.value) {
        index.value -= 1
    } else if (itemId > index.value && whereId < index.value) {
        index.value += 1
    } else if (whereId == index.value) {
        if (itemId < index.value) {
            index.value -= 1
        } else if (itemId > index.value) {
            index.value += 1
        }
    }

    // move the element in place in the array
    const tmp = playlist.value[itemId]
    const direction = itemId < whereId ? 1 : -1
    while (itemId !== whereId) {
        playlist.value[itemId] = playlist.value[itemId + direction]
        itemId += direction
    }
    playlist.value[itemId] = tmp
    // hack to force childs update
    fakeMoveEndedEventTrigger.value += 1
}

onBeforeMount(() => {
    const i = localStorage.getItem("lastPlayedIndex")
    const p = localStorage.getItem("lastPlayedPlaylist")
    if (p) {
        playlist.value = JSON.parse(p)
    }
    if (i) {
        index.value = JSON.parse(i)
    }
})
</script>

<style scoped>
.frame {
    width: 100%;
    background-color: transparent;
    margin: 3.5rem auto 5.5rem auto;
    overflow: hidden;
}
</style>