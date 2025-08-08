<template>
  <v-col class="text-center">
    <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">
    <v-container>
      <v-row style="justify-content: center;">
        <v-col cols="12" sm="12">
          <template>
            <v-card>
              <v-card-title>
                Reporte de estudiantes
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                  hide-details></v-text-field>

              </v-card-title>
              <v-data-table :headers="headers" :items="sectionDetails" :search="search">
                <template v-slot:item.actions="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="editItem(item)">
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>Editar modulo</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>
                    </template>
                    <span>Eliminar modulo</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-card>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </v-col>
</template>

<script>
import { db } from "~/plugins/firebase.js";
import { collection, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";

export default {
  mounted() {
    this.getSectionStudents();
  },
  data: () => ({
    saveMode: true,
    dialog: false,
    dialogDelete: false,
    search: '',
    headers: [
      {
        text: 'Nombre',
        align: 'start',
        value: 'nameStudent',
      },
      { text: 'Seccion', value: 'id' },
      { text: 'Curso', value: 'courseName' },
      { text: 'Asamblea', value: 'churchName' },
      { text: 'Departamento', value: 'department' },
      { text: 'Año', value: 'year' },
      { text: 'Mes', value: 'month' },
      { text: 'Estado', value: 'status' },
      { text: 'Nota', value: 'calification' },
    ],
    dataFromFile: [],
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
