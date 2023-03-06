<template>
    <div class="sticky top">
        <div class="centered">
            <div class="background">
                <ControlButton
                    icon="fa-solid fa-arrow-left"
                    @click="$emit('popPath')"
                    :disabled="!canPoppath"
                />
                <ControlButton
                    icon="fa-solid fa-check-double"
                    @click="$emit('selectAll')"
                />
                <ControlButton
                    icon="fa-solid fa-folder-plus"
                    @click="$emit('addSelectedsongs')"
                    :disabled="!canAdd"
                />
                <span>
                    {{ selectedCount }} selected
                </span>
                <ControlButton
                    icon="fa-solid fa-close"
                    @click="$emit('showPlaylist')"
                    style="float:right;"
                />
            </div>
            <hr class="fade">
        </div>
    </div>
</template>

<script setup>
import ControlButton from '../shared/ControlButton.vue'
defineEmits(["showPlaylist", "popPath", "selectAll", "addSelectedsongs"])
defineProps(["canPoppath", "canAdd", "selectedCount"])
</script>
