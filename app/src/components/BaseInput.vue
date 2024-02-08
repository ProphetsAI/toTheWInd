<template>
  <div class="baseInput">
    <label>
      {{ label }}
    </label>
    <input
      v-bind="$attrs"
      :placeholder="label"
      :value="modelValue"
      :class="{ focused: isFocused }"
      @focus="setFocus()"
      @blur="$emit('blured', $event.target)"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  data() {
    return {
      isFocused: false
    }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  methods: {
    setFocus() {
      this.isFocused = true
    }
  }
}
</script>

<style scoped lang="scss">
.baseInput {
  display: flex;
  color: #2c3e50;
  flex-flow: row nowrap;
  border-radius: 12px;
  flex-basis: 100%;

  &::after {
    color: #2c3e50;
  }
  &:last-child::after {
    content: none;
  }

  label {
    align-self: center;
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    padding: 2px 22px;
    white-space: nowrap;

    &:after {
      content: ':';
    }
  }

  input {
    background-color: transparent;
    border: none;
    color: #2c3e50;
    padding: 0 12px;
    font-size: 20px;
    width: 100%;

    &:focus {
      background-color: rgba(122, 122, 122, 0.3);
      border-radius: 12px;
      color: black;
      outline: none;
    }
    &::placeholder {
      color: lightslategrey;
    }
  }
}

.pair .baseInput {
  border: none;

  label {
    display: none;
  }
}
</style>
