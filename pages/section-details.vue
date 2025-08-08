<template>
  <v-col class="text-center">
    <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">

    <v-container>
      <v-row>
        <v-card-title class="text-h8 text-md-h7 mr-5 text-lg-h7">Seleccionar seccion</v-card-title>
        <v-combobox v-model="section" :items="sectionsName" label=""></v-combobox>
        <v-btn prepend-icon="mdi-plus" size="x-large" class="ml-5" @click="viewSection()">
          <v-icon left>
            mdi-eye
          </v-icon>Mostrar Seccion</v-btn>
        <!-- <v-btn prepend-icon="mdi-plus" size="x-large" class="ml-5" @click="download()">
          <v-icon left>
            mdi-eye
          </v-icon>Exportar a excel</v-btn> -->
        <v-file-input id="pdfFile" label="Cargar Diploma  " @change="uploadFromFile()"></v-file-input>
      </v-row>
      <v-row>
        <v-col>
          <template>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center">
                      Revisor
                    </th>
                    <th class="text-center">
                      Curso
                    </th>
                    <th class="text-center">
                      Seccion
                    </th>
                    <th class="text-center">
                      Total de estudiantes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ revisorName }}</td>
                    <td>{{ course }}</td>
                    <td>{{ sectionId }}</td>
                    <td>{{ totalStudents }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </template>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
        </v-col>
      </v-row>

      <v-row style="justify-content: center;">
        <v-col cols="12" sm="12">
          <template>
            <v-card>

              <v-text-field v-model="search" class="ml-10 mr-10 mb-10" append-icon="mdi-magnify"
                label="Buscar estudiante" single-line hide-details></v-text-field>

              <v-data-table :headers="headers" :items="sectionStudentSelected" :search="search" class="elevation-1">
                <template v-slot:item.actions="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="addCalification(item)">
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>Postear nota</span>
                  </v-tooltip>
                  <v-tooltip top v-if="item.calification > 70">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon class="ml-2" dark v-bind="attrs" v-on="on" @click="handleButtonClick(item)">
                        mdi-printer-settings
                      </v-icon>
                    </template>
                    <span>Generar diploma</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-card>
          </template>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog" max-width="700px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Curso</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field label="Calificacion" v-model="calification" required></v-text-field>
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
    </v-container>
  </v-col>
</template>


<script>
import { db, storage } from "~/plugins/firebase.js";
import { ref, uploadBytes } from "firebase/storage"
import { collection, query, where, getDocs, doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';


export default {
  mounted() {
    this.getSectons();
  },
  data: () => ({
    pdfUrl: 'https://www.docdroid.net/w0BfCXc/diploma-pdf',
    dialog: false,
    calification: '',
    singleExpand: true,
    search: '',
    section: '',
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
      { text: 'Estado', value: 'status' },
      { text: 'Nota', value: 'calification' },
      { text: 'Acciones', value: 'actions' },
    ],
    students: [],
    studentsWithOutRevisor: [],

    sectionsName: [],
    sections: [],
    openSections: [],

    studentsId: "",
    sectionId: "",

    studentSection: '',
    courses: [],
    sectionStudent: [],
    sectionStudentSelected: [],

    revisorName: "",
    totalStudents: "",
    course: "",
    dniStudent: "",
    sectionId: "",
    level: '',
    module: '',
    lessons: [],
    lessonSelected: '',
    lessonStatus: '',
    currentCourse: '',
    arrayBufferFile: '',
    certificates: []
  }),
  methods: {

    firestoreAutoId() {
      const CHARS =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      let autoId = "";

      for (let i = 0; i < 20; i++) {
        autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
      }
      return autoId;
    },

    async saveCertificateReference(item, name) {

      const sectionRef = collection(db, "certificates");
      const qs = query(sectionRef,
        where("nameCertificare", "==", `${item.idStudent}_${item.courseId}`),
      );

      const querySnapshot = await getDocs(qs);
      querySnapshot.forEach((doc) => {
        this.certificates.push(doc.data());
        console.log(this.certificates);
      });

      if (this.certificates.length == 0) {
        var idCert = this.firestoreAutoId()
        await setDoc(doc(db, "certificates", idCert), {
          studentId: item.idStudent,
          pathBase: "https://firebasestorage.googleapis.com/v0/b/emaus-db.appspot.com/o/",
          nameCertificare: name,
          id: idCert,
        });
      }

    },

    upload(file, name, item) {
      const storageRef = ref(storage, `/${name}.pdf`);
      uploadBytes(storageRef, file).then(async (snapshot) => {
        console.log(snapshot);
        await this.saveCertificateReference(item, name);
      })
    },

    async uploadFromFile() {
      const input = document.getElementById("pdfFile");
      this.arrayBufferFile = await input.files[0].arrayBuffer().then(res => res);
    },

    async modifyPdf(item) {

      this.courses = [];

      const sectionRef = collection(db, "courses");
      const qs = query(sectionRef,
        where("id", "==", item.courseId),
      );

      const querySnapshot = await getDocs(qs);
      querySnapshot.forEach((doc) => {
        this.courses.push(doc.data());
      });

      const pdfDoc = await PDFDocument.load(this.arrayBufferFile);
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesRomanFontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);


      // Modify the PDF.
      const name = item.nameStudent;
      const firstPage = pdfDoc.getPages()[0];
      const { height } = firstPage.getSize();
      const fontSize = 50
      const textWidth = timesRomanFont.widthOfTextAtSize(name, fontSize);

      firstPage.drawText(name, {
        x: firstPage.getWidth() / 2 - textWidth / 2,
        y: height / 2,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0.03, 0.29, 0.47),
      });


      const course = this.courses[0].course;
      const fontSizeCourse1 = 30
      const fontSizeCourse = 20
      const textWidthCourse = timesRomanFontBold.widthOfTextAtSize(course.toUpperCase(), fontSizeCourse1);

      firstPage.drawText(course.toUpperCase(), {
        x: firstPage.getWidth() / 2 - textWidthCourse / 2,
        y: (height / 2) - 80,
        size: fontSizeCourse1,
        font: timesRomanFontBold,
        color: rgb(0.25, 0.67, 0.28),
      });


      const levelName = this.courses[0].levelName;
      const textWidthLevel = timesRomanFont.widthOfTextAtSize(levelName, fontSizeCourse);

      firstPage.drawText(levelName, {
        x: firstPage.getWidth() / 2 - textWidthLevel / 2,
        y: (height / 2) - 130,
        size: fontSizeCourse,
        font: timesRomanFont,
        color: rgb(0.03, 0.29, 0.47),
      });

      const modelName = "Módulo: " + this.courses[0].moduleName;
      const textWidthModule = timesRomanFont.widthOfTextAtSize(modelName, fontSizeCourse);

      firstPage.drawText(modelName, {
        x: firstPage.getWidth() / 2 - textWidthModule / 2,
        y: (height / 2) - 160,
        size: fontSizeCourse,
        font: timesRomanFont,
        color: rgb(0.03, 0.29, 0.47),
      });

      const fechaActual = new Date();
      const opciones = { year: 'numeric', month: 'long', day: 'numeric' };

      const date = fechaActual.toLocaleDateString(undefined, opciones) + " | Honduras C.A."
      const dateSize = timesRomanFont.widthOfTextAtSize(date, fontSizeCourse);

      firstPage.drawText(date, {
        x: firstPage.getWidth() / 2 - dateSize / 2,
        y: (height / 2) - 190,
        size: fontSizeCourse,
        font: timesRomanFont,
        color: rgb(0.03, 0.29, 0.47),
      });



      // Save the modified PDF to a variable (`pdfBytes`).
      const pdfBytes = await pdfDoc.save();

      // Now, you can use `pdfBytes` for any additional operations (e.g. downloading the modified PDF).
      return pdfBytes;
    },
    async handleButtonClick(item) {
      try {
        const pdfBytes = await this.modifyPdf(item);
        this.downloadPdf(pdfBytes, item);
      } catch (error) {
        console.error('Error modifying PDF:', error);
      }
    },
    downloadPdf(pdfBytes, item) {
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      this.upload(blob, `${item.idStudent}_${item.courseId}`, item);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'diploma.pdf';
      link.click();
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
          this.sectionsName.push(element.id + '-' + element.courseId + '-' + element.courseName + '-' + element.revisorName + '-' + element.churchName + '-' + element.department);
      });
    },

    async getSectionStudents() {
      this.sectionStudent = [];
      this.sectionStudentSelected = [];

      var sectionSelected = this.section.split('-');
      this.sectionId = sectionSelected[0];

      this.revisorName = sectionSelected[3];
      this.course = sectionSelected[2];

      const sectionRef = collection(db, "section-student");
      const qs = query(sectionRef,
        where("sectionId", "==", this.sectionId),
      );

      const querySnapshot = await getDocs(qs);
      querySnapshot.forEach((doc) => {
        this.sectionStudent.push(doc.data());
      });

      this.sectionStudent.forEach(element => {
        if (element.id.split('-')[1] === this.sectionId)
          this.sectionStudentSelected.push(element);
      });

      this.totalStudents = this.sectionStudentSelected.length;

    },

    addCalification(item) {
      this.dialog = true;
      this.dniStudent = item.idStudent
      this.sectionId = item.id.split("-")[1]
    },

    download() {
      if (this.section != "") {
        const fileName = "seccion";
        const data = this.sectionStudentSelected;
        const exportType = exportFromJSON.types.xls;
        exportFromJSON({ data, fileName, exportType });
      } else {
        this.text = "Seleccione primero una seccion"
        this.snackbar = true;
      }
    },

    async viewSection() {
      if (this.section != "") {
        await this.getSectionStudents();
      } else {
        this.text = "Seleccione primero una seccion"
        this.snackbar = true;
      }
    },

    async save() {
      if (this.calification > 69) {
        this.status = "APROBADA"
      } else {
        this.status = "REPROBADA"
      }

      const docRef = doc(db, "section-student", this.dniStudent + "-" + this.sectionId);
      await updateDoc(docRef, {
        calification: this.calification,
        status: this.status,
      });

      const docRefStudent = doc(db, "students", this.dniStudent);
      await updateDoc(docRefStudent, {
        currentCourse: '',
      });
      await this.getSectionStudents();
      this.dialog = false
    },

    close() {
      this.dialog = false
    }
  }
}
</script>

<style>
.justify-list {
  text-align: justify;
}
</style>
