<template>
  <v-col class="text-center">
    <img width="250" height="300" src="/emmaus.png" alt="Vuetify.js" class="mb-5">
    <v-container>
      <v-row style="justify-content: center;">
        <v-col cols="12" sm="12">
          <template>
            <v-card>
              <v-card-title>
                Grafica de estudiantes por mes
                <v-spacer></v-spacer>
              </v-card-title>
              <LineChartGenerator :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId"
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
import { Line as LineChartGenerator } from 'vue-chartjs/legacy'
import { db } from "~/plugins/firebase.js";
import { collection, getDocs } from "firebase/firestore";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,

} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,

)

export default {
  name: 'LineChart',
  components: {
    LineChartGenerator
  },
  mounted() {
    this.getSectionStudents();
  },
  props: {
    chartId: {
      type: String,
      default: 'line-chart'
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

      months: [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
      ],
      sectionDetails: [],
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Estudiantes por mes',
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
        this.chartData.labels.push(this.months[doc.data().month - 1] + ' - ' + doc.data().year);
        this.chartData.labels = [...new Set(this.chartData.labels)];
      });

      const groupByMonth = this.sectionDetails.reduce((acc, item) => {
        if (!acc[item.month]) {
          acc[item.month] = [];
        }
        acc[item.month].push(item);
        return acc;
      }, {});

      this.chartData.datasets[0].data = Object.keys(groupByMonth).map(month => groupByMonth[month].length);
    },
    close() {
      this.dialog = false
    },
  }
}
</script>
