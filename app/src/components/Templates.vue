<template>
  <div class="templates">
    <div class="editor">
      <h3>create template</h3>
      <Operand class="shadow" :modelValue="template.eventpattern" @operand="setEventpattern" />
      <div class="button-name shadow">
        <BaseInput
          class="name"
          label="Name"
          :modelValue="template.name"
          type="text"
          @input="setName"
        ></BaseInput>
        <button @click="create">Create</button>
      </div>
    </div>
    <div class="list">
      <h3>available templates</h3>
      <EntriesList :entries="templates" :preselect="template.id" @select="setTemplate" />
    </div>
  </div>
</template>

<script>
import BaseInput from '@/components/BaseInput.vue'
import EntriesList from '@/components/EntriesList.vue'
import Operand from '@/components/Operand.vue'

// ...mapState('templates', ['templates', 'template'])
// ...mapActions('templates', ['create', 'setEventpattern', 'setName', 'setTemplate'])
</script>

<style scoped lang="scss">
.templates {
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
