<template>
    <div class="sticky top">
        <div class="centered">
            <div class="background">
                <ControlButton icon="fa-solid fa-plus" @click="$emit('addSelectedsongs')" :disabled="!canAdd" />
                <ControlButton icon="fa-solid fa-check-double" @click="$emit('toggleSelectAll')" :disabled="!canSelect" />
                <ControlButton icon="fa-solid fa-close" @click="$emit('showPlaylist')" style="float:right;" />
            </div>
            <hr class="fade">
        </div>
    </div>
</template>

<script setup>
import ControlButton from '../shared/ControlButton.vue'
defineEmits(["addSelectedsongs", "showPlaylist", "toggleSelectAll"])
defineProps(["canAdd", "canSelect"])
</script>
