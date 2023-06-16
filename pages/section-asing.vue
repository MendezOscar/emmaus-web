<template>
    <v-col class="text-center">
        <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">


        <v-container>
            <v-row>
                <v-card-title class="text-h7 text-md-h5 mr-5 text-lg-h5">Seleccionar seccion</v-card-title>
                <v-combobox v-model="section" :items="sectionsName" label="Seleccione la seccion"></v-combobox>
                <v-btn prepend-icon="mdi-plus" size="x-large" class="ml-5" @click="viewSection()">
                    <v-icon left>
                        mdi-eye
                    </v-icon>MOstrar Seccion</v-btn>
            </v-row>

            <v-row style="justify-content: center;">
                <v-col cols="6" sm="6">
                    <template>
                        <v-card>
                            <v-card-title>
                                Estudiantes sin seccion
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                    hide-details></v-text-field>
                            </v-card-title>
                            <v-data-table :headers="headers" :items="studentsWithOutRevisor" :search="search">
                                <template v-slot:item.actions="{ item }">
                                    <v-icon small class="mr-2" @click="asignStudents(item)">
                                        mdi-plus
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
                <v-col cols="6" sm="6">
                    <template>
                        <v-card>
                            <v-card-title>
                                Estudiantes de la seccion
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                    hide-details></v-text-field>
                            </v-card-title>
                            <v-data-table :headers="sectionHeaders" :items="sectionStudentSelected" :search="search">
                                <template v-slot:item.actions="{ item }">
                                    <v-icon small class="mr-2" @click="deleteItem(item)">
                                        mdi-delete
                                    </v-icon>
                                </template>
                            </v-data-table>
                        </v-card>
                    </template>
                    <v-dialog v-model="dialogDelete" max-width="700px">
                        <v-card>
                            <v-card-title class="text-h5">¿Estas seguro de eliminar este estudiante de la
                                seccion?</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
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
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";

export default {
    mounted() {
        this.getStudents();
        this.getSectons();
    },
    data: () => ({
        snackbar: false,
        dialogDelete: false,
        text: 'Estudiante asignado',
        vertical: true,
        dialog: false,
        dialogDelete: false,
        search: '',
        section: '',
        course: '',
        headers: [
            {
                text: 'Nombre',
                align: 'start',
                sortable: false,
                value: 'name',
            },
            { text: 'Asamblea', value: 'church' },
            { text: 'Acciones', value: 'actions', sortable: false },
        ],
        sectionHeaders: [
            {
                text: 'Nombre',
                align: 'start',
                sortable: false,
                value: 'nameStudent',
            },
            { text: 'Seccion', value: 'sectionId' },
            { text: 'Curso', value: 'course' },
            { text: 'Acciones', value: 'actions', sortable: false },
        ],
        students: [],
        studentsWithOutRevisor: [],

        sectionsName: [],
        sections: [],
        openSections: [],

        studentsId: "",
        sectionId: "",

        studentSection: '',
        sectionStudent: [],
        sectionStudentSelected: []
    }),
    methods: {
        async getStudents() {
            this.students = [];
            this.studentsWithOutRevisor = [];
            const querySnapshot = await getDocs(collection(db, "students"));
            querySnapshot.forEach((doc) => {
                this.students.push(doc.data());
            });
            this.students.forEach(element => {
                if (element.currentCourse == "")
                    this.studentsWithOutRevisor.push(element);
            });
        },
        async getSectons() {
            this.sections = [];
            this.sectionsName = [];
            const querySnapshot = await getDocs(collection(db, "sections"));
            querySnapshot.forEach((doc) => {
                this.sections.push(doc.data());
            });
            this.sections.forEach(element => {
                if (element.status === "En curso")
                    this.sectionsName.push(element.id + '-' + element.courseName + '-' + element.revisorName);
            });
        },

        async getSectionStudents() {
            this.sectionStudent = [];
            this.sectionStudentSelected = [];
            const querySnapshot = await getDocs(collection(db, "section-student"));
            querySnapshot.forEach((doc) => {
                this.sectionStudent.push(doc.data());
            });

            var sectionSelected = this.section.split('-');
            this.sectionId = sectionSelected[0];

            this.sectionStudent.forEach(element => {
                if (element.sectionId === this.sectionId)
                    this.sectionStudentSelected.push(element);
            });
        },
        async asignStudents(item) {
            if (this.section != "") {
                var sectionSelected = this.section.split('-');
                this.sectionId = sectionSelected[0];
                this.course = sectionSelected[1];

                await setDoc(doc(db, "section-student", item.dni + "-" + this.sectionId), {
                    sectionId: this.sectionId,
                    course: this.course,
                    nameStudent: item.name,
                    dniStudent: item.dni
                });
                const docRef = doc(db, "students", item.dni);
                await updateDoc(docRef, {
                    currentCourse: this.course
                });
                this.snackbar = true;
                this.getStudents();
                this.getSectionStudents();
            } else {
                this.text = "Seleccione primero una seccion"
                this.snackbar = true;
            }
        },

        viewSection() {
            if (this.section != "") {
                this.getSectionStudents();
            } else {
                this.text = "Seleccione primero una seccion"
                this.snackbar = true;
            }
        },

        deleteItem(item) {
            this.dialogDelete = true;
            this.studentSection = item;
        },

        async deleteItemConfirm() {
            await deleteDoc(doc(db, "section-student", this.studentSection.dniStudent + '-' + this.studentSection.sectionId));
            const docRef = doc(db, "students", this.studentSection.dniStudent);
            await updateDoc(docRef, {
                currentCourse: ""
            });
            this.closeDelete();
        },

        closeDelete() {
            this.dialogDelete = false;
            this.getSectionStudents();
            this.getStudents();
        },
    }
}
</script>