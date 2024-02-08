<template>
  <div>
    <select name="operator" class="operator" @change="onChange($event)" v-model="selected">
      <option value="" disabled>Bitte wählen</option>
      <option value="and">AND</option>
      <option value="before">BEFORE</option>
      <option value="exactly">EXACTLY</option>
      <option value="max">MAX</option>
      <option value="min">MIN</option>
      <option value="nand">NAND</option>
      <option value="next">NEXT</option>
    </select>
    <input
      v-if="selected == 'min' || selected == 'max' || selected == 'exactly'"
      type="number"
      v-model="n"
      @input="nChanged"
    />
  </div>
</template>

<script>
export default {
  name: 'RuletypeSelect',
  props: {
    preselect: {}
  },
  data() {
    return {
      n: 1,
      selected: this.preselect.type
    }
  },
  methods: {
    onChange(event) {
      var type = {}
      type.n = this.n
      type.type = event.target.value
      this.$emit('setType', type)
    },
    nChanged() {
      var type = {}
      type.n = this.n
      type.type = this.selected
      this.$emit('setType', type)
    }
  },
  watch: {
    preselect(newVal) {
      this.selected = newVal.type
      this.n = newVal.n
    }
  }
}
</script>

<style scoped lang="scss">
.operator {
  border: none;
  border-radius: 4px;
  font-size: 20px;
  margin: 20px;
  outline: none;
}
input {
  width: 40px;
}
</style>
