<template>
  <v-col class="text-center">
    <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">
    <v-container>
      <v-row style="justify-content: center;">
        <v-col cols="12" sm="12">
          <template>
            <v-card>
              <v-card-title>
                Cursos
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                  hide-details></v-text-field>

                <v-col cols="auto ml-5">
                  <v-btn prepend-icon="mdi-plus" size="x-large" @click="add()">
                    <v-icon left>
                      mdi-plus
                    </v-icon>Agregar
                    curso</v-btn>
                  <v-btn prepend-icon="mdi-plus" size="x-large" @click="getAll()">
                    <v-icon left>
                      mdi-eye
                    </v-icon>Ver todos</v-btn>
                </v-col>
                <v-file-input id="fileData" label="Agregar desde archivo" @change="uploadFromFile()"></v-file-input>
                <v-btn class="ml-3" prepend-icon="mdi-plus" size="x-large" @click="saveFromFile()">
                  <v-icon left>
                    mdi-plus
                  </v-icon>Procesar Archivo</v-btn>

              </v-card-title>
              <v-data-table :headers="headers" :items="courses" :search="search" show-expand>
                <template v-slot:item.actions="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="editItem(item)">
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>Editar curso</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>
                    </template>
                    <span>Eliminar curso</span>
                  </v-tooltip>
                </template>
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length" class="justify-description">
                    Descripcion del curso : {{ item.description }}
                  </td>
                </template>
              </v-data-table>
            </v-card>
            <v-dialog v-model="dialogDelete" max-width="600px">
              <v-card>
                <v-card-title class="text-h5">¿Estas seguro de eliminar este curso?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialog" max-width="1500px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Curso</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="6" md="4">
                        <v-combobox v-model="level" :items="levelsName" @change="onChangeModules()"
                          label="Seleccione el nivel del curso"></v-combobox>
                      </v-col>

                      <v-col cols="6" md="4">
                        <v-combobox v-model="module" :items="modulesNames"
                          label="Seleccione el modulo del curso"></v-combobox>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field label="Identificador del curso" v-model="code" required></v-text-field>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field label="Codigo del curso" v-model="id" required></v-text-field>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field label="Secuencia dentro del modulo" v-model="sequence" required></v-text-field>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field label="Nombre del curso" v-model="name" required></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-textarea v-model="description" counter label="Description del curso" maxlength="900"
                        single-line></v-textarea>
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
  },
  data: () => ({
    saveMode: true,
    dialog: false,
    dialogDelete: false,
    search: '',
    course: '',
    code: '',
    headers: [
      {
        text: 'Nombre',
        align: 'start',
        sortable: false,
        value: 'course',
      },
      { text: 'Id curso', value: 'id' },
      { text: 'Modulo', value: 'moduleId' },
      { text: 'Nombre modulo', value: 'moduleName' },
      { text: 'Nivel', value: 'levelId' },
      { text: 'Nombre nivel', value: 'levelName' },
      { text: 'Secuencia', value: 'sequence' },
      { text: 'Descripcion', value: 'data-table-expand' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    description: '',
    name: "",
    module: "",
    id: "",
    level: '',
    courses: [],
    sequence: '',
    levels: [],
    levelsName: [],
    modal: false,
    modules: [],
    modulesNames: [],
    dataFromFile: []
  }),
  methods: {
    getAll() {
      this.Courses();
    },
    uploadFromFile() {
      const input = document.getElementById("fileData");
      readXlsxFile(input.files[0]).then((rows) => {
        rows.forEach((item) => this.dataFromFile.push(item));
      });
    },
    async saveFromFile() {
      if (this.dataFromFile.size != 0) {
        this.dataFromFile.forEach(async (item) => {
          await setDoc(doc(db, "courses", item[0]), {
            id: item[0],
            course: item[1],
            sequence: item[2],
            imagePath: item[3],
            moduleId: item[4],
            levelId: item[5],
            description: item[6],
            moduleName: item[7],
            levelName: item[8]
          });
        });
        this.Courses();
      }
    },
    async Courses() {
      this.courses = [];
      const querySnapshot = await getDocs(collection(db, "courses"));
      querySnapshot.forEach((doc) => {
        this.courses.push(doc.data());
      });
    },
    async onChangeModules() {
      this.modulesNames = [];
      this.modules.forEach((item) => {
        if (item.levelId == this.level) {
          this.modulesNames.push(item.id);
        }
      });
    },
    async getLeves() {
      const querySnapshot = await getDocs(collection(db, "levels"));
      querySnapshot.forEach((doc) => {
        this.levels.push(doc.data());
        this.levelsName.push(doc.data().id);
      });
    },
    async getModules() {
      const querySnapshot = await getDocs(collection(db, "modules"));
      querySnapshot.forEach((doc) => {
        this.modules.push(doc.data());
        this.modulesNames.push(doc.data().id);
      });
    },
    deleteItem(item) {
      this.course = item;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await deleteDoc(doc(db, "courses", this.course.id));
      this.closeDelete();
    },

    close() {
      this.dialog = false
    },

    closeDelete() {
      this.dialogDelete = false;
      this.Courses();
    },

    editItem(item) {
      this.dialog = true;
      this.saveMode = false;
      this.course = item.name;
      this.moduleId = item.module;
      this.levelId = item.level
      this.sequence = item.sequence
      this.description = item.description
    },

    add() {
      this.getLeves();
      this.getModules();
      this.dialog = true;
    },

    async save() {
      if (this.id === '' || this.name === '' || this.module === '' || this.level === '' || this.sequence === '' || this.description === '') {
        alert("Por favor, complete todos los campos.");
        return;
      }
      if (this.saveMode) {
        await setDoc(doc(db, "courses", this.id), {
          course: this.name,
          moduleId: this.module,
          levelId: this.level,
          sequence: this.sequence,
          description: this.description
        });
      } else {
        const docRef = doc(db, "courses", this.id);
        await updateDoc(docRef, {
          course: this.name,
          moduleId: moduleName,
          levelId: levelName,
          sequence: this.sequence,
          description: this.description
        });
      }
      this.Courses();
      this.dialog = false
    }
  }
}
</script>

<style>
.justify-description {
  text-align: justify;
}
</style>
