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

                <v-btn prepend-icon="mdi-plus" size="x-large" class="ml-5" @click="exportToExcel()">
                  <v-icon left>
                    mdi-eye
                  </v-icon>Exportar a excel</v-btn>

                <v-btn prepend-icon="mdi-plus" size="x-large" class="ml-5" @click="exportToPDF()">
                  <v-icon left>
                    mdi-download
                  </v-icon>Exportar a pdf</v-btn>

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
import ExcelJS from "exceljs";
import * as XLSX from "xlsx";
import { collection, getDocs } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
    headersToExport: [{
      text: 'Nombre',
      align: 'start',
      value: 'nameStudent',
    },
    { text: 'Revisor', value: 'revisorName' },
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
      titleCell.value = `Reporte de Estudiantes`;
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
      this.sectionDetails.forEach(item => {
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
      doc.setFontSize(12);
      doc.text(`Reporte de Estudiantes`, 105, 40, { align: "center" });

      // 3️⃣ Preparar datos para la tabla
      doc.setFontSize(10);
      const columns = this.headersToExport.map(h => h.text);
      const rows = this.sectionDetails.map(item => this.headersToExport.map(h => item[h.value]));

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
  }
}
</script>
