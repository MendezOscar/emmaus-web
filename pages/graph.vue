<template>
  <v-col class="text-center">
    <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">
    <v-container>
      <v-row style="justify-content: center;">
        <v-col cols="12" sm="12">
          <template>
            <v-card>
              <v-card-title>
                Graficas
                <v-spacer></v-spacer>
              </v-card-title>
            </v-card>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </v-col>
</template>

<script>
import { db } from "~/plugins/firebase.js";
import { collection, getDocs } from "firebase/firestore";


export default {
  mounted() {
    this.getSectionStudents();
  },
  data: () => ({
    saveMode: true,
    dialog: false,
    dialogDelete: false,
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    datasets: [
      {
        label: 'Data One',
        backgroundColor: '#f87979',
        data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
      }
    ],
    sectionDetails: []
  }),
  methods: {
    async getSectionStudents() {
      this.sectionDetails = [];
      const querySnapshot = await getDocs(collection(db, "section-student"));
      querySnapshot.forEach((doc) => {
        this.sectionDetails.push(doc.data());
      });
    },
    close() {
      this.dialog = false
    },
  }
}
</script>
