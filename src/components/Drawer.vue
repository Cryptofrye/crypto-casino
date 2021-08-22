<template>
  <v-navigation-drawer
      v-model="_drawer"
      app
      clipped
      fixed
  >
    <v-list>
      <v-list-item
          v-for="({icon, text, url}, i) in items"
          :key="i"
          nuxt
          :to="url"
      >
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "Drawer",
  props: {
    drawer: {
      type: Boolean,
      required: true
    },
  },
  computed: {
    _drawer: {
      get () {
        return this.drawer
      },
      set(value) {
        this.$emit('update:drawer', value)
      }
    }
  },
  data () {
    return {
      items: [
        {
          icon: 'fa-home',
          text: 'Storage',
          url: '/'
        },
        {
          icon: 'fa-dice',
          text: 'Roulette',
          url: '/roulette'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
