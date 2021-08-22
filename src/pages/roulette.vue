<template>
  <div>
    <div v-if="connected">
      <v-row>
        <v-col>
          <h1>Roulette</h1>
          <v-card>
            <v-card-title>Bet</v-card-title>
            <v-card-text>
              <v-row>
                <v-col>
                  <v-text-field v-model.number="number" label="number" type="number" />
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
      <v-row v-if="bets.length > 0">
        <v-col
            v-for="(bet, index) in bets"
            :key="index"
            cols="12"
            md="3"
        >
          <v-card>
            <v-card-title>
              {{ bet[0] }}
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col>
                  Number: {{ bet[2] }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div>
                    {{ getEtherAmount(bet[1]) }}
                    <v-icon right>fab fa-ethereum</v-icon>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import walletMixins from '../mixins/walletMixins'

export default {
  name: "roulette",
  mixins: [
      walletMixins
  ],
  data () {
    return {
      number: 0,
      amount: 0,
      bets: []
    }
  },
  watch: {
    connected () {
      this.refreshBets()
    }
  },
  mounted () {
    this.$notiflix.Notify.init({
      position: 'right-bottom'
    })
    this.$nuxt.$on('reveal', (data) => {
      this.$notiflix.Notify.success(`Number is ${data.roulette.result}, there is ${data.winners.length} winners`)
    })
    this.$nuxt.$on('new_bet', (data) => {
      this.bets = data.bets
      console.log(this.bets, data.bets)
    })
  },
  created() {
    this.refreshBets()
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
    },
    refreshBets() {
      this.$store.dispatch('eth/rouletteGetBets').then((data) => {
        if (this.connected) {
          this.bets = data
        }
      })
    },
    getEtherAmount(amount) {
      return web3.utils.fromWei(amount)
    }
  }
}
</script>

<style scoped>

</style>
