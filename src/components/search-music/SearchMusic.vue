<template>
  <SearchMusicControls
    @add-selectedsongs="addSelectedsongs"
    @toggle-select-all="toggleSelectAll"
    @show-playlist="$emit('showPlaylist')"
    :can-add="Object.keys(selected).length > 0"
    :can-select="songs.length > 0"
  />
  <div>
    <input
      type="text"
      v-model="query"
      placeholder="Search..."
      class="w100"
    />
  </div>
  <div class="results-container">
    <div
      class="item"
      v-for="song in songs"
      :key="song"
      @click="() => toggleSelectSong(song)"
      :class="{'active': selected[song]}"
    >
      <span class="icon-container">
          <i class="fa-solid fa-music"></i>
      </span>
      <span class="title">
        {{ song }}
      </span>
    </div>
    <EmptyListPlaceholder v-if="songs.length === 0 && !loading">
      <template v-slot>
        <span v-if="query">nothing found</span>
        <span v-else>search your music</span>
      </template>
      <template v-slot:bottom v-if="!query">
        select everything with <i class="fa-solid fa-check-double"></i><br />
        add to playlist with <i class="fa-solid fa-plus"></i><br />
      </template>
    </EmptyListPlaceholder>
  </div>
  <div class="loading-container">
    <LoadingPlaceholder v-if="loading" />
  </div>
</template>

<script setup>
import { onBeforeMount, onBeforeUnmount, ref, watch } from "vue"
import SearchMusicControls from "./SearchMusicControls.vue"
import LoadingPlaceholder from "../shared/LoadingPlaceholder.vue"
import EmptyListPlaceholder from "../shared/EmptyListPlaceholder.vue"

const emit = defineEmits(["addSelectedsongs", "showPlaylist"])

let database = []
let timeout = null
const loading = ref(false)
const songs = ref([])
const selected = ref({})
const query = ref("")

const filterResults = (string) => {
  // clean up the query string
  const query = string
    .latinize()               // assets/latinize.js --> (caféïne >> CAFEINE)
    .replace(/[^\w ]/g, "")   // remove punctuation etc

  // tokenize the result
  const tokens = [
    ...new Set([                       // remove duplicates in an array having
      query,                           // the query query itself in its entire form as first element
      ...query                         // followed by any single word contained in it 
        .split(" ")                    // (resulted by splitting it on spaces)
        .filter((s) => s.length > 2 )  // which is at least 3 characters
      ])
    ]

  // filter results
  return database.map(
    // for every file name in the database
    (song) => {
      // clean up the file name
      const s = song.latinize().replace(/[^\w ]/g, "")

      // calculate a score by checking the presence of every token into the file name 
      let score = 0
      let matchedTokensCount = 0
      tokens.forEach((t, i) => {
        if (s.includes(t)) {
          matchedTokensCount += 1
          const regex = new RegExp(t, "g")
          // if the token is the first one (the entire query) give special score
          score += i == 0 ?
            (s.match(regex) || []).length * 100 :
            (s.match(regex) || []).length
        }
      })
      if (matchedTokensCount >= tokens.length) {
        return { "song": song, "score": score }
      } else {
        // we will filter out non matching results
        return null
      }
    }
  ).filter(
    (s) => s    // remove nulls
  ).sort(
    (a, b) => b.score - a.score
  ).map(
    (obj) => obj.song   // return just the song name
  )
}

const toggleSelectSong = (song) => {
  if (selected.value[song]) {
    delete selected.value[song]
  } else {
    selected.value[song] = true
  }
}

const toggleSelectAll = () => {
  if (Object.keys(selected.value).length > 0) {
    selected.value = {}
  } else {
    songs.value.forEach((s) => {
      selected.value[s] = true
    })
  }
}

const addSelectedsongs = () => {
  const list = Object.keys(selected.value)
  emit("addSelectedsongs", list)
  emit("showPlaylist")
}

const blurActiveElement = () => {
    document.activeElement.blur()
}

onBeforeMount(async () => {
  document.addEventListener("scroll", blurActiveElement)
  database = await (await fetch("/database.json")).json()
})

onBeforeUnmount(() => {
  document.removeEventListener("scroll", blurActiveElement)
})

watch(query, async (text) => {
  if (text.length <= 3) {
    songs.value = []
    return
  }
  loading.value = true
  if (timeout !== null) {
    clearTimeout(timeout)
  }
  timeout = setTimeout(() => {
    songs.value = filterResults(query.value)
    loading.value = false
  }, 2500)
})

</script>

<style scoped>
.loading-container {
  padding: 3rem 0;
  display: flex;
  align-items: center;
  align-content: center;
  flex-direction: column;
}
.results-container {
  display: flex;
  flex-direction: column;
}

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
  overflow: hidden;
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