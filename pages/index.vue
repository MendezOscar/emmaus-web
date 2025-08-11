<template>
  <v-row>
    <v-col class="text-center">
      <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">
      <v-card-title class="text-h7 text-md-h5 text-lg-h5">Registro de estudiante</v-card-title>

      <v-form>
        <v-container>
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field label="Nombre completo" v-model="name" required></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field label="Dirección" v-model="location" required></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field label="Correo" v-model="email" :rules="emailRules" required></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-combobox v-model="churchName" :items="churchesNames"
                label="Seleccione la sala evangélica"></v-combobox>
            </v-col>
          </v-row>
        </v-container>
        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field label="Teléfono (sin guiones)" v-model="phone" required></v-text-field>
            </v-col>


            <v-col cols="12" md="4">
              <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date"
                transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="date" label="Seleccione su fecha de nacimiento" prepend-icon="mdi-calendar"
                    readonly v-bind="attrs" v-on="on"></v-text-field>
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
              <v-text-field label="Codigo" v-model="code" required></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-btn class="mr-4 mt-10" @click="register()">
          Guardar
        </v-btn>
        <v-btn class="mt-10" @click="clear()">
          Borrar
        </v-btn>
      </v-form>

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
</template>

<script>
import {
  auth,
  db,
  createUserWithEmailAndPassword,
} from '@/plugins/firebase'
import {
  setDoc,
  doc,
  getDocs,
  collection
} from "firebase/firestore";

export default {
  mounted() {
    this.getChurches();
  },
  data() {
    return {
      snackbar: false,
      text: 'Registro exitoso, espere que el administrador asigne un revisor.',
      vertical: true,
      name: "",
      location: "",
      email: "",
      phone: "",
      ocupation: "",
      education: "",
      civilStatus: "",
      dateOfBirth: "",
      churchDones: "",
      church: "",
      dni: "",
      currentRevisor: "",

      date: null,
      menu: false,
      modal: false,
      code: '',
      educationItems: [
        'Primaria',
        'Secundaria',
        'Universitaria',
      ],
      department: "",
      departmentItems: [
        'Atlántida',
        'Choluteca',
        'Colón',
        'Comayagua',
        'Cortés',
        'Copán',
        'El Paraíso',
        'Francisco Morazán',
        'Gracias a Dios',
        'Intibucá',
        'Islas de la Bahía',
        'La Paz',
        'Lempira',
        'Ocotepeque',
        'Olancho',
        'Santa Bárbara',
        'Valle',
        'Yoro'
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
    }
  },
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
    async register() {
      if (!this.name || !this.location || !this.churchName || !this.code) {
        this.snackbar = true;
        this.text = 'Por favor, complete los campos requeridos (Nombre, codigo, iglesia, ubicacion).';
        return;
      }
      var studentId = this.firestoreAutoId();
      await setDoc(doc(db, "students", studentId), {
        name: this.name,
        location: this.location,
        email: this.email,
        phone: this.phone,
        dateOfBirth: this.date,
        currentCourse: '',
        id: studentId,
        churchName: this.churchName.split("-")[0],
        department: this.churchName.split("-")[1],
        code: this.code
      });
      this.snackbar = true;
      //this.addUser(studentId);
      //this.createUser();
      this.clear();
    },
    async getChurches() {
      this.churches = [];
      const querySnapshot = await getDocs(collection(db, "church"));
      querySnapshot.forEach((doc) => {
        this.churches.push(doc.data());
        this.churchesNames.push(doc.data().church + "-" + doc.data().department);

      });
    },
    async createUser() {
      createUserWithEmailAndPassword(auth, this.email, "emmaus-est-2022")
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
    async addUser(studentId) {
      await setDoc(doc(db, "users", studentId), {
        displayName: this.name,
        email: this.email,
        phoneNumber: this.phone,
        userType: "Estudiante"
      });
    },
    clear() {
      this.name = "";
      this.location = "";
      this.email = "";
      this.phone = "";
      this.ocupation = "";
      this.education = "";
      this.civilStatus = "";
      this.dateOfBirth = "";
      this.churchDones = "";
      this.church = "";
      this.code = "";
    },
  },
}
</script>
