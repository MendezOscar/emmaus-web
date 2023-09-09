<template>
  <v-col class="text-center">
    <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">
    <v-container>
      <v-row style="justify-content: center;">
        <v-col cols="12" sm="12">
          <template>
            <v-card>
              <v-card-title>
                Lecciones
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                  hide-details></v-text-field>

                <v-col cols="auto ml-5">
                  <v-btn prepend-icon="mdi-plus" size="x-large" @click="add()">
                    <v-icon left>
                      mdi-plus
                    </v-icon>Agregar
                    lecciones</v-btn>
                </v-col>
                <v-file-input id="fileData" label="Agregar desde archivo" @change="uploadFromFile()"></v-file-input>
                <v-btn class="ml-3" prepend-icon="mdi-plus" size="x-large" @click="saveFromFile()">
                  <v-icon left>
                    mdi-plus
                  </v-icon>Procesar Archivo</v-btn>

              </v-card-title>
              <v-data-table :headers="headers" :items="lessons" :search="search">
                <template v-slot:item.actions="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="editItem(item)">
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>Editar leccion</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>
                    </template>
                    <span>Eliminar leccion</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-card>
            <v-dialog v-model="dialogDelete" max-width="600px">
              <v-card>
                <v-card-title class="text-h5">¿Estas seguro de eliminar este leccion?</v-card-title>
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
                  <span class="text-h5">Leccion</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="12">
                          <v-combobox v-model="course" :items="courses"
                            label="Seleccione el nivel / modulo / curso de la leccion"></v-combobox>
                        </v-col>
                      </v-row>
                    </v-container>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field label="Codigo de la leccion" v-model="id" required></v-text-field>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field label="Secuencia dentro del leccion" v-model="sequence" required></v-text-field>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field label="Nombre del leccion" v-model="name" required></v-text-field>
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
    this.Courses();
    this.getLessons();
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
        value: 'lesson',
      },
      { text: 'Id', value: 'id' },
      { text: 'Secuencia', value: 'sequence' },
      { text: 'Id curso', value: 'courseId' },
      { text: 'Nombre Curso', value: 'courseName' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],

    name: "",
    id: "",
    courses: [],
    lessons: [],
    sequence: '',

    modal: false,
    modules: [],
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
          await setDoc(doc(db, "lessons", item[0]), {
            id: item[0],
            lesson: item[1],
            sequence: item[2],
            courseId: item[3],
            courseName: item[4]
          });
        });
        this.getLessons();
      }
    },
    async Courses() {
      this.courses = [];
      const querySnapshot = await getDocs(collection(db, "courses"));
      querySnapshot.forEach((doc) => {
        this.courses.push(doc.data().id);
      });
    },

    async getLessons() {
      this.lessons = [];
      const querySnapshot = await getDocs(collection(db, "lessons"));
      querySnapshot.forEach((doc) => {
        this.lessons.push(doc.data());
      });
    },
    deleteItem(item) {
      this.course = item;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await deleteDoc(doc(db, "lessons", this.course.id));
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
      this.name = item.lesson;
      this.module = item.courseId;
      this.sequence = item.sequence
    },

    add() {
      this.dialog = true;
    },

    async save() {
      if (this.saveMode) {
        await setDoc(doc(db, "lessons", this.id), {
          id: this.id,
          lesson: this.name,
          sequence: this.sequence,
          courseId: this.course,
        });
      } else {
        const docRef = doc(db, "lessons", this.id);
        await updateDoc(docRef, {
          lesson: this.name,
          sequence: this.sequence,
          courseId: this.course,
        });
      }
      this.getLessons();
      this.dialog = false
    }
  }
}
</script>
