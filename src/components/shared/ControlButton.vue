<template>
  <button type="button" :disabled="disabled">
    <i class="icon" :class="icon"></i>
    <slot></slot>
  </button>
</template>

<script setup>
defineProps(["icon", "disabled"])
</script>
