<template>
  <v-col class="text-center">
    <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">

    <v-container>
      <v-row style="justify-content: center;">
        <v-col cols="12" sm="12">
          <template>
            <v-card>
              <v-card-title>
                Estudiantes
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                  hide-details></v-text-field>
                <v-btn prepend-icon="mdi-plus" class="ml-2 mr-2" size="x-large" @click="getAll()">
                  <v-icon left>
                    mdi-eye
                  </v-icon>Ver todos</v-btn>
                <v-file-input id="fileData" label="Agregar desde archivo" @change="uploadFromFile()"></v-file-input>
                <v-btn class="ml-3" prepend-icon="mdi-plus" size="x-large" @click="saveFromFile()">
                  <v-icon left>
                    mdi-plus
                  </v-icon>Procesar Archivo</v-btn>
                <v-btn prepend-icon="mdi-plus" size="x-large" class="ml-5" @click="download()">
                  <v-icon left>
                    mdi-eye
                  </v-icon>Exportar a excel</v-btn>
              </v-card-title>
              <v-data-table :headers="headers" :items="students" :search="search">
                <template v-slot:item.actions="{ item }">

                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="editItem(item)">
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>Editar estudiante</span>
                  </v-tooltip>

                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>
                    </template>
                    <span>Delete estudiante</span>
                  </v-tooltip>

                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="viewStudent(item)">
                        mdi-eye
                      </v-icon>
                    </template>
                    <span>Ver estudiante</span>
                  </v-tooltip>

                </template>
              </v-data-table>
            </v-card>
            <v-dialog v-model="dialogDelete" max-width="600px">
              <v-card>
                <v-card-title class="text-h5">¿Estas seguro de eliminar este estudiante?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialog" max-width="1600px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Editar estudiante</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="3">
                        <v-text-field label="Codigo" v-model="code" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field label="Nombre completo" v-model="name" required></v-text-field>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field label="Dirección" v-model="location" required></v-text-field>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field label="Correo" v-model="email" :rules="emailRules" required></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <v-container>
                    <v-row>
                      <v-col cols="6" md="4">
                        <v-text-field label="Teléfono (sin guiones)" v-model="phone" required></v-text-field>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date"
                          transition="scale-transition" offset-y min-width="auto">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="date" label="Seleccione su fecha de nacimiento"
                              prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                          </template>
                          <v-date-picker v-model="date" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="menu = false">
                              Cancel
                            </v-btn>
                            <v-btn text color="primary" @click="$refs.menu.save(date)">
                              OK
                            </v-btn>
                          </v-date-picker>
                        </v-menu>
                      </v-col>
                       <v-col cols="12" md="4">
                        <v-combobox v-model="churchName" :items="churchesNames"
                          label="Seleccione la sala evangélica"></v-combobox>
                      </v-col>
                    </v-row>
                  </v-container>
                  <v-container>
                    <v-row>


                      <!-- <v-col cols="12" md="4">
                        <v-combobox v-model="currentCourse" :items="coursesName" label="Cursos"></v-combobox>
                      </v-col> -->
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
            <v-dialog v-model="viewStudentDialog" max-width="1600px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Detalle de {{ selectedStudent?.name }}</span>
                </v-card-title>

                <v-card-text>
                  <v-data-table :headers="headersDetails" :items="sectionStudent" :search="search">
                  </v-data-table>
                </v-card-text>

                <v-card-actions>
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
import {
  auth,
  db,
  createUserWithEmailAndPassword
} from "~/plugins/firebase.js";
import exportFromJSON from "export-from-json";
import readXlsxFile from "read-excel-file";

import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
  query,
  where
} from "firebase/firestore";

