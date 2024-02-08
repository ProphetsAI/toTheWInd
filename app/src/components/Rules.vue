<template>
  <div class="rules">
    <div v-if="templates.length > 0" class="editor">
      <h3>create rule</h3>
      <div class="shadow rule">
        <ul class="tabs">
          <li>
            <a @click.prevent="setActive('if')" :class="{ active: isActive('if') }" href="#if"
              >IF</a
            >
          </li>
          <li>
            <a @click.prevent="setActive('then')" :class="{ active: isActive('then') }" href="#then"
              >THEN</a
            >
          </li>
        </ul>
        <div class="tab" :class="{ show: isActive('if') }">
          <EntriesList :preselect="rule.atid" :entries="templates" @select="setOperandA" />
          <RuletypeSelect :preselect="rule.type" @setType="setType"></RuletypeSelect>
          <EntriesList :preselect="rule.btid" :entries="templates" @select="setOperandB" />
        </div>
        <div class="tab" :class="{ show: isActive('then') }">
          <div class="template-list">
            <h3>Satisfied event</h3>
            <EntriesList :preselect="rule.stid" :entries="templates" @select="setSatisfiedEvent" />
          </div>
          <div class="template-list">
            <h3>Violated event</h3>
            <EntriesList :preselect="rule.vtid" :entries="templates" @select="setViolatedEvent" />
          </div>
        </div>
      </div>

      <div class="button-name shadow">
        <BaseInput
          class="name"
          label="Name"
          type="text"
          :modelValue="rule.name"
          @input="setName"
        ></BaseInput>
        <button class="shadow" @click="create">Create</button>
      </div>
    </div>
    <div v-else class="editor">
      <h3>create rule</h3>
      <p>Bitte modellieren Sie zuerst ein Fachereignis.</p>
    </div>
    <div class="list">
      <h3>available rules</h3>
      <EntriesList :entries="rules" :preselect="rule.id" @select="setRule" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import BaseInput from '@/components/BaseInput.vue'
import EntriesList from '@/components/EntriesList.vue'
import RuletypeSelect from '@/components/RuletypeSelect.vue'

const activeItem = ref('if')

function isActive(menuItem) {
  return activeItem === menuItem
}
function setActive(menuItem) {
  activeItem = menuItem
}
// ...mapActions('rules', [
//   'create',
//   'setRule',
//   'setName',
//   'setType',
//   'setOperandA',
//   'setOperandB',
//   'setSatisfiedEvent',
//   'setViolatedEvent'
// ])
</script>

Du bist unorganisiert! Rückfragetechnik: Wie meinen Sie das? Definitionsfrage: Was bedeutet das für
dich? Dein Bauch wird wieder größer! Das ist ein Zeichen für Wohlstand. Ist deine Frau nicht
überfordert?

<style scoped lang="scss">
.rules {
  display: grid;
  grid-template-areas: 'editor list';
  grid-template-columns: 66% 34%;
  width: 100%;

  h3 {
    font-weight: normal;
    opacity: 0.4;
  }

  .editor {
    align-items: center;
    display: flex;
    flex-flow: column nowrap;
    grid-area: editor;
    padding: 4px;

    .rule {
      border-radius: 12px;
      margin: 10px;
      width: 100%;
    }
    .tabs {
      border-bottom: 4px double #2c3e50;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-evenly;
      margin-top: 0;

      li {
        flex-basis: 100%;

        &:first-child {
          a {
            border-bottom: 20px solid transparent;
            border-top: 20px solid transparent;
            border-top-left-radius: 12px;

            &.active {
              border-bottom: 20px solid #42b893;
              border-top: 20px solid #42b893;
            }
          }
        }
        &:last-child {
          a {
            border-bottom: 20px solid transparent;
            border-left: 20px solid #42b893;
            border-top: 20px solid transparent;
            border-top-right-radius: 12px;

            &.active {
              border-bottom: 20px solid #42b893;
              border-left: 20px solid transparent;
              border-top: 20px solid #42b893;
            }
          }
        }
        a {
          color: #2c3e50;
          display: inline-block;
          font-weight: bold;
          line-height: 0;
          text-decoration: none;
          text-shadow: 2px 2px whitesmoke;
          width: 100%;

          &.active {
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

    .button-name {
      align-self: normal;
      border-radius: 12px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
    }
  }
  .list {
    grid-area: list;
    padding: 4px;
  }

  button {
    background-color: #42b983;
    border: none;
    border-bottom-right-radius: 12px;
    border-top-right-radius: 12px;
    color: whitesmoke;
    cursor: pointer;
    font-size: medium;
    font-weight: bold;
    opacity: 0.5;
    padding: 16px;

    &:hover,
    &:focus {
      color: white;
      opacity: 1;
    }
    &:focus {
      outline: none;
    }
  }
}
</style>
