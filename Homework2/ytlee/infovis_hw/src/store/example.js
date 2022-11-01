import {defineStore} from 'pinia'
import axios from "axios"

const config = {headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }}


  export const useExampleMap = defineStore('example', {
    state: () => ({
        isDataReady: false,
        errorMessage: "",
        content: "Hi, I have recieved data from the pinia store."
    }),
    getters: {
        getContent(){
            return this.content;
        }
    },
    actions:{
        /* This requires an existing API (Flask etc) to exist */
        async fetchExampleData(){
            this.isDataReady = false;
            try {
                const data = await axios.get('http://<someserver>/endpoint', config)
                this.recievedData = data;
                this.isDataReady = true;
            }
            catch(error){
                throw error.message
            }
        }
    }
  })