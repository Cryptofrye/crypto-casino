<template>
  <v-row>
    <v-col>
      <h1>Roulette</h1>
      <v-card>
        <v-card-title>Bet</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field v-model="number" label="number" />
            </v-col>
            <v-col>
              <v-text-field v-model="amount" label="amount" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="end" color="secondary" outlined>
            End
          </v-btn>
          <v-btn @click="bet" color="primary">
            Bet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "roulette",
  data () {
    return {
      number: '',
      amount: ''
    }
  },
  mounted () {
    this.$notiflix.Notify.init({
      position: 'right-bottom'
    })
    this.$nuxt.$on('reveal', (data) => {
      this.$notiflix.Notify.success(`Number is ${data.roulette.result}, there is ${data.winners.length} winners`)
      console.log(data)
    })
  },
  methods: {
    bet () {
      this.$store.dispatch('eth/rouletteBet', {
        amount: this.amount,
        number: this.number
      }).then((response) => {
        this.$notiflix.Notify.success(response)
      }).catch((e) => {
        console.log(e)
        this.$notiflix.Notify.failure(e.message)
      })
    },
    end () {
      this.$store.dispatch('eth/endRoulette')
    }
  }
}
</script>

<style scoped>

</style>
