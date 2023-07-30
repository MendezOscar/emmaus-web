<template>
    <v-row>
        <v-col class="text-center">
            <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">

            <v-card>
                <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
                    <v-tab :value="1">Todo</v-tab>
                    <v-tab :value="2">Actual</v-tab>
                    <v-tab :value="3">Terminado</v-tab>
                </v-tabs>
                <v-window v-model="tab">
                    <v-window-item :value="0">
                        <v-container fluid>
                            <v-row justify="space-around">
                                <v-card width="400">
                                    <v-img height="200px"
                                        src="https://ministeriointernacional.com/wp-content/uploads/2023/06/%C2%BFComo-acercarme-a-Dios.webp">
                                        <v-app-bar flat color="rgba(0, 0, 0, 0)">

                                            <v-toolbar-title class="text-h6 white--text pl-0">
                                                NIVEL ELEMENTAL
                                            </v-toolbar-title>

                                            <v-spacer></v-spacer>

                                        </v-app-bar>

                                        <v-card-title class="white--text mt-8">
                                            <p class="ml-3">
                                            </p>
                                        </v-card-title>
                                    </v-img>

                                    <v-card-text>
                                        <div class="font-weight-bold ml-8 mb-2">
                                            Modulos
                                        </div>
                                    </v-card-text>

                                    <v-card-actions v-for="( module, index) in moduleElemtary">

                                        <v-btn v-if="index === 0" color="orange-lighten-2" variant="text"
                                            @click="show1 = !show1">
                                            {{ module.name }}
                                        </v-btn>
                                        <v-btn v-if="index === 1" color="orange-lighten-2" variant="text"
                                            @click="show2 = !show2">
                                            {{ module.name }}
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>

                                    <v-expand-transition>
                                        <div v-show="show1">
                                            <v-divider></v-divider>
                                            <v-timeline align-top dense>
                                                <v-timeline-item v-for="course in coursesModule1" small>
                                                    <div>
                                                        <div class="font-weight-normal">
                                                            <strong>{{ course.name }}</strong>
                                                        </div>
                                                    </div>
                                                </v-timeline-item>
                                            </v-timeline>
                                        </div>
                                    </v-expand-transition>

                                    <v-expand-transition>
                                        <div v-show="show2">
                                            <v-divider></v-divider>
                                            <v-timeline align-top dense>
                                                <v-timeline-item v-for="course in coursesModule2" small>
                                                    <div>
                                                        <div class="font-weight-normal">
                                                            <strong>{{ course.name }}</strong>
                                                        </div>
                                                    </div>
                                                </v-timeline-item>
                                            </v-timeline>
                                        </div>
                                    </v-expand-transition>
                                </v-card>

                                <v-card width="400">
                                    <v-img height="200px"
                                        src="https://teologiasana.com/wp-content/uploads/2022/02/crecimiento-espiritual.jpg">
                                        <v-app-bar flat color="rgba(0, 0, 0, 0)">

                                            <v-toolbar-title class="text-h6 white--text pl-0">
                                                NIVEL BÁSICO
                                            </v-toolbar-title>

                                            <v-spacer></v-spacer>

                                        </v-app-bar>

                                        <v-card-title class="white--text mt-8">
                                            <p class="ml-3">
                                            </p>
                                        </v-card-title>
                                    </v-img>

                                    <v-card-text>
                                        <div class="font-weight-bold ml-8 mb-2">
                                            Modulos
                                        </div>
                                    </v-card-text>

                                    <v-card-actions v-for="( module, index) in moduleBasic">

                                        <v-btn v-if="index === 0" color="orange-lighten-2" variant="text"
                                            @click="show3 = !show3">
                                            {{ module.name }}
                                        </v-btn>
                                        <v-btn v-if="index === 1" color="orange-lighten-2" variant="text"
                                            @click="show4 = !show4">
                                            {{ module.name }}
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>

                                    <v-expand-transition>
                                        <div v-show="show3">
                                            <v-divider></v-divider>
                                            <v-timeline align-top dense>
                                                <v-timeline-item v-for="course in coursesModule3" small>
                                                    <div>
                                                        <div class="font-weight-normal">
                                                            <strong>{{ course.name }}</strong>
                                                        </div>
                                                    </div>
                                                </v-timeline-item>
                                            </v-timeline>
                                        </div>
                                    </v-expand-transition>

                                    <v-expand-transition>
                                        <div v-show="show4">
                                            <v-divider></v-divider>
                                            <v-timeline align-top dense>
                                                <v-timeline-item v-for="course in coursesModule4" small>
                                                    <div>
                                                        <div class="font-weight-normal">
                                                            <strong>{{ course.name }}</strong>
                                                        </div>
                                                    </div>
                                                </v-timeline-item>
                                            </v-timeline>
                                        </div>
                                    </v-expand-transition>
                                </v-card>

                                <v-card width="400">
                                    <v-img height="200px"
                                        src="https://www.umnews.org/-/media/umc-media/2019/10/21/19/40/spanish-bible-anniversary-hands-umnews-2019-3500.ashx?mw=1200&hash=9CF5CFAE7254A29AC0218AD0234FA68A343156D1">
                                        <v-app-bar flat color="rgba(0, 0, 0, 0)">

                                            <v-toolbar-title class="text-h6 white--text pl-0">
                                                NIVEL INTERMEDIO
                                            </v-toolbar-title>

                                            <v-spacer></v-spacer>

                                        </v-app-bar>

                                        <v-card-title class="white--text mt-8">
                                            <p class="ml-3">
                                            </p>
                                        </v-card-title>
                                    </v-img>

                                    <v-card-text>
                                        <div class="font-weight-bold ml-8 mb-2">
                                            Modulos
                                        </div>
                                    </v-card-text>

                                    <v-card-actions v-for="( module, index) in muduleIntermediate">

                                        <v-btn v-if="index === 0" color="orange-lighten-2" variant="text"
                                            @click="show5 = !show5">
                                            {{ module.name }}
                                        </v-btn>
                                        <v-btn v-if="index === 1" color="orange-lighten-2" variant="text"
                                            @click="show6 = !show6">
                                            {{ module.name }}
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>

                                    <v-expand-transition>
                                        <div v-show="show5">
                                            <v-divider></v-divider>
                                            <v-timeline align-top dense>
                                                <v-timeline-item v-for="course in coursesModule5" small>
                                                    <div>
                                                        <div class="font-weight-normal">
                                                            <strong>{{ course.name }}</strong>
                                                        </div>
                                                    </div>
                                                </v-timeline-item>
                                            </v-timeline>
                                        </div>
                                    </v-expand-transition>

                                    <v-expand-transition>
                                        <div v-show="show6">
                                            <v-divider></v-divider>
                                            <v-timeline align-top dense>
                                                <v-timeline-item v-for="course in coursesModule6" small>
                                                    <div>
                                                        <div class="font-weight-normal">
                                                            <strong>{{ course.name }}</strong>
                                                        </div>
                                                    </div>
                                                </v-timeline-item>
                                            </v-timeline>
                                        </div>
                                    </v-expand-transition>
                                </v-card>

                                <v-card width="400">
                                    <v-img height="200px"
                                        src="https://www.madrimasd.org/sites/default/files/abc-huellaanimalmasantigua-l.jpg">
                                        <v-app-bar flat color="rgba(0, 0, 0, 0)">

                                            <v-toolbar-title class="text-h6 white--text pl-0">
                                                NIVEL AVANZADO
                                            </v-toolbar-title>

                                            <v-spacer></v-spacer>

                                        </v-app-bar>

                                        <v-card-title class="white--text mt-8">
                                            <p class="ml-3">
                                            </p>
                                        </v-card-title>
                                    </v-img>

                                    <v-card-text>
                                        <div class="font-weight-bold ml-8 mb-2">
                                            Modulos
                                        </div>
                                    </v-card-text>

                                    <v-card-actions v-for="( module, index) in moduleAdvanced">

                                        <v-btn v-if="index === 0" color="orange-lighten-2" variant="text"
                                            @click="show7 = !show7">
                                            {{ module.name }}
                                        </v-btn>
                                        <v-btn v-if="index === 1" color="orange-lighten-2" variant="text"
                                            @click="show8 = !show8">
                                            {{ module.name }}
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>

                                    <v-expand-transition>
                                        <div v-show="show7">
                                            <v-divider></v-divider>
                                            <v-timeline align-top dense>
                                                <v-timeline-item v-for="course in coursesModule7" small>
                                                    <div>
                                                        <div class="font-weight-normal">
                                                            <strong>{{ course.name }}</strong>
                                                        </div>
                                                    </div>
                                                </v-timeline-item>
                                            </v-timeline>
                                        </div>
                                    </v-expand-transition>

                                    <v-expand-transition>
                                        <div v-show="show8">
                                            <v-divider></v-divider>
                                            <v-timeline align-top dense>
                                                <v-timeline-item v-for="course in coursesModule8" small>
                                                    <div>
                                                        <div class="font-weight-normal">
                                                            <strong>{{ course.name }}</strong>
                                                        </div>
                                                    </div>
                                                </v-timeline-item>
                                            </v-timeline>
                                        </div>
                                    </v-expand-transition>
                                </v-card>

                                <v-card width="400">
                                    <v-img height="200px"
                                        src="https://totosalcedo.files.wordpress.com/2015/03/seguidores-de-jesc3bas.jpg?w=1200">
                                        <v-app-bar flat color="rgba(0, 0, 0, 0)">

                                            <v-toolbar-title class="text-h6 white--text pl-0">
                                                NIVEL EXPERTO
                                            </v-toolbar-title>

                                            <v-spacer></v-spacer>

                                        </v-app-bar>

                                        <v-card-title class="white--text mt-8">
                                            <p class="ml-3">
                                            </p>
                                        </v-card-title>
                                    </v-img>

                                    <v-card-text>
                                        <div class="font-weight-bold ml-8 mb-2">
                                            Modulos
                                        </div>
                                    </v-card-text>

                                    <v-card-actions v-for="( module, index) in moduleExpert">

                                        <v-btn v-if="index === 0" color="orange-lighten-2" variant="text"
                                            @click="show9 = !show9">
                                            {{ module.name }}
                                        </v-btn>
                                        <v-btn v-if="index === 1" color="orange-lighten-2" variant="text"
                                            @click="show10 = !show10">
                                            {{ module.name }}
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>

                                    <v-expand-transition>
                                        <div v-show="show9">
                                            <v-divider></v-divider>
                                            <v-timeline align-top dense>
                                                <v-timeline-item v-for="course in coursesModule9" small>
                                                    <div>
                                                        <div class="font-weight-normal">
                                                            <strong>{{ course.name }}</strong>
                                                        </div>
                                                    </div>
                                                </v-timeline-item>
                                            </v-timeline>
                                        </div>
                                    </v-expand-transition>

                                    <v-expand-transition>
                                        <div v-show="show10">
                                            <v-divider></v-divider>
                                            <v-timeline align-top dense>
                                                <v-timeline-item v-for="course in coursesModule10" small>
                                                    <div>
                                                        <div class="font-weight-normal">
                                                            <strong>{{ course.name }}</strong>
                                                        </div>
                                                    </div>
                                                </v-timeline-item>
                                            </v-timeline>
                                        </div>
                                    </v-expand-transition>
                                </v-card>
                            </v-row>
                        </v-container>
                    </v-window-item>

                    <v-window-item :value="1">
                        <v-container fluid>
                            <v-row justify="space-around">
                                <v-card width="400" v-for="section in sectionStudentLoged">
                                    <v-img height="200px"
                                        src="https://ministeriointernacional.com/wp-content/uploads/2023/06/%C2%BFComo-acercarme-a-Dios.webp">
                                        <v-app-bar flat color="rgba(0, 0, 0, 0)">

                                            <v-toolbar-title class="text-h6 white--text pl-0">
                                                {{ section.level }}
                                            </v-toolbar-title>

                                            <v-spacer></v-spacer>

                                        </v-app-bar>

                                        <v-card-title class="white--text mt-8">
                                            <p class="ml-3">
                                            </p>
                                        </v-card-title>
                                    </v-img>

                                    <v-card-text>
                                        <div class="font-weight-bold ml-8 mb-2">
                                            Modulo
                                        </div>
                                    </v-card-text>

                                    <v-card-actions>

                                        <v-btn color="orange-lighten-2" variant="text" @click="show1 = !show1">
                                            {{ section.module }}
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>

                                    <v-expand-transition>
                                        <div v-show="show1">
                                            <v-divider></v-divider>
                                            <v-timeline align-top dense>
                                                <v-timeline-item v-for="lesson in section.lessons" small>
                                                    <div>
                                                        <div class="font-weight-normal">
                                                            <strong>Leccion: </strong> {{ lesson.lessonName }}
                                                        </div>
                                                        <strong>Nota: </strong>{{ lesson.lessonNote }}
                                                    </div>
                                                </v-timeline-item>
                                            </v-timeline>
                                        </div>
                                    </v-expand-transition>
                                </v-card>
                            </v-row>
                        </v-container>
                    </v-window-item>

                    <v-window-item :value="2">
                        <v-container fluid>
                            <v-row justify="space-around">
                                <v-card width="400" v-for="section in sectionStudentLogedFinish">
                                    <v-img height="200px"
                                        src="https://ministeriointernacional.com/wp-content/uploads/2023/06/%C2%BFComo-acercarme-a-Dios.webp">
                                        <v-app-bar flat color="rgba(0, 0, 0, 0)">

                                            <v-toolbar-title class="text-h6 white--text pl-0">
                                                {{ section.level }}
                                            </v-toolbar-title>

                                            <v-spacer></v-spacer>

                                        </v-app-bar>

                                        <v-card-title class="white--text mt-8">
                                            <p class="ml-3">
                                            </p>
                                        </v-card-title>
                                    </v-img>

                                    <v-card-text>
                                        <div class="font-weight-bold ml-8 mb-2">
                                            Modulo
                                        </div>
                                    </v-card-text>

                                    <v-card-actions>

                                        <v-btn color="orange-lighten-2" variant="text" @click="show1 = !show1">
                                            {{ section.module }}
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>

                                    <v-expand-transition>
                                        <div v-show="show1">
                                            <v-divider></v-divider>
                                            <v-timeline align-top dense>
                                                <v-timeline-item v-for="lesson in section.lessons" small>
                                                    <div>
                                                        <div class="font-weight-normal">
                                                            <strong>Leccion: </strong> {{ lesson.lessonName }}
                                                        </div>
                                                        <strong>Nota: </strong>{{ lesson.lessonNote }}
                                                    </div>
                                                </v-timeline-item>
                                            </v-timeline>
                                        </div>
                                    </v-expand-transition>
                                </v-card>
                            </v-row>
                        </v-container>
                    </v-window-item>
                </v-window>
            </v-card>

        </v-col>
    </v-row>
