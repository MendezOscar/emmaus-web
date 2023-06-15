<template>
    <v-col class="text-center">
        <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">
        <v-card-title class="text-h7 text-md-h5 text-lg-h5">Registro de revisor</v-card-title>


        <v-form>
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
                    <v-col cols="6" md="2">
                        <v-text-field label="Teléfono (sin guiones)" v-model="phone" required></v-text-field>
                    </v-col>

                    <v-col cols="6" md="2">
                        <v-text-field label="Profesión u oficio" v-model="ocupation" required></v-text-field>
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
                </v-row>
            </v-container>
            <v-container>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-text-field label="Identidad (sin guiones)" v-model="dni" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field label="Nombre de asamblea" v-model="church" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-text-field label="Ministerios en asamblea" v-model="churchDones" required></v-text-field>
                    </v-col>
                </v-row>
            </v-container>
            <v-btn class="mr-4" @click="register()">
                Guardar
            </v-btn>
            <v-btn @click="clear()">
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
</template>

<script>
import { db } from "~/plugins/firebase.js";
import { doc, setDoc } from "firebase/firestore";


export default {
    data() {
        return {
            dialog: false,
            dialogDelete: false,
            snackbar: false,
            text: 'Registro exitoso',
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

            date: null,
            menu: false,
            modal: false,
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
        }
    },
    methods: {
        async register() {
            await setDoc(doc(db, "revisors", this.dni), {
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
                dni: this.dni
            });
            this.snackbar = true;
            this.clear();
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
            this.dni = "";
        },
    },
}
</script>