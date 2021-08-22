// import web3Abi from 'web3-eth-abi'

// const tokenAddress = '0x345ca3e014aaf5dca488057592ee47305d9b3e10' // insert deployed EIP20 token address here
// const eip20 = new web3.eth.Contract(EIP20.abi, tokenAddress)
import SimpleStorage from '../../build/contracts/SimpleStorage'
import CryptoRoulette from '../../build/contracts/CryptoRoulette'
import Web3 from 'web3'
import roulette from '../pages/roulette'

let simpleStorage;
let cryptoRoulette;

export const state = () => ({
  connected: false,
  account: null,
  ethBalance: null,
})

export const mutations = {
  setConnected(state, value) {
    state.connected = value
  },
  setAccount(state, value) {
    state.account = value
  },
  setEthBalance(state, value) {
    state.ethBalance = web3.utils.fromWei(value, 'ether')
  }
}

export const actions = {
  async connect ({ commit }) {
    if (process.browser) {
      if (window.ethereum) {
        // Use Mist/MetaMask's provider
        // window.ethereum
        // const web3js = new Web3('http://localhost:9545');
        await window.ethereum.send('eth_requestAccounts')
        window.web3 = new Web3(window.ethereum)
        const accounts = await web3.eth.getAccounts()
        commit('setAccount', accounts[0])
        const balance = await web3.eth.getBalance(accounts[0])
        commit('setEthBalance', balance)
        commit('setConnected', true)

        registerSimpleStorage()
        registerCryptoRoulette()

        window.ethereum.on('accountsChanged', (accounts) => {
          // user disconnected is account
          if (typeof accounts[0] === 'undefined') {
            commit('setConnected', false)
          }
          commit('setAccount', accounts[0])
          web3.eth.getBalance(accounts[0]).then((balance) => {
            commit('setEthBalance', balance)
          })
        })

      } else {
        commit('setConnected', false)
      }
    }
  },
  simpleStorageSet({ state }, value) {
    if (typeof simpleStorage !== 'undefined') {
      simpleStorage.methods.set(value).send({from: state.account})
    }
  },
  simpleStorageGet() {
    if (typeof simpleStorage !== 'undefined') {
      return simpleStorage.methods.get().call()
    }
  },
  rouletteBet({ state }, payload) {
    return new Promise((resolve, reject) => {
      if (typeof cryptoRoulette !== 'undefined') {
        cryptoRoulette.methods.bet(payload.number)
            .send( { from: state.account, value: web3.utils.toWei(payload.amount, "ether") })
            .on('receipt', () => {
              resolve('You made a bet')
            })
            .on('error', (error) => {
              reject(error)
            })
      }
    })
  },
  endRoulette({ state }) {
    if (typeof cryptoRoulette !== 'undefined') {
      return cryptoRoulette.methods.end().send( { from : state.account })
    }
  }
}

export const getters = {}

function registerSimpleStorage() {
  simpleStorage = new web3.eth.Contract(SimpleStorage.abi, process.env.SIMPLE_STORAGE_CONTRACT_ADDRESS)
}

function registerCryptoRoulette() {
  cryptoRoulette = new web3.eth.Contract(CryptoRoulette.abi, process.env.CRYPTO_ROULETTE_CONTRACT_ADDRESS)

  cryptoRoulette.events.Reveal((error, results) => {
    $nuxt.$emit('reveal', results.returnValues);
  })
}
