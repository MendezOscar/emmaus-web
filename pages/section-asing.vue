<template>
  <v-col class="text-center">
    <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">


    <v-container>
      <v-row>
        <v-card-title class="text-h7 text-md-h5 mr-5 text-lg-h5">Seleccionar seccion</v-card-title>
        <v-combobox v-model="section" :items="sectionsName" label="Seleccione la seccion"></v-combobox>
        <v-btn prepend-icon="mdi-plus" size="x-large" class="ml-5" @click="viewSection()">
          <v-icon left>
            mdi-eye
          </v-icon>MOstrar Seccion</v-btn>
      </v-row>

      <v-row style="justify-content: center;">
        <v-col cols="6" sm="6">
          <template>
            <v-card>
              <v-card-title>
                Estudiantes sin seccion
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                  hide-details></v-text-field>
              </v-card-title>
              <v-data-table :headers="headers" :items="studentsWithOutRevisor" :search="search">
                <template v-slot:item.actions="{ item }">

                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="asignStudents(item)">
                        mdi-plus
                      </v-icon>
                    </template>
                    <span>Agregar estudiante a seccion seleccionada</span>
                  </v-tooltip>

                </template>
              </v-data-table>
            </v-card>
          </template>
          <v-snackbar v-model="snackbar" :vertical="vertical">
            {{ text }}

            <template v-slot:action="{ attrs }">
              <v-btn color="indigo" text v-bind="attrs" @click="snackbar = false">
                Close
              </v-btn>
            </template>
          </v-snackbar>
        </v-col>
        <v-col cols="6" sm="6">
          <template>
            <v-card>
              <v-card-title>
                Estudiantes de la seccion
                <v-spacer></v-spacer>
                <v-text-field v-model="search1" append-icon="mdi-magnify" label="Search" single-line
                  hide-details></v-text-field>
              </v-card-title>
              <v-data-table :headers="sectionHeaders" :items="sectionStudentSelected" :search="search1">
                <template v-slot:item.actions="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>
                    </template>
                    <span>Eliminar estudiante de esta seccion</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-card>
          </template>
          <v-dialog v-model="dialogDelete" max-width="700px">
            <v-card>
              <v-card-title class="text-h5">¿Estas seguro de eliminar este estudiante de la
                seccion?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-snackbar v-model="snackbar" :vertical="vertical">
            {{ text }}

            <template v-slot:action="{ attrs }">
              <v-btn color="indigo" text v-bind="attrs" @click="snackbar = false">
                Close
              </v-btn>
            </template>
          </v-snackbar>
        </v-col>
      </v-row>
    </v-container>
  </v-col>
</template>

<script>
import { db } from "~/plugins/firebase.js";
import { collection, query, where, getDocs, doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";

export default {
  mounted() {
    this.getStudents();
    this.getSectons();
  },
  data: () => ({
    snackbar: false,
    dialogDelete: false,
    text: 'Estudiante asignado',
    vertical: true,
    dialog: false,
    dialogDelete: false,
    search: '',
    search1: '',
    section: '',
    course: '',
    headers: [
      {
        text: 'Nombre',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'Asamblea', value: 'churchName' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    sectionHeaders: [
      {
        text: 'Nombre',
        align: 'start',
        sortable: false,
        value: 'nameStudent',
      },
      { text: 'Seccion', value: 'sectionId' },
      { text: 'Curso', value: 'courseName' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    students: [],
    studentsWithOutRevisor: [],

    sectionsName: [],
    sectionSelected: '',
    sections: [],
    openSections: [],

    studentsId: "",
    sectionId: "",

    studentSection: '',
    sectionStudent: [],
    sectionStudentSelected: [],
    lessons: [],
    lessonsToSAve: [],
    lessonCourse: [],
    sectionStudentToNewField: [],

    churchName: "",
    department: "",
  }),
  methods: {

    async getStudents() {
      this.students = [];
      this.studentsWithOutRevisor = [];

      const studentsRef = collection(db, "students");
      const q = query(studentsRef,
        where("currentCourse", "==", ""),
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        this.students.push(doc.data());
      });
      this.students.forEach(element => {
        if (element.currentCourse == "" || element.currentCourse == null)
          this.studentsWithOutRevisor.push(element);
      });
    },

    async getSectons() {
      this.sections = [];
      this.sectionsName = [];
      const querySnapshot = await getDocs(collection(db, "sections"));
      querySnapshot.forEach((doc) => {
        this.sections.push(doc.data());
      });
      this.sections.forEach(element => {
        if (element.status === "En curso")
          this.sectionsName.push(element.id + '-' + element.name + '-' + element.revisorName + '-' + element.churchName + '-' + element.department);
      });
    },

    getSpecificSecion() {
      this.sections.forEach(element => {
        if (element.id === this.section.split('-')[0])
          this.sectionSelected = element;
        console.log(this.sectionSelected);
      });
    },

    async getSectionStudents() {
      this.sectionStudent = [];
      this.sectionStudentSelected = [];

      const studentsSectionRef = collection(db, "section-student");
      const qss = query(studentsSectionRef,
        where("sectionId", "==", this.sectionSelected.id),
      );

      const querySnapshot = await getDocs(qss);
      querySnapshot.forEach((doc) => {
        this.sectionStudent.push(doc.data());
      });

      this.sectionStudent.forEach(element => {
        if (element.id.split('-')[1] === this.section.split('-')[0])
          this.sectionStudentSelected.push(element);
      });

    },

    async asignStudents(item) {
      if (this.section != "") {

        await setDoc(doc(db, "section-student", item.id + "-" + this.sectionSelected.id), {
          id: item.id + "-" + this.sectionSelected.id,
          courseId: this.section.split('-')[1],
          courseName: this.section.split('-')[2],
          revisorName: this.section.split('-')[3],
          churchName: this.section.split('-')[4],
          department: this.section.split('-')[5],
          nameStudent: item.name,
          idStudent: item.id,
          status: "EN CURSO",
          sectionId: this.sectionSelected.id,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          calification: 0
        });

        this.lessonCourse = [];

        const docRef = doc(db, "students", item.id);
        await updateDoc(docRef, {
          currentCourse: this.section.split('-')[2],
        });
        this.snackbar = true;
        this.getStudents();
        this.getSectionStudents();
      } else {
        this.text = "Seleccione primero una seccion"
        this.snackbar = true;
      }
    },

    async deleteItemConfirm() {
      await deleteDoc(doc(db, "section-student", this.studentSection.idStudent + '-' + this.studentSection.id.split('-')[1]));
      const docRef = doc(db, "students", this.studentSection.idStudent);
      await updateDoc(docRef, {
        currentCourse: ""
      });
      this.closeDelete();
    },

    viewSection() {
      if (this.section != "") {
        this.getSpecificSecion();
        this.getSectionStudents();

      } else {
        this.text = "Seleccione primero una seccion"
        this.snackbar = true;
      }
    },

    deleteItem(item) {
      this.dialogDelete = true;
      this.studentSection = item;
    },

    closeDelete() {
      this.dialogDelete = false;
      this.getSectionStudents();
      this.getStudents();
    },
  }
}
</script>
