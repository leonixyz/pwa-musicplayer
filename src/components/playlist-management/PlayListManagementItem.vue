<template>
    <div class="item" :class="{'active': active}">
        <span class="icon-container">
            <i class="fa-solid fa-list"></i>
        </span>
        <span class="title">
            <slot></slot>
        </span>
    </div>
</template>

<script setup>
defineProps(["active"])
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