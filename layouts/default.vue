<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list v-if=isAdmin>
        <v-list-item v-for="(item, i) in itemsAdmin" :key="i" :to="item.to" router exact>

          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-if=isStudent>
        <v-list-item v-for="(item, i) in itemsStudents" :key="i" :to="item.to" router exact>

          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-if=isRevisor>
        <v-list-item v-for="(item, i) in itemsRevisors" :key="i" :to="item.to" router exact>

          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-if=!isAdmin>
        <v-list-item v-for="(item, i) in itemsAll" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title>{{ title }}{{ name }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>

        <v-list-item @click="closeSesion()">
          <v-list-item-action>
            <v-icon light>
              mdi-clipboard-arrow-left
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Cerrar sesion</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>&copy; osda_dev {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { db, auth, signOut } from '@/plugins/firebase'
import { collection, getDocs } from "firebase/firestore";
export default {
  name: 'DefaultLayout',
  mounted() {
    this.setUserName();
    this.validateAccess();
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      itemsAll: [
        {
          icon: 'mdi-animation',
          title: 'Solicitudes',
          to: '/request',
          access: "Students"
        },
        {
          icon: 'mdi-account-plus',
          title: 'Registro',
          to: '/',
          access: "all"
        },
        {
          icon: 'mdi-account-key',
          title: 'Ingreso',
          to: '/inspire',
          access: "all"
        },
      ],
      itemsRevisors: [
        {
          icon: 'mdi-book-open-blank-variant',
          title: 'Mis cursos',
          to: '/revisor-view',
          access: "Revisors"
        },
      ],
      itemsStudents: [
        {
          icon: 'mdi-book-open-blank-variant',
          title: 'Mis cursos',
          to: '/students-view',
          access: "Students"
        },
      ],
      itemsAdmin: [
        {
          icon: 'mdi-account-plus',
          title: 'Registro',
          to: '/',
          access: "all"
        },
        {
          icon: 'mdi-account-key',
          title: 'Ingreso',
          to: '/inspire',
          access: "admin"
        },
        {
          icon: 'mdi-shape-outline',
          title: 'Niveles',
          to: '/level',
          access: "admin"
        },
        {
          icon: 'mdi-view-module',
          title: 'Modulos',
          to: '/module',
          access: "admin"
        },
        {
          icon: 'mdi-book-open-blank-variant',
          title: 'Cursos',
          to: '/courses',
          access: "admin"
        },
        {
          icon: 'mdi-bookmark-box-multiple',
          title: 'Lecciones',
          to: '/lessons',
          access: "admin"
        },
        {
          icon: 'mdi-bookshelf',
          title: 'Secciones',
          to: '/section',
          access: "admin"
        },
        {
          icon: 'mdi-account-tag',
          title: 'Asignar secciones',
          to: '/section-asing',
          access: "admin"
        },
        {
          icon: 'mdi-account-details',
          title: 'Detalle de secciones',
          to: '/section-details',
          access: "admin"
        },
        {
          icon: 'mdi-account-tie-outline',
          title: 'Revisores',
          to: '/revisors',
          access: "admin"
        },
        {
          icon: 'mdi-school',
          title: 'Estudiantes',
          to: '/students',
          access: "admin"
        },
        {
          icon: 'mdi-account-supervisor-circle',
          title: 'Usuarios',
          to: '/users',
          access: "admin"
        },
        {
          icon: 'mdi-animation',
          title: 'Solicitudes',
          to: '/requests',
          access: "admin"
        },

      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Bienvenido a Emmaus, ',
      isAdmin: false,
      isRevisor: false,
      isStudent: false,
      users: [],
      user: '',
      name: ''
    }
  },
  methods: {
    setUserName() {
      this.name = localStorage.getItem("userName");
    },
    validateAccess() {
      if (process.browser) {
        const access = localStorage.getItem("login");
        const userType = localStorage.getItem("userType");

        if (access == "true") {
          if (userType == "Estudiante") {
            this.isStudent = true;
          } else if (userType == "Revisor") {
            this.isRevisor = true
          } else if (userType == "Administrador") {
            this.isAdmin = true
          } else {
            this.isAdmin = false
          }
        } else {
          this.isAdmin = false
        }
      }
    },

    async closeSesion() {
      signOut(auth).then(() => {
        localStorage.removeItem('userType');
        localStorage.removeItem('login');
        localStorage.removeItem('user');
        localStorage.removeItem('userDni');
        localStorage.removeItem('userName');
        location.reload();
      }).catch((error) => {
        // An error happened.
      });
    }
  }
}
</script>
