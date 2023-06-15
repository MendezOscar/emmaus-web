<template>
    <v-col class="text-center">
        <img width="250" height="300" src="/Emmaus.png" alt="Vuetify.js" class="mb-5">


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
                            </v-card-title>
                            <v-data-table :headers="headers" :items="students" :search="search">
                                <template v-slot:item.actions="{ item }">
                                    <v-icon small class="mr-2" @click="editItem(item)">
                                        mdi-pencil
                                    </v-icon>
                                    <v-icon small @click="deleteItem(item)">
                                        mdi-delete
                                    </v-icon>
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
                                            <v-col cols="12" md="4">
                                                <v-text-field label="Nombre completo" v-model="name"
                                                    required></v-text-field>
                                            </v-col>

                                            <v-col cols="12" md="4">
                                                <v-text-field label="Dirección" v-model="location" required></v-text-field>
                                            </v-col>

                                            <v-col cols="12" md="4">
                                                <v-text-field label="Correo" v-model="email" :rules="emailRules"
                                                    required></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="6" md="2">
                                                <v-text-field label="Teléfono (sin guiones)" v-model="phone"
                                                    required></v-text-field>
                                            </v-col>

                                            <v-col cols="6" md="2">
                                                <v-text-field label="Profesión u oficio" v-model="ocupation"
                                                    required></v-text-field>
                                            </v-col>

                                            <v-col cols="6" md="2">
                                                <v-combobox v-model="education" :items="educationItems"
                                                    label="Seleccione su nivel de educación"></v-combobox>
                                            </v-col>
                                            <v-col cols="6" md="2">
                                                <v-combobox v-model="civilStatus" :items="civilStatusItem"
                                                    label="Seleccione su estado civil"></v-combobox>
                                            </v-col>

                                            <v-col cols="12" md="4">
                                                <v-menu ref="menu" v-model="menu" :close-on-content-click="false"
                                                    :return-value.sync="date" transition="scale-transition" offset-y
                                                    min-width="auto">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field v-model="date"
                                                            label="Seleccione su fecha de nacimiento"
                                                            prepend-icon="mdi-calendar" readonly v-bind="attrs"
                                                            v-on="on"></v-text-field>
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
                                        </v-row>
                                    </v-container>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" md="4">
                                                <v-text-field label="Identidad (sin guiones)" v-model="dni"
                                                    required></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                <v-text-field label="Nombre de asamblea" v-model="church"
                                                    required></v-text-field>
                                            </v-col>

                                            <v-col cols="12" md="4">
                                                <v-text-field label="Ministerios en asamblea" v-model="churchDones"
                                                    required></v-text-field>
                                            </v-col>

                                            <v-col cols="12" md="4">
                                                <v-combobox v-model="currentRevisor" :items="revisorsName"
                                                    label="Revisor"></v-combobox>
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
import { collection, getDocs, doc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";

export default {
    mounted() {
        this.getStudents();
        this.getRevisors();
    },
    data: () => ({
        changeRevisor: false,
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
            { text: 'Ministerios', value: 'churchDones' },
            { text: 'Direccion', value: 'location' },
            { text: 'Telefono', value: 'phone' },
            { text: 'Revisor actual', value: 'currentRevisor' },
            { text: 'Acciones', value: 'actions', sortable: false },
        ],
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
        church: "",
        dni: "",
        currentRevisor: "",

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
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        revisorsName: [],
        revisors: [],
        dniRevisor: ""
    }),
    methods: {
        async getStudents() {
            const querySnapshot = await getDocs(collection(db, "students"));
            querySnapshot.forEach((doc) => {
                this.students.push(doc.data());
            });
        },
        async getRevisors() {
            const querySnapshot = await getDocs(collection(db, "revisors"));
            querySnapshot.forEach((doc) => {
                this.revisors.push(doc.data());
                this.revisorsName.push(doc.data().name);
            });
        },
        deleteItem(item) {
            this.studentsId = item;
            this.dialogDelete = true;
        },

        async deleteItemConfirm() {
            await deleteDoc(doc(db, "students", this.studentsId.dni));
            this.closeDelete();
        },

        close() {
            this.dialog = false
        },

        closeDelete() {
            this.dialogDelete = false;
            location.reload();
        },

        close() {
            this.dialog = false
        },
        editItem(item) {
            if (item.currentRevisor != this.currentRevisor)
                this.changeRevisor = true
            this.dialog = true;
            this.name = item.name;
            this.location = item.location;
            this.email = item.email;
            this.phone = item.phone;
            this.ocupation = item.ocupation;
            this.civilStatus = item.civilStatus;
            this.education = item.educationLevel;
            this.dateOfBirth = Date(item.dateOfBirth);
            this.churchDones = item.churchDones;
            this.church = item.church;
            this.dni = item.dni;
            this.currentRevisor = item.currentRevisor;
        },

        async save() {
            const docRef = doc(db, "students", this.dni);
            await updateDoc(docRef, {
                name: this.name,
                location: this.location,
                email: this.email,
                phone: this.phone,
                ocupation: this.ocupation,
                educationLevel: this.education,
                civilStatus: this.civilStatus,
                dateOfBirth: this.date,
                churchDones: this.churchDones,
                church: this.church,
                dni: this.dni,
                currentRevisor: this.currentRevisor,
            });

            if (this.changeRevisor) {
                this.dniRevisor = this.revisors.find(x => x.name == this.currentRevisor).dni;
                await setDoc(doc(db, "revisor-student", this.dni + "-" + this.dniRevisor), {
                    dniRevisor: this.dniRevisor,
                    namRevisor: this.currentRevisor,
                    nameStudent: this.name,
                    dniStudent: this.dni
                });
            }
            location.reload();
            this.dialog = false
        }
    }
}
</script>