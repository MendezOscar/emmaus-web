<template>
    <v-col class="text-center">
        <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">

        <v-form>
            <v-container>
                <v-row style="justify-content: center;">
                    <v-col cols="12" sm="6">
                        <v-card-title style="justify-content: center;"
                            class="text-h7 text-md-h5 text-lg-h5">Ingreso</v-card-title>
                    </v-col>
                </v-row>
                <v-row style="justify-content: center;">
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="email" label="Usuario" outlined shaped></v-text-field>
                    </v-col>
                </v-row>
                <v-row style="justify-content: center;">
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="password" type="password" label="Contraseña" outlined shaped></v-text-field>
                    </v-col>
                </v-row>
                <v-row style="justify-content: center;">
                    <v-col cols="12" sm="6">
                        <v-btn class="mr-4" @click="login()">
                            Ingresar
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
        <v-snackbar v-model="snackbar" :vertical="vertical">
            {{ text }}

            <template v-slot:action="{ attrs }">
                <v-btn color="indigo" text v-bind="attrs" @click="snackbar = false">
                    Cerrar
                </v-btn>
            </template>
        </v-snackbar>
    </v-col>
</template>

<script>
import { auth, signInWithEmailAndPassword, db } from '@/plugins/firebase'
import { collection, getDocs } from "firebase/firestore";


export default {
    data: () => ({
        email: '',
        password: '',
        snackbar: false,
        text: 'Bienvenido',
        vertical: true,
        user: [],
        users: [],
    }),
    methods: {
        login() {
            signInWithEmailAndPassword(auth, this.email, this.password).then((data) => {
                this.snackbar = true;
                localStorage.setItem("login", "true");
                localStorage.setItem("user", data.user.email);
                this.getUsers();

                this.clear();
            })
                .catch(error => {
                    console.log(error.code)
                    alert(error.message);
                });
        },

        async getUsers() {
            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => {
                this.users.push(doc.data());

            });

            const userEmail = localStorage.getItem("user");

            this.users.forEach(element => {
                if (element.email == userEmail) {
                    this.user.push(element);
                }
            });
            localStorage.setItem("userType", this.user[0].userType);
            localStorage.setItem("userDni", this.user[0].dni);
            localStorage.setItem("userName", this.user[0].displayName);
            location.reload();


        },
        clear() {
            this.email = "";
            this.password = "";
        }
    }
}
</script>