<template>
  <v-col class="text-center">
    <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">
    <v-container>
      <v-row style="justify-content: center;">
        <v-col cols="12" sm="12">
          <template>
            <v-card>
              <v-card-title>
                Grafica de estudiantes por curso
                <v-spacer></v-spacer>
              </v-card-title>
              <Pie :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId"
                :dataset-id-key="datasetIdKey" :plugins="plugins" :css-classes="cssClasses" :styles="styles"
                :width="width" :height="height" />

            </v-card>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </v-col>
</template>


<script>
import { db } from "~/plugins/firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { Pie } from 'vue-chartjs/legacy'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

export default {
  name: 'PieChart',
  components: {
    Pie
  },
  mounted() {
    this.getSectionStudents();
  },
  props: {
    chartId: {
      type: String,
      default: 'pie-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => { }
    },
    plugins: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      sectionDetails: [],
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Estudiantes por Departamento',
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16', '#744700', '#ce7e00', '#8fce00', '#2986cc', '#16537e', '#6a329f', '#c90076', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#0b5394', '#351c75', '#741b47'],
            data: []
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
    }
  },
  methods: {
    async getSectionStudents() {
      this.sectionDetails = [];
      const querySnapshot = await getDocs(collection(db, "section-student"));
      querySnapshot.forEach((doc) => {
        this.sectionDetails.push(doc.data());
        this.chartData.labels.push(doc.data().courseName);
        this.chartData.labels = [...new Set(this.chartData.labels)];
      });

      const groupByCourse = this.sectionDetails.reduce((acc, item) => {
        if (!acc[item.courseName]) {
          acc[item.courseName] = [];
        }
        acc[item.courseName].push(item);
        return acc;
      }, {});

      this.chartData.datasets[0].data = Object.keys(groupByCourse).map(courseName => groupByCourse[courseName].length);
    },
    close() {
      this.dialog = false
    },
  }
}
</script>
