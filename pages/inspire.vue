<template>
    <v-col class="text-center">
        <img width="250" height="300" src="/Emmaus.png" alt="Vuetify.js" class="mb-5">

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
import { auth, signInWithEmailAndPassword } from '@/plugins/firebase'

export default {
    data: () => ({
        email: '',
        password: '',
        snackbar: false,
        text: 'Bienvenido',
        vertical: true,
    }),
    methods: {
        login() {
            signInWithEmailAndPassword(auth, this.email, this.password).then((data) => {
                this.snackbar = true;
                location.reload();
                localStorage.setItem("login", "true");
                this.clear();
            })
                .catch(error => {
                    console.log(error.code)
                    alert(error.message);
                });
        },
        clear() {
            this.email = "";
            this.password = "";
        }
    }
}
</script>