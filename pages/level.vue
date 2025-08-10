<template>
  <v-col class="text-center">
    <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">
    <v-container>
      <v-row style="justify-content: center;">
        <v-col cols="12" sm="12">
          <template>
            <v-card>
              <v-card-title>
                Niveles
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                  hide-details></v-text-field>

                <v-col cols="auto ml-5">
                  <v-btn prepend-icon="mdi-plus" size="x-large" @click="add()">
                    <v-icon left>
                      mdi-plus
                    </v-icon>Agregar
                    nivel</v-btn>
                </v-col>
                <v-file-input id="fileData" label="Agregar desde archivo" @change="uploadFromFile()"></v-file-input>
                <v-btn class="ml-3" prepend-icon="mdi-plus" size="x-large" @click="saveFromFile()">
                  <v-icon left>
                    mdi-plus
                  </v-icon>Procesar Archivo</v-btn>

              </v-card-title>
              <v-data-table :headers="headers" :items="levels" :search="search">
                <template v-slot:item.actions="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="editItem(item)">
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>Editar nivel</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>
                    </template>
                    <span>Eliminar nivel</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-card>
            <v-dialog v-model="dialogDelete" max-width="800px">
              <v-card>
                <v-card-title class="text-h5">¿Estas seguro de eliminar este nivel?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialog" max-width="800px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Nivel</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field label="Id del nivel" v-model="levelId" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field label="Nombre del nivel" v-model="levelName" required></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </v-col>
</template>

<script>
import { db } from "~/plugins/firebase.js";
import readXlsxFile from "read-excel-file";
import { collection, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";

export default {
  mounted() {
    this.getLeves();
  },
  data: () => ({
    saveMode: true,
    dialog: false,
    dialogDelete: false,
    search: '',
    levelId: '',
    levelName: '',
    level: '',
    levels: [],
    headers: [
      {
        text: 'Nombre',
        align: 'start',
        sortable: false,
        value: 'level',
      },
      { text: 'Id', value: 'id' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    dataFromFile: []
  }),
  methods: {
    uploadFromFile() {
      const input = document.getElementById("fileData");
      readXlsxFile(input.files[0]).then((rows) => {
        rows.forEach((item) => this.dataFromFile.push(item));
      });
    },
    async saveFromFile() {
      if (this.dataFromFile.size != 0) {
        this.dataFromFile.forEach(async (item) => {
          await setDoc(doc(db, "levels", item[0]), {
            level: item[1],
            id: item[0],
          });
        });
        this.getLeves();
      }
    },
    async getLeves() {
      this.levels = [];
      const querySnapshot = await getDocs(collection(db, "levels"));
      querySnapshot.forEach((doc) => {
        this.levels.push(doc.data());
      });
    },
    deleteItem(item) {
      this.level = item;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await deleteDoc(doc(db, "levels", this.level.id));
      this.closeDelete();
    },

    close() {
      this.dialog = false
    },

    closeDelete() {
      this.dialogDelete = false;
      this.getLeves();
    },

    editItem(item) {
      this.dialog = true;
      this.level = item.level;
    },

    add() {
      this.dialog = true;
    },

    async save() {
      if (this.levelId === '' || this.levelName === '') {
        alert("Por favor, complete todos los campos.");
        return;
      }
      if (this.saveMode) {
        await setDoc(doc(db, "levels", this.levelId), {
          level: this.levelName,
          id: this.levelId,
        });
      } else {
        const docRef = doc(db, "levels", this.levelId);
        await updateDoc(docRef, {
          level: this.levelName,
        });
      }
      this.getLeves();
      this.dialog = false
    }
  }
}
</script>
