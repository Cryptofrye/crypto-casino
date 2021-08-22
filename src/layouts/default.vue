<template>
  <v-app>
    <drawer :drawer.sync="drawer" />
    <appbar :drawer.sync="drawer" />
    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false
    }
  },
  mounted () {
  }
}
</script>
