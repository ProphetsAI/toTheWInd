<template>
  <div id="plan">
    <ul class="tabs shadow">
      <li>
        <a
          @click.prevent="setActive('templates')"
          :class="{ active: isActive('templates') }"
          href="#templates"
          >Templates</a
        >
      </li>
      <li>
        <a @click.prevent="setActive('rules')" :class="{ active: isActive('rules') }" href="#rules"
          >Rules</a
        >
      </li>
    </ul>
    <div class="tab" :class="{ show: isActive('templates') }">
      <Templates></Templates>
    </div>
    <div class="tab" :class="{ show: isActive('rules') }">
      <Rules></Rules>
    </div>
    <div class="tab" :class="{ show: isActive('') }">
      Zum Planen bitte zuerst Fachereignisse unter Templates und dann Regeln unter Rules erstellen.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import Rules from '@/components/Rules.vue'
import Templates from '@/components/Templates.vue'

const activeItem = ref('')

function isActive(menuItem) {
  return activeItem === menuItem
}
function setActive(menuItem) {
  activeItem = menuItem
}
</script>

<style scoped lang="scss">
#plan {
  border: 4px double #2c3e50;
  border-radius: 0 0 6px 6px;
  border-top: none;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;

  .tabs {
    border-bottom: 4px double #2c3e50;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    margin-top: 0;

    li {
      flex-basis: 100%;

      a {
        color: #2c3e50;
        display: inline-block;
        font-weight: bold;
        padding: 6px;
        text-decoration: none;
        text-shadow: 2px 2px whitesmoke;
        width: 100%;

        &.active {
          background-color: #42b983;
          color: whitesmoke;
          text-shadow: 2px 2px grey;
        }
      }
    }
  }

  .tab {
    display: none;
    padding: 4px;

    &.show {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-evenly;
    }
  }
}
</style>
