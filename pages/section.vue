<template>
  <v-col class="text-center">
    <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">
    <v-container>
      <v-row style="justify-content: center;">
        <v-col cols="12" sm="12">
          <template>
            <v-card>
              <v-card-title>
                Secciones
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                  hide-details></v-text-field>

                <v-col cols="auto ml-5">
                  <v-btn prepend-icon="mdi-plus" size="x-large" @click="add()">
                    <v-icon left>
                      mdi-plus
                    </v-icon>Agregar
                    Seccion</v-btn>
                </v-col>

              </v-card-title>
              <v-data-table :headers="headers" :items="sections" :search="search">
                <template v-slot:item.actions="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="editItem(item)">
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>Editar seccion</span>
                  </v-tooltip>

                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>
                    </template>
                    <span>Delete seccion</span>
                  </v-tooltip>

                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="closeSection(item)">
                        mdi-close
                      </v-icon>
                    </template>
                    <span>Cerrar seccion</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-card>
            <v-dialog v-model="dialogDelete" max-width="600px">
              <v-card>
                <v-card-title class="text-h5">¿Estas seguro de eliminar este seccion?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogClose" max-width="600px">
              <v-card>
                <v-card-title class="text-h5">¿Estas seguro de cerrar esta seccion?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeSectionClose">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="closeItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialog" max-width="1300px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Seccion</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="6" md="4">
                        <v-combobox v-model="courseId" :items="coursesName" @change="onChangeCourseId"
                          label="Seleccione el ID del curso"></v-combobox>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field label="Nombre de la seccion" v-model="name" required></v-text-field>
                      </v-col>
                      <v-col cols="6" md="4">
                        <v-combobox v-model="revisorName" :items="revisorsName" label="Asignar revisor"></v-combobox>
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
import { collection, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";

export default {
  mounted() {
    this.Courses();
    this.Section();
    this.getRevisors();
  },
  data: () => ({
    saveMode: true,
    dialog: false,
    dialogDelete: false,
    dialogClose: false,
    search: '',
    course: '',
    headers: [
      {
        text: 'Nombre',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'Curso', value: 'courseId' },
      { text: 'Estado', value: 'status' },
      { text: 'Revisor', value: 'revisorName' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    id: "",
    name: "",
    courseName: "",
    courseId: "",
    courses: [],
    coursesName: [],
    revisorName: '',
    status: 'En curso',
    sections: [],
    revisorsName: [],
    revisors: [],
    section: "",
    level: '',
    module: '',
    sectionId: '',
    modal: false,
    sectionStudents: [],
    sectionToDelete: []
  }),
  methods: {
    async getRevisors() {
      const querySnapshot = await getDocs(collection(db, "revisors"));
      querySnapshot.forEach((doc) => {
        this.revisors.push(doc.data());
        this.revisorsName.push(doc.data().name);
      });
    },
    async Courses() {
      this.courses = [];
      this.coursesName = [];
      const querySnapshot = await getDocs(collection(db, "courses"));
      querySnapshot.forEach((doc) => {
        this.courses.push(doc.data());
        this.coursesName.push(doc.data().id + '-' + doc.data().course);
      });
    },
    async Section() {
      this.sections = [];
      const querySnapshot = await getDocs(collection(db, "sections"));
      querySnapshot.forEach((doc) => {
        this.sections.push(doc.data());
      });
    },

    closeSection(item) {
      this.section = item;
      this.dialogClose = true;
    },

    deleteItem(item) {
      this.section = item;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await deleteDoc(doc(db, "sections", this.section.id));
      await this.deleteSectionStudent(this.section.id);
      this.closeDelete();
    },

    async deleteSectionStudent(id) {
      this.sectionToDelete = [];
      const querySnapshot = await getDocs(collection(db, "section-student"));
      querySnapshot.forEach((doc) => {
        this.sectionStudents.push(doc.data());
      });

      this.sectionStudents.forEach(element => {
        if (element.id.split("-")[1] == id)
          this.sectionToDelete.push(element);
      });

      this.sectionToDelete.forEach(async element => {
        await deleteDoc(doc(db, "section-student", element.id));
        const docRef = doc(db, "students", element.idStudent);
        await updateDoc(docRef, {
          currentCourse: "",
        });
      });

    },

    close() {
      this.dialog = false
    },

    closeDelete() {
      this.dialogDelete = false;
      this.Section();
    },

    closeSectionClose() {
      this.dialogClose = false;
      this.Section();
    },

    editItem(item) {
      this.dialog = true;
      this.saveMode = false;
      this.name = item.name;
      this.revisorName = item.revisorName;
      this.courseId = item.courseId;
      this.id = item.id;
    },

    onChangeCourseId() {
      this.name = this.courseId;
    },

    add() {
      this.dialog = true;
    },

    firestoreAutoId() {
      const CHARS =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      let autoId = "";

      for (let i = 0; i < 20; i++) {
        autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
      }
      return autoId;
    },

    async save() {
      if (this.saveMode) {
        this.sectionId = this.firestoreAutoId();
        await setDoc(doc(db, "sections", this.sectionId), {
          id: this.sectionId,
          name: this.name,
          courseId: this.courseId,
          status: this.status,
          revisorName: this.revisorName,
        });
      } else {
        const docRef = doc(db, "sections", this.id);
        await updateDoc(docRef, {
          id: this.id,
          name: this.name,
          courseId: this.courseId,
          status: this.status,
          revisorName: this.revisorName,
        });
      }
      this.Section();
      this.dialog = false
    },
    async closeItemConfirm() {
      const docRef = doc(db, "sections", this.section.id);
      await updateDoc(docRef, {
        status: 'Cerrada',

      });
      this.closeDelete();
    }
  }
}
</script>
