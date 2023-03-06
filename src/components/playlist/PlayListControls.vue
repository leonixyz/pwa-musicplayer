<template>
    <div class="sticky top">
        <div class="centered">
            <div class="background">
                <ControlButton icon="fa-solid fa-folder-plus" @click="$emit('addDirectory')" />
                <ControlButton icon="fa-solid fa-magnifying-glass" @click="$emit('addSong')" />
                <ControlButton icon="fa-solid fa-floppy-disk" @click="$emit('savePlaylist')" />
                <ControlButton icon="fa-solid fa-list" @click="$emit('openPlaylist')" />
                <ControlButton icon="fa-solid fa-trash-can" @click="$emit('flushPlaylist')" :disabled="!canFlush" />
            </div>
            <hr class="fade">
        </div>
    </div>
</template>

<script setup>
import ControlButton from '../shared/ControlButton.vue'
defineProps(["canFlush"])
defineEmits(["addSong", "addDirectory", "savePlaylist", "openPlaylist", "flushPlaylist"])
</script>
