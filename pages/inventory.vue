<template>
  <v-col class="text-center">
    <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">
    <v-container>
      <v-row style="justify-content: center;">
        <v-col cols="12" sm="12">
          <template>
            <v-card>
              <v-card-title>
                Inventario
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                  hide-details></v-text-field>

                <v-col cols="auto ml-5">
                  <v-btn prepend-icon="mdi-plus" size="x-large" @click="addMovementDialog()">
                    <v-icon left>
                      mdi-plus
                    </v-icon>Agregar
                    movimiento</v-btn>
                </v-col>

              </v-card-title>
              <v-data-table :headers="headers" :items="inventory" :search="search">
                <template v-slot:item.actions="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="viewDetails(item)">
                        mdi-eye
                      </v-icon>
                    </template>
                    <span>ver detalle</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-card>
            <v-dialog v-model="dialog" max-width="1600px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Detalle de {{ selectedItem?.course }}</span>
                </v-card-title>

                <v-card-text>
                  <v-data-table :headers="headersDetail" :items="specificInventory" :search="search">
                    <template v-slot:item.actions="{ item }">
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon dark v-bind="attrs" v-on="on" @click="viewDetails(item)">
                            mdi-eye
                          </v-icon>
                        </template>
                        <span>ver detalle</span>
                      </v-tooltip>
                    </template>
                  </v-data-table>
                </v-card-text>

                <v-card-actions>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogAddMovement" max-width="1300px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Agregar Movimiento</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="6" md="4">
                        <v-combobox v-model="courseName" :items="coursesName"
                          label="Seleccione el ID del curso"></v-combobox>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field label="Entregado a" v-model="receiver" required></v-text-field>
                      </v-col>
                      <v-col cols="6" md="4">
                        <v-combobox v-model="typeMovement" :items="typeMovementOptions"
                          label="Seleccione el tipo de movimiento"></v-combobox>
                      </v-col>
                    </v-row>
                  </v-container>
                  <v-container>
                    <v-row>
                      <v-col cols="6" md="4">
                        <v-combobox v-model="reason" :items="reasonOptions" label="Seleccione la razón"></v-combobox>
                      </v-col>
                      <v-col cols="6" md="4">
                        <v-combobox v-model="sede" :items="sedes" label="Seleccione la sede"></v-combobox>
                      </v-col>
                      <v-col cols="6" md="4">
                        <v-text-field label="Cantidad" v-model="quantity" type="number" required></v-text-field>
                      </v-col>

                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDialogAddMovement">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="saveMovement">
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
import { collection, getDocs, query, where, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { Integer } from "read-excel-file";

export default {
  mounted() {
    this.getInventory();
    this.getCourses();

  },
  data: () => ({
    inventoryId: "",
    saveMode: true,
    dialog: false,
    dialogAddMovement: false,
    dialogDelete: false,
    search: '',
    courseName: "",
    courseId: "",
    courses: [],
    coursesName: [],
    receiver: "",
    typeMovement: "",
    reason: "",
    quantity: 0,
    sede: "",
    sedes: ["San Pedro Sula"],
    typeMovementOptions: ["Entrada", "Salida"],
    reasonOptions: ["Entrada de inventario", "Salida para estudio", "Salida por daño", "Otro"],
    headersDetail: [
      {
        text: 'Curso',
        align: 'start',
        value: 'course',
      },
      { text: 'Fecha', value: 'date' },
      { text: 'Razon', value: 'reason' },
      { text: 'Receptor', value: 'receiver' },
      { text: 'Sede', value: 'sede' },
      { text: 'Tipo', value: 'type' },
      { text: 'Cantidad', value: 'quantity' },
    ],
    headers: [
      {
        text: 'Curso',
        align: 'start',
        value: 'course',
      },
      { text: 'Fecha', value: 'date' },
      { text: 'Razon', value: 'reason' },
      { text: 'Receptor', value: 'receiver' },
      { text: 'Sede', value: 'sede' },
      { text: 'Tipo', value: 'type' },
      { text: 'Cantidad', value: 'quantity' },
      { text: 'Acciones', value: 'actions', sortable: false },

    ],
    dataFromFile: [],
    inventory: [],
    specificInventory: [],
    selectedItem: null
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
    async getInventory() {
      this.inventory = [];
      const studentsSectionRef = collection(db, "inventory");
      const qss = query(studentsSectionRef,
        where("type", "==", "Inventario"),
      );

      const querySnapshot = await getDocs(qss);
      querySnapshot.forEach((doc) => {
        this.inventory.push(doc.data());
      });
    },
    async getSpecificInventory(item) {
      this.specificInventory = [];
      const studentsSectionRef = collection(db, "inventory");
      const qss = query(studentsSectionRef,
        where("course", "==", item.course),
      );

      const querySnapshot = await getDocs(qss);
      querySnapshot.forEach((doc) => {
        this.specificInventory.push(doc.data());
      });
    },
    async getCourses() {
      this.courses = [];
      this.coursesName = [];
      const querySnapshot = await getDocs(collection(db, "courses"));
      querySnapshot.forEach((doc) => {
        this.courses.push(doc.data());
        this.coursesName.push(doc.data().id + '-' + doc.data().course);
      });
    },
    viewDetails(item) {
      this.dialog = true;
      this.selectedItem = item;
      this.getSpecificInventory(item);
    },
    close() {
      this.dialog = false
    },
    closeDialogAddMovement() {
      this.dialogAddMovement = false
    },
    addMovementDialog() {
      this.dialogAddMovement = true;
    },
    async saveMovement() {
      if (!this.courseName || !this.receiver || !this.typeMovement || !this.reason || !this.sede || this.quantity <= 0) {
        alert("Por favor, complete todos los campos requeridos.");
        return;
      }

      const validateCourse = this.inventory.some(p => p.course === this.courseName);

      if (validateCourse) {
        this.inventoryId = this.firestoreAutoId();
        await setDoc(doc(db, "inventory", this.inventoryId), {
          id: this.inventoryId,
          course: this.courseName,
          date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
          reason: this.reason,
          receiver: this.receiver,
          sede: this.sede,
          type: this.typeMovement,
          quantity: this.quantity,
        });

        var inventoryItem = this.inventory.find(item => item.course === this.courseName);

        const docRef = doc(db, "inventory", inventoryItem.id);
        await updateDoc(docRef, {
          quantity: this.typeMovement === "Entrada" ? parseInt(inventoryItem.quantity) + parseInt(this.quantity) : parseInt(inventoryItem.quantity) - parseInt(this.quantity),
        });


      } else {
        this.inventoryId = this.firestoreAutoId();
        await setDoc(doc(db, "inventory", this.inventoryId), {
          id: this.inventoryId,
          course: this.courseName,
          date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
          reason: this.reason,
          receiver: this.receiver,
          sede: this.sede,
          type: "Inventario",
          quantity: this.quantity,
        });

        this.inventoryId = this.firestoreAutoId();
        await setDoc(doc(db, "inventory", this.inventoryId), {
          id: this.inventoryId,
          course: this.courseName,
          date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
          reason: this.reason,
          receiver: this.receiver,
          sede: this.sede,
          type: this.typeMovement,
          quantity: this.quantity,
        });
      }

      this.getInventory();
      this.closeDialogAddMovement();
    }
  }
}
</script>
