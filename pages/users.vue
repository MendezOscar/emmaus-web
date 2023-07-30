<template>
    <v-col class="text-center">
        <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">

        <v-container>
            <v-row style="justify-content: center;">
                <v-col cols="12" sm="12">
                    <template>
                        <v-card>
                            <v-card-title>
                                Usuarios
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                    hide-details></v-text-field>

                                <v-col cols="auto ml-5">
                                    <v-btn prepend-icon="mdi-plus" size="x-large" @click="add()">
                                        <v-icon left>
                                            mdi-plus
                                        </v-icon>Agregar
                                        Usuario</v-btn>
                                </v-col>

                            </v-card-title>
                            <v-data-table :headers="headers" :items="users" :search="search">
                                <template v-slot:item.actions="{ item }">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon dark v-bind="attrs" v-on="on">
                                                mdi-pencil
                                            </v-icon>
                                        </template>
                                        <span>Editar usuario</span>
                                    </v-tooltip>

                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon dark v-bind="attrs" v-on="on">
                                                mdi-delete
                                            </v-icon>
                                        </template>
                                        <span>Delete usuario</span>
                                    </v-tooltip>
                                </template>
                            </v-data-table>
                        </v-card>
                        <v-dialog v-model="dialog" max-width="1300px">
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">Usuario</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" md="4">
                                                <v-text-field label="Correo" v-model="email" required></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                <v-text-field label="Password" type="password" v-model="password"
                                                    required></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                <v-text-field label="Nombre" v-model="displayName" required></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                <v-text-field label="Telefono" v-model="phoneNumber"
                                                    required></v-text-field>
                                            </v-col>
                                            <v-col cols="6" md="4">
                                                <v-combobox v-model="userType" :items="userTypes"
                                                    label="Seleccione el tipo de usuario"></v-combobox>
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
import { auth, db, createUserWithEmailAndPassword } from '@/plugins/firebase'
import { collection, getDocs, setDoc, doc } from "firebase/firestore";


export default {
    mounted() {
        this.getUsers();
    },
    data: () => ({
        saveMode: true,
        dialog: false,
        email: '',
        password: '',
        displayName: '',
        userType: '',
        phoneNumber: '',
        userTypes: ['Administrador', 'Revisor', 'Estudiante'],

        search: '',
        headers: [
            {
                text: 'Nombre',
                align: 'start',
                sortable: false,
                value: 'displayName',
            },
            { text: 'Correo', value: 'email' },
            { text: 'Telefono', value: 'phoneNumber' },
            { text: 'Tipo', value: 'userType' },
            { text: 'Acciones', value: 'actions', sortable: false },
        ],
        users: []
    }),
    methods: {
        async createUser() {
            createUserWithEmailAndPassword(auth, this.email, this.password)
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
            await setDoc(doc(db, "users", this.phoneNumber), {
                displayName: this.displayName,
                email: this.email,
                phoneNumber: this.phoneNumber,
                userType: this.userType
            });
        },

        async getUsers() {
            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => {
                this.users.push(doc.data());
            });
        },

        add() {
            this.dialog = true;
        },
        async save() {
            if (this.saveMode) {
                this.addUser();
                this.createUser();
                this.users = [];
                this.getUsers();
            }
            this.dialog = false
        },
        close() {
            this.dialog = false
        },
    },
}
</script>