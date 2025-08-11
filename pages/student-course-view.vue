<template>
  <v-col class="text-center">
    <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">

    <v-container>
      <v-row>
        <v-card-title class="text-h8 text-md-h7 mr-5 text-lg-h7">Escriba el codigo del estudiante:</v-card-title>
        <v-text-field v-model="studentCode" append-icon="mdi-magnify" single-line hide-details></v-text-field>
        <v-btn prepend-icon="mdi-plus" size="x-large" class="ml-5" @click="viewSection()">
          <v-icon left>
            mdi-eye
          </v-icon>Mostrar estudiante</v-btn>
        <v-btn prepend-icon="mdi-plus" size="x-large" class="ml-5" @click="exportToExcel()">
          <v-icon left>
            mdi-download
          </v-icon>Exportar a excel</v-btn>
        <v-btn prepend-icon="mdi-plus" size="x-large" class="ml-5" @click="exportToPDF()">
          <v-icon left>
            mdi-download
          </v-icon>Exportar a pdf</v-btn>
      </v-row>
      <v-row>
        <v-col></v-col>
      </v-row>

      <v-row style="justify-content: center;">
        <v-col cols="12" sm="12">
          <template>
            <v-card>
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
                      <v-icon class="ml-2" dark v-bind="attrs" v-on="on">
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
import { db } from "~/plugins/firebase.js";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { collection, query, where, getDocs, doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default {
  mounted() {
  },
  data: () => ({
    dialog: false,
    calification: '',
    singleExpand: true,
    search: '',
    studentCode: '',
    headers: [
      {
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
      { text: 'Acciones', value: 'actions' },
    ],
    headersToExport: [
      { text: 'Revisor', value: 'revisorName' },
      { text: 'Curso', value: 'courseName' },
      { text: 'Asamblea', value: 'churchName' },
      { text: 'Departamento', value: 'department' },
      { text: 'Año', value: 'year' },
      { text: 'Mes', value: 'month' },
      { text: 'Estado', value: 'status' },
      { text: 'Nota', value: 'calification' },
    ],
    students: [],
    student: '',
    sectionsName: [],
    sections: [],
    openSections: [],

    studentsId: "",
    sectionId: "",

    studentSection: '',
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
    currentCourse: ''
  }),
  methods: {
    async getStudent() {
      const studentRef = collection(db, "students");
      const qs = query(studentRef,
        where("code", "==", this.studentCode),
      );

      const querySnapshot = await getDocs(qs);
      querySnapshot.forEach((doc) => {
        this.students.push(doc.data());
        this.student = this.students[0];
      });

      this.getSectionStudents();
    },

    async getSectionStudents() {
      this.sectionStudent = [];
      this.sectionStudentSelected = [];

      if (this.student.length != 0) {
        const sectionRef = collection(db, "section-student");
        const qs = query(sectionRef,
          where("idStudent", "==", this.student.id),
        );

        const querySnapshot = await getDocs(qs);
        querySnapshot.forEach((doc) => {
          this.sectionStudent.push(doc.data());
        });

        this.sectionStudent.forEach(element => {
          this.sectionStudentSelected.push(element);
        });
      }

    },

    addCalification(item) {
      this.dialog = true;
      this.dniStudent = item.idStudent
      this.sectionId = item.id.split("-")[1]
    },

    download() {
      if (this.studentCode != "") {
        const ws = XLSX.utils.json_to_sheet(this.sectionStudentSelected);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Datos");
        XLSX.writeFile(wb, "Reporte de estudiante.xlsx");
      } else {
        this.text = "Seleccione un estudiante primero"
        this.snackbar = true;
      }
    },

    async exportToExcel() {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Reporte");

      // 1️⃣ Insertar Imagen
      const imgUrl = "/emmaus.png"; // Ruta de la imagen en public/
      const imageResponse = await fetch(imgUrl);
      const imageBuffer = await imageResponse.arrayBuffer();

      const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: "png"
      });

      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 120, height: 80 }
      });

      // 2️⃣ Título
      worksheet.mergeCells("C1", "E2");
      const titleCell = worksheet.getCell("C1");
      titleCell.value = `Reporte de Estudiante ${this.student.name}`;
      titleCell.font = { size: 16, bold: true, color: { argb: "FFFFFFFF" } };
      titleCell.alignment = { vertical: "middle", horizontal: "center" };
      titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "41B883" }
      };

      // 3️⃣ Encabezados de la tabla
      const columnTitles = this.headersToExport.map(h => h.text);
      worksheet.addRow([]);
      worksheet.addRow(columnTitles);

      const headerRow = worksheet.getRow(3);
      headerRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "4CAF50" }
        };
        cell.alignment = { horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });

      // 4️⃣ Agregar datos
      this.sectionStudentSelected.forEach(item => {
        worksheet.addRow(this.headersToExport.map(h => item[h.value]));
      });

      // 5️⃣ Ajustar ancho de columnas
      worksheet.columns.forEach(column => {
        column.width = Math.max(
          20,
          ...column.values.map(v => (v ? v.toString().length : 0))
        );
      });

      // 6️⃣ Exportar archivo
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), "reporte_estudiantes.xlsx");
    },

    async exportToPDF() {
      const doc = new jsPDF();

      // 1️⃣ Agregar Imagen (logo)
      const imgUrl = "/emmaus.png"; // Ruta pública o en /static
      const imgData = await this.getBase64ImageFromURL(imgUrl);
      doc.addImage(imgData, "PNG", 90, 5, 25, 25); // x, y, ancho, alto

      // 2️⃣ Agregar Título
      doc.setFontSize(14);
      doc.text(`Reporte de Estudiante ${this.student.name}`, 105, 40, { align: "center" });

      // 3️⃣ Preparar datos para la tabla
      const columns = this.headersToExport.map(h => h.text);
      const rows = this.sectionStudentSelected.map(item => this.headersToExport.map(h => item[h.value]));

      // 4️⃣ Agregar Tabla
      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 45
      });

      // 5️⃣ Agregar Fecha al pie
      const fecha = new Date().toLocaleString();
      doc.setFontSize(10);
      doc.text(`Generado el: ${fecha}`, 14, doc.internal.pageSize.height - 10);

      // 6️⃣ Guardar PDF
      doc.save("reporte.pdf");
    },

    // 🔹 Convertir imagen a Base64 para jsPDF
    getBase64ImageFromURL(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = error => reject(error);
        img.src = url;
      });
    },

    async viewSection() {
      if (this.studentCode != "") {
        await this.getStudent();
      } else {
        this.text = "Seleccione un estudiante primero"
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