export default {
  mounted() {
    this.getChurches();
  },
  data: () => ({
    changeRevisor: false,
    dialog: false,
    dialogDelete: false,
    viewStudentDialog: false,
    closeViewStudentDialog: false,
    search: '',
    headers: [{
      text: 'Nombre',
      align: 'start',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Codigo',
      value: 'code'
    },
    {
      text: 'Asamblea',
      value: 'churchName'
    },
    {
      text: 'Direccion',
      value: 'location'
    },
    {
      text: 'Telefono',
      value: 'phone'
    },
    {
      text: 'Curso Actual',
      value: 'currentCourse'
    },
    {
      text: 'Acciones',
      value: 'actions',
      sortable: false
    },
    ],
    headersDetails: [{
      text: 'Nombre',
      align: 'start',
      sortable: false,
      value: 'nameStudent',
    },
    { text: 'Revisor', value: 'revisorName' },
    { text: 'Seccion', value: 'sectionId' },
    { text: 'Curso', value: 'courseName' },
    { text: 'Asamblea', value: 'churchName' },
    { text: 'Departamento', value: 'department' },
    { text: 'Año', value: 'year' },
    { text: 'Mes', value: 'month' },
    { text: 'Estado', value: 'status' },
    { text: 'Nota', value: 'calification' },
    ],
    id: "",
    students: [],
    studentsId: "",

    name: "",
    location: "",
    email: "",
    phone: "",
    ocupation: "",
    education: "",
    civilStatus: "",
    dateOfBirth: "",
    churchDones: "",
    churchName: "",
    dni: "",
    currentCourse: "",
    code: '',
    date: null,
    menu: false,
    educationItems: [
      'Primaria',
      'Secundaria',
      'Universitaria',
    ],
    civilStatusItem: [
      "Casado",
      "Soltero",
      "Viudo"
    ],
    churchName: '',
    churches: [],
    churchesNames: [],
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    coursesName: [],
    courses: [],
    dniRevisor: "",
    dataFromFile: [],
    dataToExport: [],
    selectedStudent: "",
    sectionStudentSelected: [],
    sectionStudent: []

  }),
  methods: {
    async getChurches() {
      this.churches = [];
      const querySnapshot = await getDocs(collection(db, "church"));
      querySnapshot.forEach((doc) => {
        this.churches.push(doc.data());
        this.churchesNames.push(doc.data().church + "-" + doc.data().department);

      });
    },
    download() {
      if (this.studentCode != "") {
        const fileName = "students";
        this.students.forEach((item) => this.dataToExport.push({ name: item.name, phone: `+504${item.phone}` }));

        const data = this.dataToExport;

        const exportType = exportFromJSON.types.csv;
        exportFromJSON({ data, fileName, exportType });
      } else {
        this.text = "Seleccione un estudiante primero"
        this.snackbar = true;
      }
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

    uploadFromFile() {
      const input = document.getElementById("fileData");
      readXlsxFile(input.files[0]).then((rows) => {
        rows.forEach((item) => this.dataFromFile.push(item));
      });
    },

    async saveFromFile() {
      if (this.dataFromFile.size != 0) {
        this.dataFromFile.forEach(async (item) => {
          var studentId = this.firestoreAutoId();
          await setDoc(doc(db, "students", studentId), {
            code: item[0],
            name: item[1],
            dni: item[2],
            location: item[3],
            email: item[4],
            dateOfBirth: item[5],
            churchName: item[6],
            phone: item[7],
            currentCourse: '',
            id: studentId
          });
        });
      }
      this.getStudents();
    },

    getAll() {
      this.getStudents();
    },

    async getSectionStudents(item) {

      this.sectionStudent = [];
      this.sectionStudentSelected = [];

      const sectionRef = collection(db, "section-student");
      const qs = query(sectionRef,
        where("idStudent", "==", item.id),
      );

      const querySnapshot = await getDocs(qs);
      querySnapshot.forEach((doc) => {
        this.sectionStudent.push(doc.data());
        console.log("Hola");

        console.log(this.sectionStudent);

      });

      this.sectionStudent.forEach(element => {
        this.sectionStudentSelected.push(element);
      });


    },

    async createUser(email, code) {
      createUserWithEmailAndPassword(auth, email, code)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    },

    async addUser(studentId, name, email, phone) {
      await setDoc(doc(db, "users", studentId), {
        displayName: name,
        email: email,
        phoneNumber: phone,
        userType: "Estudiante"
      });
    },

    async getStudents() {
      this.students = [];
      const querySnapshot = await getDocs(collection(db, "students"));
      querySnapshot.forEach((doc) => {
        this.students.push(doc.data());
      });
    },

    async getCourse() {
      const querySnapshot = await getDocs(collection(db, "courses"));
      querySnapshot.forEach((doc) => {
        this.courses.push(doc.data());
        this.coursesName.push(doc.data().name);
      });
    },

    deleteItem(item) {
      this.studentsId = item.id;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await deleteDoc(doc(db, "students", this.studentsId));
      this.closeDelete();
    },

    close() {
      this.dialog = false
    },

    closeDelete() {
      this.dialogDelete = false;
      this.getStudents();
    },

    viewStudent(item) {
      this.getSectionStudents(item);
      this.viewStudentDialog = true;
      this.selectedStudent = item;
    },

    editItem(item) {
      this.getCourse();
      this.dialog = true;
      this.code = item.code;
      this.name = item.name;
      this.location = item.location;
      this.email = item.email;
      this.phone = item.phone;
      this.dateOfBirth = Date(item.dateOfBirth);
      this.churchName = item.churchName;
      this.dni = item.dni;
      this.currentCourse = item.currentCourse;
      this.id = item.id
    },

    async save() {
      const docRef = doc(db, "students", this.id);
      await updateDoc(docRef, {
        name: this.name,
        location: this.location,
        email: this.email,
        phone: this.phone,
        dateOfBirth: this.date,
        churchName: this.churchName,
        dni: this.dni,
        currentCourse: this.currentCourse,
        code: this.code
      });

      this.getStudents();
      this.dialog = false
    }
  }
}
</script>
