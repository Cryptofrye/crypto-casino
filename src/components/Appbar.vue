<template>
  <v-app-bar
      app
      clipped-left
      fixed
  >
    <v-app-bar-nav-icon @click="_drawer = !_drawer"></v-app-bar-nav-icon>
    <v-toolbar-title>My Dapp</v-toolbar-title>
    <v-spacer />
    <v-btn v-if="!connected" rounded outlined @click="connect">
      Connect
      <v-icon right>
        fa-wallet
      </v-icon>
    </v-btn>
    <div v-else>
      <v-row align="center" no-gutters>
        <v-col>
          <v-chip
              class="ma-2"
              color="secondary"
              outlined
          >
            <v-icon left>
              fab fa-ethereum
            </v-icon>
            {{ ethBalance }} ETH
          </v-chip>
        </v-col>
        <v-col>
          <v-btn rounded color="primary">
            <div class="mr-2">
              {{ trimmedAccount }}
            </div>
            <status-indicator status="positive" pulse />
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-app-bar>
</template>

<script>
import walletMixins from '../mixins/walletMixins'
import { StatusIndicator } from 'vue-status-indicator'

export default {
  name: 'Appbar',
  mixins: [walletMixins],
  props: {
    drawer: {
      type: Boolean,
      required: true
    }
  },
  components: {
    StatusIndicator
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
  methods: {
    connect () {
      this.$store.dispatch('eth/connect')
    }
  }
}

</script>
