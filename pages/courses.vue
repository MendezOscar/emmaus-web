<template>
    <v-col class="text-center">
        <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">
        <v-container>
            <v-row style="justify-content: center;">
                <v-col cols="12" sm="12">
                    <template>
                        <v-card>
                            <v-card-title>
                                Cursos
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                    hide-details></v-text-field>

                                <v-col cols="auto ml-5">
                                    <v-btn prepend-icon="mdi-plus" size="x-large" @click="add()">
                                        <v-icon left>
                                            mdi-plus
                                        </v-icon>Agregar
                                        curso</v-btn>
                                </v-col>

                            </v-card-title>
                            <v-data-table :headers="headers" :items="courses" :search="search" show-expand>
                                <template v-slot:item.actions="{ item }">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon dark v-bind="attrs" v-on="on" @click="editItem(item)">
                                                mdi-pencil
                                            </v-icon>
                                        </template>
                                        <span>Editar curso</span>
                                    </v-tooltip>
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon dark v-bind="attrs" v-on="on" @click="deleteItem(item)">
                                                mdi-delete
                                            </v-icon>
                                        </template>
                                        <span>Eliminar curso</span>
                                    </v-tooltip>
                                </template>
                                <template v-slot:expanded-item="{ headers, item }">
                                    <td :colspan="headers.length" class="justify-description">
                                        Descripcion del curso : {{ item.description }}
                                    </td>
                                </template>
                            </v-data-table>
                        </v-card>
                        <v-dialog v-model="dialogDelete" max-width="600px">
                            <v-card>
                                <v-card-title class="text-h5">¿Estas seguro de eliminar este curso?</v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <v-dialog v-model="dialog" max-width="1500px">
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">Curso</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="6" md="4">
                                                <v-combobox v-model="module" :items="modules"
                                                    label="Seleccione el modulo del curso"></v-combobox>
                                            </v-col>

                                            <v-col cols="12" md="4">
                                                <v-text-field label="Identificador del curso" v-model="code"
                                                    required></v-text-field>
                                            </v-col>

                                            <v-col cols="12" md="4">
                                                <v-text-field label="Codigo del curso" v-model="id" required></v-text-field>
                                            </v-col>

                                            <v-col cols="12" md="4">
                                                <v-text-field label="Secuencia dentro del modulo" v-model="sequence"
                                                    required></v-text-field>
                                            </v-col>

                                            <v-col cols="12" md="4">
                                                <v-text-field label="Nombre del curso" v-model="name"
                                                    required></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-textarea v-model="description" counter label="Description del curso" maxlength="900"
                                                single-line></v-textarea>
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
import { collection, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";

export default {
    mounted() {
        this.Courses();
        this.getModules();
    },
    data: () => ({
        saveMode: true,
        dialog: false,
        dialogDelete: false,
        search: '',
        course: '',
        code: '',
        headers: [
            {
                text: 'Nombre',
                align: 'start',
                sortable: false,
                value: 'name',
            },
            { text: 'Modulo', value: 'module' },
            { text: 'Level', value: 'level' },
            { text: 'Secuencia', value: 'sequence' },
            { text: 'Codigo', value: 'code' },
            { text: 'Descripcion', value: 'data-table-expand' },
            { text: 'Acciones', value: 'actions', sortable: false },
        ],
        description: '',
        name: "",
        module: "",
        id: "",
        level: '',
        courses: [],
        sequence: '',

        modal: false,
        modules: [],
    }),
    methods: {
        async Courses() {
            this.courses = [];
            const querySnapshot = await getDocs(collection(db, "courses"));
            querySnapshot.forEach((doc) => {
                this.courses.push(doc.data());
            });
        },

        async getModules() {
            const querySnapshot = await getDocs(collection(db, "module"));
            querySnapshot.forEach((doc) => {
                this.modules.push(doc.data().level + '-' + doc.data().name);
            });
        },
        deleteItem(item) {
            this.course = item;
            this.dialogDelete = true;
        },

        async deleteItemConfirm() {
            await deleteDoc(doc(db, "courses", this.course.id));
            this.closeDelete();
        },

        close() {
            this.dialog = false
        },

        closeDelete() {
            this.dialogDelete = false;
            this.Courses();
        },

        editItem(item) {
            this.dialog = true;
            this.saveMode = false;
            this.name = item.name;
            this.module = item.level + '-' + item.module;
            this.code = item.code
            this.sequence = item.sequence
            this.description = item.description
        },

        add() {
            this.dialog = true;
        },

        async save() {
            var levelName = this.module.split('-')[0];
            var moduleName = this.module.split('-')[1];
            if (this.saveMode) {
                await setDoc(doc(db, "courses", this.id), {
                    name: this.name,
                    module: moduleName,
                    level: levelName,
                    id: this.id,
                    code: this.code,
                    sequence: this.sequence,
                    description: this.description
                });
            } else {
                const docRef = doc(db, "courses", this.id);
                await updateDoc(docRef, {
                    name: this.name,
                    module: moduleName,
                    level: levelName,
                    id: this.id,
                    code: this.code,
                    sequence: this.sequence,
                    description: this.description
                });
            }
            this.Courses();
            this.dialog = false
        }
    }
}
</script>

<style>
.justify-description {
    text-align: justify;
}
</style>