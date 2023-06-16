<template>
    <v-col class="text-center">
        <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">

        <v-container>
            <v-row>
                <v-card-title class="text-h8 text-md-h7 mr-5 text-lg-h7">Seleccionar seccion</v-card-title>
                <v-combobox v-model="section" :items="sectionsName" label=""></v-combobox>
                <v-btn prepend-icon="mdi-plus" size="x-large" class="ml-5" @click="viewSection()">
                    <v-icon left>
                        mdi-eye
                    </v-icon>Mostrar Seccion</v-btn>
            </v-row>
            <v-row>
                <v-col>
                    <template>
                        <v-simple-table>
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-center">
                                            Revisor
                                        </th>
                                        <th class="text-center">
                                            Curso
                                        </th>
                                        <th class="text-center">
                                            Seccion
                                        </th>
                                        <th class="text-center">
                                            Total de estudiantes
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{{revisorName}}</td>
                                        <td>{{course}}</td>
                                        <td>{{sectionId}}</td>
                                        <td>{{totalStudents}}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </template>
                </v-col>
            </v-row>

            <v-row>
                <v-col></v-col>
            </v-row>

            <v-row style="justify-content: center;">
                <v-col cols="12" sm="12">
                    <template>
                        <v-card>
                            <v-data-table :headers="headers" :items="sectionStudentSelected" :search="search">
                                <template v-slot:item.actions="{ item }">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon dark v-bind="attrs" v-on="on">
                                                mdi-pencil
                                            </v-icon>
                                        </template>
                                        <span>Asignar nota</span>
                                    </v-tooltip>
                                </template>
                            </v-data-table>
                        </v-card>
                    </template>
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
        this.getSectons();
    },
    data: () => ({
        search: '',
        section: '',
        headers: [
            {
                text: 'Nombre',
                align: 'start',
                sortable: false,
                value: 'nameStudent',
            },
            { text: 'Seccion', value: 'sectionId' },
            { text: 'Curso', value: 'course' },
            { text: 'Nota', value: 'note' },
            { text: 'Acciones', value: 'actions' },
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
        sectionStudentSelected: [],

        revisorName: "",
        totalStudents: "",
        course: ""
    }),
    methods: {
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

            this.revisorName = sectionSelected[2];
            this.course = sectionSelected[1];

            this.sectionStudent.forEach(element => {
                if (element.sectionId === this.sectionId)
                    this.sectionStudentSelected.push(element);
            });

            this.totalStudents = this.sectionStudentSelected.length;
        },

        viewSection() {
            if (this.section != "") {
                this.getSectionStudents();
            } else {
                this.text = "Seleccione primero una seccion"
                this.snackbar = true;
            }
        },
    }
}
</script>