<template>
  <ul v-if="entries.length > 0">
    <li
      v-for="entry in entries"
      :key="entry.id"
      :class="{ selected: selected == entry.id }"
      @click="select(entry)"
    >
      <p>{{ entry.name }}</p>
    </li>
  </ul>
  <span v-else> Nichts vorhanden. </span>
</template>

<script>
export default {
  name: 'EntriesList',
  props: {
    entries: Array,
    preselect: Number
  },
  data() {
    return {
      selected: this.preselect
    }
  },
  methods: {
    select(entry) {
      if (this.selected == entry.id) {
        this.selected = undefined
        this.$emit('select', null)
      } else {
        this.selected = entry.id
        this.$emit('select', entry)
      }
    }
  },
  watch: {
    preselect(newVal) {
      this.selected = newVal
    }
  }
}
</script>

<style scoped lang="scss">
ul {
  display: flex;
  flex-flow: column nowrap;
  margin: 10px;

  li {
    box-shadow: 0 0 4px #2c3e50;
    border-radius: 12px;
    color: #2c3e50;
    cursor: pointer;
    height: auto;
    margin-bottom: 10px;

    &:hover {
      background-color: #42b983;
      color: whitesmoke;
    }

    &.selected {
      background-color: #42b983;
      color: whitesmoke;
      box-shadow: 0px 0px 16px #42b983;
    }

    p {
      margin: 2px;
    }
  }
}
span {
  margin: 10px;
}
</style>
