<template>
  <div class="operand">
    <ul>
      <li v-for="(value, key, index) in params" :key="index">
        <KeyValuePair :k="key" :v="value" disabled />
      </li>
      <li>
        <KeyValuePair ref="editor" @updated="update" @deleted="deleteKey" />
      </li>
    </ul>
  </div>
</template>

<script>
import KeyValuePair from '@/components/KeyValuePair.vue'

export default {
  name: 'Operand',
  components: {
    KeyValuePair
  },
  data() {
    return {
      params: {}
    }
  },
  props: {
    modelValue: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  created() {
    this.params = this.modelValue
  },
  updated() {
    this.focusEditor()
  },
  methods: {
    updateValue(newValue) {
      this.params = newValue
    },
    focusEditor() {
      this.$refs.editor.$el.querySelector("input[placeholder='Key']").focus()
    },
    update(keyValuePair) {
      var _vm = this
      Object.keys(keyValuePair).forEach((key) => {
        _vm.$set(_vm.params, key, keyValuePair[key])
      }) // there should be only one key
      _vm.$emit('operand', JSON.parse(JSON.stringify(_vm.params)))
      _vm.focusEditor()
    },
    deleteKey(key) {
      var _vm = this
      _vm.$delete(_vm.params, key)
      _vm.$emit('operand', JSON.parse(JSON.stringify(_vm.params)))
      _vm.focusEditor()
    }
  },
  watch: {
    modelValue: function (newValue) {
      this.updateValue(newValue)
    }
  }
}
</script>

<style scoped lang="scss">
.operand {
  border-radius: 12px;
  margin: 10px;
  width: 100%;
}

* {
  font-size: 1.2em;
}

*::before,
*::after {
  color: #2c3e50;
}

ul {
  display: flex;
  flex-flow: column nowrap;

  li {
    &:first-child {
      .pair::before {
        visibility: visible;
      }
    }

    .pair {
      &::before {
        content: '{';
        visibility: hidden;
      }

      &::after {
        content: ',';
      }
    }

    &:last-child {
      .pair::after {
        content: '}';
      }
    }
  }
}
</style>
