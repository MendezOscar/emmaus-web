<template>
  <v-col class="text-center">
    <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">


    <v-container>
      <v-row style="justify-content: center;">
        <v-col cols="12" sm="12">
          <template>
            <v-card>
              <v-card-title>
                Revisores
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
                <v-col cols="auto ml-5">
                  <v-btn prepend-icon="mdi-plus" size="x-large" @click="add()">
                    <v-icon left>
                      mdi-plus
                    </v-icon>Agregar
                    revisor</v-btn>
                </v-col>
              </v-card-title>
              <v-data-table :headers="headers" :items="revisors" :search="search">
                <template v-slot:item.actions="{ item }">

                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="editItem(item)">
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>Editar revisor</span>
                  </v-tooltip>

                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>
                    </template>
                    <span>Delete revisor</span>
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
                  <span class="text-h5">Revisor</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field label="Nombre completo" v-model="name" required></v-text-field>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field label="Dirección" v-model="location" required></v-text-field>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field label="Correo" v-model="email" :rules="emailRules" required></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <v-container>
                    <v-row>
                      <v-col cols="6" md="3">
                        <v-text-field label="Teléfono (sin guiones)" v-model="phone" required></v-text-field>
                      </v-col>

                      <v-col cols="12" md="3">
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
                      <v-col cols="12" md="3">
                        <v-text-field label="Identidad (sin guiones)" v-model="dni" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field label="Nombre de asamblea" v-model="church" required></v-text-field>
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
import readXlsxFile from "read-excel-file";
import { auth, db, createUserWithEmailAndPassword } from '@/plugins/firebase'
import { collection, getDocs, doc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";

export default {
  mounted() {

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
        sortable: false,
        value: 'name',
      },
      { text: 'Asamblea', value: 'church' },
      { text: 'Direccion', value: 'location' },
      { text: 'Telefono', value: 'phone' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    revisors: [],
    revisor: "",

    name: "",
    location: "",
    email: "",
    phone: "",
    ocupation: "",
    education: "",
    dateOfBirth: "",
    church: "",
    dni: "",
    id: "",

    date: null,
    menu: false,
    modal: false,
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
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
          await setDoc(doc(db, "revisors", studentId), {
            name: item[0],
            dni: item[1],
            location: item[2],
            email: item[3],
            dateOfBirth: item[4],
            church: item[5],
            phone: item[6],
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

    async addUserFromFile(studentId, name, email, phone) {
      await setDoc(doc(db, "users", studentId), {
        displayName: name,
        email: email,
        phoneNumber: phone,
        userType: "Revisor"
      });
    },
    async getStudents() {
      this.revisors = [];
      const querySnapshot = await getDocs(collection(db, "revisors"));
      querySnapshot.forEach((doc) => {
        this.revisors.push(doc.data());
      });
    },

    add() {
      this.dialog = true;
    },

    deleteItem(item) {
      this.revisor = item;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await deleteDoc(doc(db, "revisors", this.revisor.id));
      this.closeDelete();
    },

    close() {
      this.dialog = false
    },

    closeDelete() {
      this.dialogDelete = false;
      this.getStudents();
    },

    async createUserFromFIle(email) {
      createUserWithEmailAndPassword(auth, email, "emmaus-rev-2022")
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

    async createUser() {
      createUserWithEmailAndPassword(auth, this.email, "emmaus-rev-2022")
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
    async addUser() {
      await setDoc(doc(db, "users", this.dni), {
        displayName: this.name,
        email: this.email,
        dni: this.dni,
        phoneNumber: this.phone,
        userType: "Revisor"
      });
    },

    editItem(item) {
      this.saveMode = false;
      this.dialog = true;
      this.name = item.name;
      this.location = item.location;
      this.email = item.email;
      this.phone = item.phone;
      this.dateOfBirth = Date(item.dateOfBirth);
      this.church = item.church;
      this.dni = item.dni;
      this.id = item.id
    },

    async save() {
      if (this.saveMode) {
        var idRev = this.firestoreAutoId()
        await setDoc(doc(db, "revisors", idRev), {
          name: this.name,
          id: idRev,
          location: this.location,
          email: this.email,
          phone: this.phone,
          dateOfBirth: this.date,
          church: this.church,
          dni: this.dni
        });
      }
      else {
        const docRef = doc(db, "revisors", this.id);
        await updateDoc(docRef, {
          name: this.name,
          location: this.location,
          email: this.email,
          phone: this.phone,
          dateOfBirth: this.date,
          church: this.church,
          dni: this.dni,
        });
      }
      this.clear();
      this.getStudents();
      this.dialog = false
    },

    clear() {
      this.name = "";
      this.location = "";
      this.email = "";
      this.phone = "";
      this.dateOfBirth = "";
      this.church = "";
      this.dni = "";
    },
  }
}
</script>
