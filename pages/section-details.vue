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
                                            Nivel
                                        </th>
                                        <th class="text-center">
                                            Modulo
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
                                        <td>{{ revisorName }}</td>
                                        <td>{{ course }}</td>
                                        <td>{{ level }}</td>
                                        <td>{{ module }}</td>
                                        <td>{{ sectionId }}</td>
                                        <td>{{ totalStudents }}</td>
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
                            <v-data-table :headers="headers" :items="sectionStudentSelected" :search="search"
                                :single-expand="singleExpand" show-expand class="elevation-1">
                                <template v-slot:item.actions="{ item }">
                                    <v-tooltip top v-if="item.calification != ''">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="ml-2" dark v-bind="attrs" v-on="on">
                                                mdi-printer-settings
                                            </v-icon>
                                        </template>
                                        <span>Generar diploma</span>
                                    </v-tooltip>
                                </template>
                                <template v-slot:expanded-item="{ item }">
                                    <v-list subheader two-line>
                                        <v-subheader inset>Lecciones</v-subheader>
                                        <v-list-item v-for="lesson in item.lessons" :key="lesson.lessonName"
                                            class="justify-list">
                                            <v-list-item-avatar>
                                                <v-icon class="grey lighten-1">
                                                    checkbox-marked-circle-auto-outlineS
                                                </v-icon>
                                            </v-list-item-avatar>

                                            <v-list-item-content>
                                                <v-list-item-title v-text="lesson.lessonName"></v-list-item-title>

                                                <v-list-item-subtitle v-text='lesson.lessonNote'></v-list-item-subtitle>
                                            </v-list-item-content>

                                            <v-list-item-action>

                                                <v-tooltip top>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn icon>
                                                            <v-icon color=" grey lighten-1"
                                                                @click="addCalification(item, lesson)">mdi-playlist-edit</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span>Asignar nota a leccion</span>
                                                </v-tooltip>
                                            </v-list-item-action>
                                        </v-list-item>
                                    </v-list>
                                </template>
                            </v-data-table>
                        </v-card>
                    </template>
                </v-col>
            </v-row>
            <v-dialog v-model="dialog" max-width="700px">
                <v-card>
                    <v-card-title>
                        <span class="text-h5">Curso</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" md="4">
                                    <v-text-field label="Calificacion" v-model="calification" required></v-text-field>
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
        dialog: false,
        calification: '',
        singleExpand: true,
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
            { text: 'Estado', value: 'status' },
            { text: 'Lecciones', value: 'data-table-expand' },
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
        course: "",
        dniStudent: "",
        sectionId: "",
        level: '',
        module: '',
        lessons: [],
        lessonSelected: '',
        lessonStatus: ''
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
                    this.sectionsName.push(element.id + '-' + element.courseName + '-' + element.revisorName + '-' + element.level + "-" + element.module);
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

            this.level = sectionSelected[3];
            this.module = sectionSelected[4];

            this.sectionStudent.forEach(element => {
                if (element.sectionId === this.sectionId)
                    this.sectionStudentSelected.push(element);
            });

            this.totalStudents = this.sectionStudentSelected.length;

        },

        addCalification(item, lesson) {
            this.dialog = true;
            this.dniStudent = item.dniStudent
            this.sectionId = item.sectionId
            this.lessonSelected = lesson

            this.lessons.push(item.lessons);
        },

        async viewSection() {
            if (this.section != "") {
                await this.getSectionStudents();
            } else {
                this.text = "Seleccione primero una seccion"
                this.snackbar = true;
            }
        },

        async save() {
            if (this.calification > 69) {
                this.lessonStatus = "APROBADA"
            } else {
                this.lessonStatus = "REPROBADA"
            }
            this.lessons[0].map((dato) => {
                if (dato.lessonName === this.lessonSelected.lessonName) {
                    dato.lessonNote = this.calification;
                    dato.lessonStatus = this.lessonStatus;
                }
            });
            const docRef = doc(db, "section-student", this.dniStudent + "-" + this.sectionId);
            await updateDoc(docRef, {
                lessons: this.lessons[0]
            });

            var lessonCount = this.lessons[0].length;
            var lessonAproved = 0;
            this.lessons[0].forEach((item) => {
                if (item.lessonStatus == "APROBADA") {
                    lessonAproved++;
                }
            })

            if (lessonCount == lessonAproved) {
                const docRef = doc(db, "section-student", this.dniStudent + "-" + this.sectionId);
                await updateDoc(docRef, {
                    status: "FINALIZADA"
                });
            }

            this.dialog = false
        },

        close() {
            this.dialog = false
        }
    }
}
</script>

<style>
.justify-list {
    text-align: justify;
}
</style>