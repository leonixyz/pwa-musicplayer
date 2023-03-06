<template>
  <div class="sticky bottom">
    <div class="centered">
      <hr class="fade" />
      <div class="background">
        <div>
          <input
            type="range"
            v-model="progress"
            @input="setProgress(progress)"
            class="w100"
            min="0"
            step="0.01"
            :max="maxProgress"
            :disabled="!audioFile"
          />
          <audio
            :src="audioFile"
            ref="$audio"
            :autoplay="!paused"
          />
        </div>
        <div class="controls-container">
          <ControlButton 
            icon="fa-solid fa-backward-step"
            @click="backward"
            :disabled="!audioFile"
          />
          <ControlButton
            icon="fa-solid fa-stop"
            @click="stop"
            :disabled="!audioFile"
          />
          <ControlButton
            :icon="playPauseIcon"
            @click="togglePlayPause"
            :disabled="!audioFile"
          />
          <ControlButton
            icon="fa-solid fa-forward-step"
            @click="forward"
            :disabled="!audioFile"
          />
          <ControlButton
            :icon="volumeIcon"
            @click="toggle_volume"
            :disabled="!audioFile"
          />
          <input
            type="range"
            v-model="volume"
            @input="setVolume(volume)"
            min="0"
            step="0.01"
            max="1"
            :disabled="!audioFile"
            class="volume-bar"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref , toRef, watch } from 'vue'
import ControlButton from '../shared/ControlButton.vue';

const props = defineProps(["src"])
const emit = defineEmits(["nextTrack", "previousTrack"])

const $audio = ref(null)
const volume = ref(1)
const muted = ref(false)
const paused = ref(true)
const progress = ref(0)
const maxProgress = ref(100)
const audioFile = toRef(props, "src")

const playPauseIcon = computed(() => {
  const playPause = paused.value ? 'fa-play' : 'fa-pause'
  return `fa-solid ${playPause}`
})

const volumeIcon = computed(() => {
  let icon = ""
  if (muted.value) {
    icon = "fa-volume-xmark"
  } else if (volume.value > 0.66) {
    icon = "fa-volume-high"
  } else if (volume.value > 0.33) {
    icon = "fa-volume-low"
  } else {
    icon = "fa-volume-off"
  }
  return `fa-solid ${icon}`
})

const play = () => {
  $audio.value.play()
  paused.value = false
  navigator.mediaSession.playbackState = "playing";
  updateMediaSession()
}

const stop = () => {
  $audio.value.pause()
  paused.value = true
  navigator.mediaSession.playbackState = "paused";
  seek_to(0)
}

const pause = () => {
  $audio.value.pause()
  paused.value = true
  navigator.mediaSession.playbackState = "paused";
}

const forward = () => {
  emit("nextTrack")
  updateMediaSession()
}

const backward = () => {
  emit("previousTrack")
  updateMediaSession()
}

const toggle_volume = () => {
  muted.value = !muted.value
  $audio.value.muted = muted.value
}

const seek_to = (seconds) => {
  $audio.value.currentTime = seconds
}

const setVolume = (value = null) => {
  $audio.value.volume = value
}

const setProgress = (value = null) => {
  $audio.value.currentTime = value
}

const togglePlayPause = () => {
  if (paused.value) {
    play()
  } else {
    pause()
  }
}

const getSongTitle = (fullname) => {
  const tokens = fullname.split('/')
  const filename = tokens[tokens.length - 1]
  const title = filename.toUpperCase().split('.MP3')[0]
  return title
}

const updateMediaSession = () => {
  const title = decodeURI(getSongTitle(audioFile.value))
  document.title = title
  navigator.mediaSession.metadata = new MediaMetadata({
    title: title,
  })
  navigator.mediaSession.setActionHandler('previoustrack', null)
  navigator.mediaSession.setActionHandler('nexttrack', null)
  navigator.mediaSession.setActionHandler('pause', null)
  navigator.mediaSession.setActionHandler('stop', null)
  navigator.mediaSession.setActionHandler('previoustrack', () => backward())
  navigator.mediaSession.setActionHandler('nexttrack', () => forward())
  navigator.mediaSession.setActionHandler('pause', () => pause())
  navigator.mediaSession.setActionHandler('stop', () => stop())
}

onMounted(() => {
  // sync the progress bar with the actual audio track elapsed time
  setInterval(() => { 
    if ($audio.value) {
      maxProgress.value = $audio.value.duration
      progress.value = $audio.value.currentTime
    }
  }, 500)

  // skip to the next track when the current one ends
  $audio.value.addEventListener('ended', () => {
    forward()
  })

  paused.value = $audio.value.paused
})

watch(audioFile, () => {
  updateMediaSession()
})
</script>

<style scoped>
.controls-container {
  display: flex;
  justify-content: space-evenly;
}

.volume-bar {
  width: 6rem;
}
</style>