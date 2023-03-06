<template>
    <div class="sticky top">
        <div class="centered">
            <div class="background">
                <ControlButton icon="fa-solid fa-floppy-disk" @click="$emit('savePlaylist')" :disabled="!canSave" v-if="mode === 'save'" />
                <ControlButton icon="fa-solid fa-folder-open" @click="$emit('loadPlaylist')" :disabled="!canOpen" v-if="mode === 'open'" />
                <ControlButton icon="fa-solid fa-close" @click="$emit('showPlaylist')" style="float:right;"/>
                <ControlButton icon="fa-solid fa-trash-can" @click="$emit('deletePlaylist')" :disabled="!canDelete" v-if="mode === 'open'" style="float:right;" />
            </div>
            <hr class="fade">
        </div>
    </div>
</template>

<script setup>
import ControlButton from '../shared/ControlButton.vue'
defineProps(["mode", "canSave", "canOpen", "canDelete"])
defineEmits(["savePlaylist", "loadPlaylist", "deletePlaylist", "showPlaylist"])
</script>
