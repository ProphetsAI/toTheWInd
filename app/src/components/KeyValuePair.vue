<template>
  <div class="pair">
    <BaseInput
      label="Key"
      :modelValue="key"
      type="text"
      v-model="key"
      :disabled="disabled"
      @blured="emit"
    ></BaseInput
    ><span>:</span>
    <BaseInput
      label="Value"
      :modelValue="value"
      v-model="value"
      type="text"
      :disabled="disabled"
      @blured="emit"
    ></BaseInput>
  </div>
</template>

<script>
import BaseInput from '@/components/BaseInput.vue'

export default {
  components: {
    BaseInput
  },
  name: 'KeyValuePair',
  props: {
    disabled: Boolean,
    k: String,
    v: [String, Number]
  },
  data() {
    return {
      key: '',
      value: ''
    }
  },
  created() {
    this.updateKey(this.k)
    this.updateValue(this.v)
  },
  watch: {
    k(newKey) {
      this.updateKey(newKey)
    },
    v(newValue) {
      this.updateValue(newValue)
    }
  },
  methods: {
    updateKey(newKey) {
      this.key = newKey
    },
    updateValue(newValue) {
      this.value = newValue
    },
    emit(target) {
      if (this.value && this.key) {
        var obj = {}
        obj[this.key] = this.value
        this.$emit('updated', obj)
        this.key = ''
        this.value = ''
      } else {
        if (this.key && target.placeholder == 'Value') {
          this.$emit('deleted', this.key)
          this.key = ''
          this.value = ''
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.pair {
  display: flex;
  flex-flow: row nowrap;

  .baseInput {
    width: 50%;
  }
  span {
    color: #2c3e50;
    font-size: 0.9em;
  }
}
</style>
