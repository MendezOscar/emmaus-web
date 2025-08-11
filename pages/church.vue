<template>
  <v-col class="text-center">
    <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">
    <v-container>
      <v-row style="justify-content: center;">
        <v-col cols="12" sm="12">
          <template>
            <v-card>
              <v-card-title>
                Iglesia
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                  hide-details></v-text-field>

                <v-col cols="auto ml-5">
                  <v-btn prepend-icon="mdi-plus" size="x-large" @click="add()">
                    <v-icon left>
                      mdi-plus
                    </v-icon>Agregar
                    iglesia</v-btn>
                </v-col>

              </v-card-title>
              <v-data-table :headers="headers" :items="churches" :search="search">
                <template v-slot:item.actions="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="editItem(item)">
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>Editar iglesia</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon dark v-bind="attrs" v-on="on" @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>
                    </template>
                    <span>Eliminar iglesia</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-card>
            <v-dialog v-model="dialogDelete" max-width="800px">
              <v-card>
                <v-card-title class="text-h5">¿Estas seguro de eliminar este iglesia?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialog" max-width="800px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Nueva Iglesia</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field label="Id de la iglesia" v-model="churchId" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field label="Nombre de la iglesia" v-model="churchName" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-combobox v-model="department" :items="departmentItems"
                          label="Seleccione el departamento"></v-combobox>
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
import { db } from "~/plugins/firebase.js";
import readXlsxFile from "read-excel-file";
import { collection, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";

export default {
  mounted() {
    this.getChurches();
  },
  data: () => ({
    saveMode: true,
    dialog: false,
    dialogDelete: false,
    search: '',
    churchId: '',
    churchName: '',
    church: '',
    churches: [],
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
    headers: [
      {
        text: 'Nombre',
        align: 'start',
        sortable: false,
        value: 'church',
      },
      { text: 'Departamento', value: 'department' },
      { text: 'Id', value: 'id' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    dataFromFile: []
  }),
  methods: {
    uploadFromFile() {
      const input = document.getElementById("fileData");
      readXlsxFile(input.files[0]).then((rows) => {
        rows.forEach((item) => this.dataFromFile.push(item));
      });
    },
    async saveFromFile() {
      if (this.dataFromFile.size != 0) {
        this.dataFromFile.forEach(async (item) => {
          await setDoc(doc(db, "church", item[0]), {
            church: item[1],
            id: item[0],
          });
        });
        this.getChurches();
      }
    },
    async getChurches() {
      this.churches = [];
      const querySnapshot = await getDocs(collection(db, "church"));
      querySnapshot.forEach((doc) => {
        this.churches.push(doc.data());
      });
      this.churches = this.churches.sort((a, b) => a.id.localeCompare(b.id));
      this.churchId = this.churches[this.churches.length - 1].id;
    },
    deleteItem(item) {
      this.church = item;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await deleteDoc(doc(db, "church", this.church.id));
      this.closeDelete();
    },

    close() {
      this.dialog = false
    },

    closeDelete() {
      this.dialogDelete = false;
      this.getChurches();
    },

    editItem(item) {
      this.dialog = true;
      this.churchName = item.church;
      this.department = item.department;
    },

    add() {
      this.dialog = true;
    },

    async save() {
      if (this.churchId === '' || this.churchName === '' || this.department === '') {
        alert("Por favor, complete todos los campos.");
        return;
      }
      if (this.churches.some(church => church.id === this.churchId)) {
        alert("La iglesia ya existe, usar otro ID.");
        return;
      }
      if (this.saveMode) {
        await setDoc(doc(db, "church", this.churchId), {
          church: this.churchName,
          id: this.churchId,
          department: this.department
        });
      } else {
        const docRef = doc(db, "church", this.churchId);
        await updateDoc(docRef, {
          church: this.churchName,
          department: this.department
        });
      }
      this.getChurches();
      this.dialog = false
    }
  }
}
</script>
