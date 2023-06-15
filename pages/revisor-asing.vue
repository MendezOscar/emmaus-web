<template>
    <v-col class="text-center">
        <img width="250" height="300" src="/Emmaus.png" alt="Vuetify.js" class="mb-5">


        <v-container>
            <v-row style="justify-content: center;">
                <v-col cols="12" sm="12">
                    <template>
                        <v-card>
                            <v-card-title>
                                Asignar revisor
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                    hide-details></v-text-field>
                            </v-card-title>
                            <v-data-table :headers="headers" :items="studentsWithOutRevisor" :search="search">
                                <template v-slot:item.revisor="{ item }">
                                    <v-select v-model="revisor" :items="revisorsName"></v-select>
                                </template>
                                <template v-slot:item.actions="{ item }">
                                    <v-icon small class="mr-2" @click="asignRevisor(item)">
                                        mdi-application-edit
                                    </v-icon>
                                </template>
                            </v-data-table>
                        </v-card>
                    </template>
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
        </v-container>
    </v-col>
</template>

<script>
import { db } from "~/plugins/firebase.js";
import { collection, getDocs, doc, updateDoc, setDoc } from "firebase/firestore";

export default {
    mounted() {
        this.getStudents();
        this.getRevisors();
    },
    data: () => ({
        snackbar: false,
        text: 'Revisor asignado',
        vertical: true,
        dialog: false,
        dialogDelete: false,
        search: '',
        revisor: '',
        headers: [
            {
                text: 'Nombre',
                align: 'start',
                sortable: false,
                value: 'name',
            },
            { text: 'Asamblea', value: 'church' },
            { text: 'Ministerios', value: 'churchDones' },
            { text: 'Revisores', value: 'revisor', sortable: false },
            { text: 'Acciones', value: 'actions', sortable: false },
        ],
        students: [],
        studentsWithOutRevisor: [],
        revisorsName: [],
        revisors: [],
        studentsId: "",
        dniRevisor: ""
    }),
    methods: {
        async getStudents() {
            const querySnapshot = await getDocs(collection(db, "students"));
            querySnapshot.forEach((doc) => {
                this.students.push(doc.data());
            });
            this.students.forEach(element => {
                if (element.currentRevisor == "")
                    this.studentsWithOutRevisor.push(element);
            });
        },
        async getRevisors() {
            const querySnapshot = await getDocs(collection(db, "revisors"));
            querySnapshot.forEach((doc) => {
                this.revisorsName.push(doc.data().name);
                this.revisors.push(doc.data());
            });
        },
        async asignRevisor(item) {
            this.dniRevisor = this.revisors.find(x => x.name == this.revisor).dni;
            await setDoc(doc(db, "revisor-student", item.dni + "-" + this.dniRevisor), {
                dniRevisor: this.dniRevisor,
                namRevisor: this.revisor,
                nameStudent: item.name,
                dniStudent: item.dni
            });
            const docRef = doc(db, "students", item.dni);
            await updateDoc(docRef, {
                currentRevisor: this.revisor
            });
            this.snackbar = true;
            location.reload();
        }
    }
}
</script>