<template>
    <div
        class="item"
        ref="htmlElement"
        @click="$emit('itemClicked', song)"
        :class="{
            'active': active,
            'is-trashing': isTrashing,
            'is-trashed': isTrashed,
            'is-moving': isMoving,
        }"
    >
        <div class="control movable" @click.stop="handleMoveClick">
            <div class="up-down-controls">
                <i class="fa-solid fa-caret-up" v-if="!isTrashing"></i>
                <i class="fa-solid fa-caret-down" v-if="!isTrashing"></i>
            </div>
        </div>
        <div class="title">
            <span v-if="isTrashing">click again to delete</span>
            <span v-else-if="isMoving">click where to move this</span>
            <span v-else>{{ song }}</span>
        </div>
        <div class="control" @click.stop="handleTrashClick">
            <i class="fa-solid fa-trash-can" v-if="!isMoving"></i>
        </div>
    </div>  
</template>

<script setup>
import { ref, watch, toRef } from 'vue'

const props = defineProps(["song", "active", "movingAllowed"])
const emit = defineEmits(["itemTrashed", "itemClicked", "itemMoving"])

const htmlElement = ref(null)
const isTrashing = ref(false)
const isTrashed = ref(false)
const isMoving = ref(false)
const isActive = toRef(props, "active")
const isMovingAllowed = toRef(props, "movingAllowed")

const handleMoveClick = () => {
    if (props.movingAllowed || isMoving.value) {
        move()
    } else {
        emit("itemClicked", props.song)
    }
}

const handleTrashClick = () => {
    if (props.movingAllowed || isMoving.value) {
        trash()
    } else {
        emit("itemClicked", props.song)
    }
}

const move = () => {
    isMoving.value = !isMoving.value
    emit("itemMoving", props.song, isMoving.value)
}

const trash = () => {
    if (isTrashing.value) {
        isTrashed.value = true
        setTimeout(() => {
            emit("itemTrashed", props.song)
        }, 1000)
    } else {
        isTrashing.value = true
        setTimeout(() => {
            isTrashing.value = false
        }, 4000)
    }
}

watch(isActive, (value) => {
    if (value) {
        htmlElement.value.scrollIntoView({behaviour: "smooth"})
    }
})

watch(isMovingAllowed, (value) => {
    if (value) {
        isMoving.value = false
    }
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
    overflow-wrap: break-word;
}
.item.active {
    background-color: var(--bg-active);
    color: var(--fg-active);
}
.movable {
    cursor: move;
}
.item.is-trashing {
    background-color: var(--bg-alert);
    color: var(--fg-alert);
    transform: rotateX(360deg);
}
.is-trashed {
    opacity: 0;
    min-height: 0;
    height: 0;
    margin: 0;
    padding: 0;
    overflow: hidden;
}
.control {
    font-size: 1.4rem;
    padding: 0 0.3rem;
}
.up-down-controls {
    display: flex;
    flex-direction: column;
}
.title {
    flex-grow: 1;
    margin: 0 0.5rem;
}

.is-trashing .title {
    text-align: right;
}

.item.is-moving {
    transform: rotateX(-360deg);
    color: var(--fg-active-alt);
    background-color: var(--bg-active-alt);
}
</style>