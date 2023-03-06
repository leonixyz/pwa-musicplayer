<template>
    <PlayListManagementControls
        @show-playlist="$emit('showPlaylist')"
        @save-playlist="savePlaylist"
        @load-playlist="loadPlaylist"
        @delete-playlist="deletePlaylist"
        :can-open="canOpen"
        :can-delete="canDelete"
        :can-save="canSave"
        :mode="managementMode"
    />
    <div>
        <input
            type="text"
            v-model="playlistNameModel"
            placeholder="Playlist name..."
            class="w100"
            v-if="managementMode === 'save'"
        />
    </div>
    <div>
        <PlayListManagementItem
            v-for="playlistName in playlistNames"
            :key="playlistName"
            @click="selectPlaylist(playlistName)"
            :active="playlistNameModel === playlistName"
        >
            {{ playlistName }}
        </PlayListManagementItem>
        <EmptyListPlaceholder v-if="playlistNames.length === 0">
            <template v-slot>
                no playlists saved
            </template>
            <template v-slot:bottom v-if="managementMode === 'save'">
                choose a name and save with
                <i class="fa-solid fa-floppy-disk"></i><br />
            </template>
            <template v-slot:bottom v-else>
                open selected playlist with
                <i class="fa-solid fa-folder-open"></i><br />
                delete selected playlist with
                <i class="fa-solid fa-trash-can"></i><br />    
            </template>
        </EmptyListPlaceholder>
    </div>    
</template>

<script setup>
import { onBeforeMount, onBeforeUnmount, ref, computed, onMounted } from 'vue'
import PlayListManagementControls from './PlayListManagementControls.vue';
import PlayListManagementItem from './PlayListManagementItem.vue';
import EmptyListPlaceholder from '../shared/EmptyListPlaceholder.vue';

const emit = defineEmits(["showPlaylist", "loadPlaylist"])
const props = defineProps(["managementMode", "playlist"])

onMounted(() => {
  playlists.value = JSON.parse(localStorage.getItem("playlists")) || {}
})

const playlistNameModel = ref('')
const selectedPlaylist = ref(null)
const playlists = ref({})

const playlistNames = computed(() => Object.keys(playlists.value))
const canOpen = computed(() => selectedPlaylist.value !== null)
const canDelete = computed(() => selectedPlaylist.value !== null)
const canSave = computed(() => playlistNameModel.value !== '')

const loadPlaylist = () => {
    emit("loadPlaylist", selectedPlaylist.value)
    emit("showPlaylist")
}

const savePlaylist = () => {
    if (playlistNames.value.indexOf(playlistNameModel.value) > -1) {
        if (!confirm("Overwrite playlist?")) {
            return
        }
    }
    playlists.value[playlistNameModel.value] = { "tracks": props.playlist }
    localStorage.setItem("playlists", JSON.stringify(playlists.value))
    emit("showPlaylist")
}

const deletePlaylist = () => {
    if (!confirm("Are you sure?")) {
        return
    }
    delete playlists.value[playlistNameModel.value]
    localStorage.setItem("playlists", JSON.stringify(playlists.value))
}

const selectPlaylist = (playlistName) => {
    playlistNameModel.value = playlistName
    selectedPlaylist.value = playlists.value[playlistName]
}

const blurActiveElement = () => {
    document.activeElement.blur()
}

onBeforeMount(() => {
  document.addEventListener('scroll', blurActiveElement)
})

onBeforeUnmount(() => {
  document.removeEventListener('scroll', blurActiveElement)
})

</script>
