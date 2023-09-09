<template>
  <v-col class="text-center">
    <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">

    <v-container>
      <v-row style="justify-content: center;">
        <v-col cols="12" sm="12">
          <template>
            <v-card>
              <v-card-title>
                Solicitudes
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                  hide-details></v-text-field>
                <v-file-input id="fileData" label="Agregar desde archivo" @change="uploadFromFile()"></v-file-input>
                <v-btn class="ml-3" prepend-icon="mdi-plus" size="x-large" @click="saveFromFile()">
                  <v-icon left>
                    mdi-plus
                  </v-icon>Procesar Archivo</v-btn>
              </v-card-title>
              <v-data-table :headers="headers" :items="requests" :search="search">
                <template v-slot:item.date="{ item }">
                  <span>{{ new Date(item.date).toLocaleDateString() }}</span>
                </template>
                <template v-slot:item.actions="{ item }">

                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="editItem(item)">
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>Editar solicitud</span>
                  </v-tooltip>


                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>
                    </template>
                    <span>Cerrar solicitud</span>
                  </v-tooltip>

                </template>
              </v-data-table>
            </v-card>

            <v-dialog v-model="dialogDelete" max-width="600px">
              <v-card>
                <v-card-title class="text-h5">¿Estas seguro de cerrar esta solicitud?</v-card-title>
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
                  <span class="text-h5">Editar solicitud</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date"
                          transition="scale-transition" offset-y min-width="auto">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="date" label="Seleccione su fecha de solicitud"
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
                        <v-text-field label="Cantidad" v-model="quantity" required></v-text-field>
                      </v-col>

                      <v-col cols="6" md="4">
                        <v-combobox v-model="course" :items="coursesName" label="Seleccione el ID del curso"></v-combobox>
                      </v-col>
                    </v-row>
                  </v-container>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="3">
                        <v-text-field label="Encargado" v-model="manager" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field label="Nombre de asamblea" v-model="church" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field label="Cancelo" v-model="paid" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field label="Telefono" v-model="phone" required></v-text-field>
                      </v-col>
                      <v-col cols="6" md="2">
                        <v-combobox v-model="status" :items="statusList"
                          label="Seleccione el estado de la solicitud"></v-combobox>
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
import {
  db,
} from "~/plugins/firebase.js";
import readXlsxFile from "read-excel-file";

import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  setDoc
} from "firebase/firestore";

export default {
  mounted() {
    this.getRequest();
    this.getCourse();
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    search: '',
    headers: [{
      text: 'Estado',
      align: 'start',
      sortable: false,
      value: 'status',
    },
    {
      text: 'Fecha',
      value: 'date'
    },
    {
      text: 'Curso',
      value: 'course'
    },
    {
      text: 'Cantidad',
      value: 'quantity'
    },
    {
      text: 'Entregado',
      value: 'manager'
    },
    {
      text: 'Congregacion',
      value: 'church'
    },
    {
      text: 'Telefono',
      value: 'phone'
    },
    {
      text: 'Cancelo',
      value: 'paid'
    },
    {
      text: 'Acciones',
      value: 'actions',
      sortable: false
    },
    ],
    menu: false,
    id: "",
    requests: [],
    coursesName: [],
    courses: [],
    date: null,
    quantity: '',
    course: '',
    manager: '',
    church: '',
    phone: '',
    paid: '',
    status: '',
    statusList: [
      'Solicitud',
      'En curso',
      'Entregado',
      'Cancelada'
    ],
    dataFromFile: []
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
          await setDoc(doc(db, "requests", studentId), {
            date: item[0],
            quantity: item[1],
            course: item[2],
            manager: item[3],
            church: item[4],
            paid: item[5],
            phone: item[6],
            status: 'Solicitud',
            id: studentId
          });
        });
      }
      this.getRequest();
    },
    async getRequest() {
      this.requests = [];
      const querySnapshot = await getDocs(collection(db, "requests"));
      querySnapshot.forEach((doc) => {
        this.requests.push(doc.data());
      });
    },
    async getCourse() {
      const querySnapshot = await getDocs(collection(db, "courses"));
      querySnapshot.forEach((doc) => {
        this.courses.push(doc.data());
        this.coursesName.push(doc.data().id + '-' + doc.data().course);
      });
    },
    deleteItem(item) {
      this.studentsId = item;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await deleteDoc(doc(db, "requests", this.studentsId.id));
      this.closeDelete();
    },

    close() {
      this.dialog = false
    },

    closeDelete() {
      this.dialogDelete = false;
      this.getRequest();
    },
    editItem(item) {
      this.dialog = true;
      this.date = Date(item.date);
      this.quantity = item.quantity;
      this.course = item.course;
      this.manager = item.manager;
      this.church = item.church;
      this.paid = item.paid;
      this.phone = item.phone
      this.status = item.status,
      this.id = item.id
    },

    async save() {
      console.log(this.status);
      const docRef = doc(db, "requests", this.id);
      await updateDoc(docRef, {
        date: this.date,
        quantity: this.quantity,
        course: this.course,
        manager: this.manager,
        church: this.church,
        paid: this.paid,
        status: this.status,
        phone: this.phone
      });

      this.getRequest();
      this.dialog = false
    }
  }
}
</script>