</template>

<script>
import { db } from "~/plugins/firebase.js";
import { collection, getDoc, doc, getDocs } from "firebase/firestore";

export default {
    mounted() {
        this.getUser();
        this.Courses();
        this.getLevel();
        this.getModule();
        this.sectionStudentEnCourse();
    },

    data: () => ({
        tab: null,
        user: '',
        show1: false,
        show2: false,
        show3: false,
        show4: false,
        show5: false,
        show6: false,
        show7: false,
        show8: false,
        show9: false,
        show10: false,

        show11: false,

        levels: [],
        modules: [],
        headers: [
            {
                text: 'Curso',
                align: 'start',
                value: 'name',
                groupable: false,
            },
            { text: 'Modulo', value: 'module', align: 'right' },
            { text: 'Nivel', value: 'level', align: 'right' },
        ],
        courses: [],
        moduleElemtary: [],
        moduleBasic: [],
        muduleIntermediate: [],
        moduleAdvanced: [],
        moduleExpert: [],

        coursesModule1: [],
        coursesModule2: [],
        coursesModule3: [],
        coursesModule4: [],
        coursesModule5: [],
        coursesModule6: [],
        coursesModule7: [],
        coursesModule8: [],
        coursesModule9: [],
        coursesModule10: [],

        sectionStudents: [],
        sectionStudentLoged: [],
        sectionStudentLogedFinish: []


    }),

    methods: {
        async getUser() {
            const userDni = localStorage.getItem("userDni");
            const docRef = doc(db, "students", userDni);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                this.user = docSnap.data();
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        },

        async sectionStudentEnCourse() {
            this.sectionStudents = [];
            const querySnapshot = await getDocs(collection(db, "section-student"));
            querySnapshot.forEach((doc) => {
                this.sectionStudents.push(doc.data());
            });

            const userDni = localStorage.getItem("userDni");
            this.sectionStudents.forEach(element => {
                if (element.dniStudent === userDni && element.status == "EN CURSO")
                    this.sectionStudentLoged.push(element);
                else if (element.dniStudent === userDni && element.status == "FINALIZADA")
                    this.sectionStudentLogedFinish.push(element);
            });
        },

        async Courses() {
            this.courses = [];
            const querySnapshot = await getDocs(collection(db, "courses"));
            querySnapshot.forEach((doc) => {
                this.courses.push(doc.data());
            });

            this.courses.forEach(element => {
                if (element.module == "Acercándome a Dios y a su Palabra") {
                    this.coursesModule1.push(element);
                }
                else if (element.module == "Buscando conocer mas") {
                    this.coursesModule2.push(element);
                }
                else if (element.module == "Creciendo en mi nueva vida") {
                    this.coursesModule3.push(element);
                }
                else if (element.module == "Descubriendo el plan de Dios para mi") {
                    this.coursesModule4.push(element);
                }
                else if (element.module == "Explorando el mensaje de la Biblia") {
                    this.coursesModule5.push(element);
                }
                else if (element.module == "Fundamentando mi vida en Cristo") {
                    this.coursesModule6.push(element);
                }
                else if (element.module == "Generando obras de peso eterno") {
                    this.coursesModule7.push(element);
                }
                else if (element.module == "Huellas de fe en mi testimonio") {
                    this.coursesModule8.push(element);
                }
                else if (element.module == "Identidad como seguidor de Cristo") {
                    this.coursesModule9.push(element);
                }
                else if (element.module == "Juntos testificando de Cristo") {
                    this.coursesModule10.push(element);
                }
            })
        },

        async getLevel() {
            this.levels = [];
            const querySnapshot = await getDocs(collection(db, "level"));
            querySnapshot.forEach((doc) => {
                this.levels.push(doc.data());
            });
        },

        async getModule() {
            const querySnapshot = await getDocs(collection(db, "module"));
            querySnapshot.forEach((doc) => {
                this.modules.push(doc.data());
            });

            this.modules.forEach(element => {
                if (element.level == 'NIVEL ELEMENTAL') {
                    this.moduleElemtary.push(element);
                } else if (element.level == 'NIVEL BÁSICO') {
                    this.moduleBasic.push(element);
                } else if (element.level == 'NIVEL INTERMEDIO') {
                    this.muduleIntermediate.push(element);
                } else if (element.level == 'NIVEL AVANZADO') {
                    this.moduleAdvanced.push(element);
                } else if (element.level == 'NIVEL EXPERTO') {
                    this.moduleExpert.push(element);
                }
            });
        },

    }
}

</script>

<style>
.dot-color {
    background-color: gray !important;
}

.icon-btn-color {
    color: white !important;
}

i.v-icon.v-icon {
    color: white;
}
</style>