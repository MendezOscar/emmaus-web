<template>
  <v-row>
    <v-col class="text-center">
      <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">
      <v-card-title class="text-h7 text-md-h5 text-lg-h5">Solicitar cursos</v-card-title>

      <v-form>
        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date"
                transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="date" label="Seleccione su fecha de solicitud" prepend-icon="mdi-calendar"
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
              <v-text-field label="Cantidad" v-model="quantity" required></v-text-field>
            </v-col>

            <v-col cols="6" md="4">
              <v-combobox v-model="course" :items="coursesName" label="Seleccione el ID del curso"></v-combobox>
            </v-col>
          </v-row>
        </v-container>
        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field label="Encargado" v-model="manager" required></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field label="Nombre de asamblea" v-model="church" required></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field label="Telefono" v-model="phone" required></v-text-field>
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
  createUserWithEmailAndPassword
} from '@/plugins/firebase'
import {
  collection,
  setDoc,
  doc,
  getDocs
} from "firebase/firestore";

export default {
  mounted() {
    this.getCourse();
  },
  data() {
    return {
      snackbar: false,
      text: 'Solicitud enviada con exito, espere ser contatado',
      vertical: true,
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
    async getCourse() {
      const querySnapshot = await getDocs(collection(db, "courses"));
      querySnapshot.forEach((doc) => {
        this.courses.push(doc.data());
        this.coursesName.push(doc.data().id + '-' + doc.data().course);
      });
    },
    async register() {
      var studentId = this.firestoreAutoId();
      await setDoc(doc(db, "requests", studentId), {
        date: this.date,
        quantity: this.quantity,
        course: this.course,
        manager: this.manager,
        church: this.church,
        paid: "0",
        status: 'Solicitud',
        phone: this.phone,
        id: studentId
      });
      this.snackbar = true;
      this.clear();
    },
    clear() {
      this.quantity = "";
      this.manager = "";
      this.church = "";
      this.paid = "";
      this.phone = "";
    },
  },
}
</script>
