<template>
  <!-- Top -->
  <div class="w-screen h-screen fixed inset-0 font-anybody bg-background flex flex-col items-center">
    <!-- Title and Search -->
    <div class="flex flex-row flex-nowrap items-center mt-6 justify-start z-20">
      <div class="flex flex-row flex-nowrap items-center justify-start mr-20">
        <h1 class="text-2xl mr-4">School Radar <br> <span class="text-sm">of New York City</span></h1>
        <Radar />
      </div>
      <!-- Search area -->
      <div class="flex flex-col flex-nowrap items-center">
        <div class="flex flex-row items-center justify-center">
          <input class="h-12 max-w-64 text-xl mr-4 rounded-lg px-4" placeholder="Your address" v-model="addrInput" />
          <button class="h-12 px-4 text-xl rounded-lg bg-white mr-4" @click="handleAddressSubmit()">Search</button>
          <button @click="handleHelpClick()" class="text-3xl">?</button>
        </div>
        <p v-show="inputWarn.length > 0" class="text-callout mt-2">{{ inputWarn }}</p>
      </div>
    </div>
    <!-- Map -->
    <div class="w-full flex-grow py-8 relative">
      <!-- Map area -->
      <div class="w-10/12 h-full mx-auto" ref="maparea">
      </div>
      <!-- Zoom buttons -->
      <div class="flex flex-row flex-nowrap items-center right-4 bottom-4 px-3 bg-white rounded-md absolute">
        <p>zoom</p>
        <button @click="handleZoomIn()" class="font-black text-3xl mr-1 p-2">+</button>
        <button @click="handleZoomOut()" class="font-black text-3xl p-2">-</button>
      </div>
      <!-- Grade Selectors -->
      <div class="flex flex-col absolute top-8 left-20 select-none">
        <div v-for="grade, index in grades" :key="grade.name"
          class="flex flex-row flex-nowrap items-center justify-start bg-background py-1 px-2 max-w-[fit-content]">
          <p class="whitespace-nowrap">{{ grade.name }}</p>
          <button class="w-8 h-8 border-4 ml-3"
            :style="grade.active ? { 'background-color': grade.color, 'border-color': grade.color } : { 'border-color': grade.color }"
            @click="handleGradeToggle(index)"></button>
        </div>
      </div>
    </div>
    <!-- Table -->
    <div class="absolute top-32  w-2/3 transition-all" :class="listOpen ? 'right-0' : 'right-[calc(-66%+2.7rem)]'">
      <div class="w-full h-full relative flex flex-row flex-nowrap">
        <!-- Tab -->
        <button class="h-36 w-12 bg-white rounded-l-lg" @click="handleListToggle()">
          <p class="-rotate-90 whitespace-nowrap">List view</p>
        </button>
        <!-- Content -->
        <div class="flex flex-col flex-nowrap bg-white h-96 overflow-y-scroll p-4 w-full">
          <div v-for="sch in schools" :key="sch.name" :class="sch.active ? '' : 'hidden'"
            class="flex flex-col flex-nowrap mb-2">
            <p class="font-black text-lg">{{ sch.name }}</p>
            <div class="flex-row flex-wrap">
              <p><span>Grade: </span>{{ sch.grade }}</p>
              <p><span>Address: </span>{{ sch.address }}</p>
            </div>
            <hr>
          </div>
        </div>
      </div>
    </div>
    <!-- Cloropleth options -->
    <div class="flex flex-row pb-6 z-20">
      <button v-for="cloro, index in cloros" :key="cloro.title" class="px-4 py-2"
        :class="activeCloro == index ? 'border-4 border-black bg-background' : 'bg-background'"
        @click="handleCloroClick(index)">
        {{ cloro.title }}
      </button>
    </div>
    <!-- Tooltip -->
    <div :style="toolTip.style" class="p-2 max-w-40 bg-callout absolute top-0 left-0">
      {{ toolTip.label }}
      {{ toolTip.text }}
    </div>
    <!-- credits -->
    <p class="fixed bottom-0 right-0 pr-2">Created by <a href="mailto:mah2367@columbia.edu" class="underline">Margaret
        Hanson</a></p>
  </div>
  <!-- Help modal -->
  <div v-show="helpOpen" class="fixed w-screen h-screen bg-transparent flex flex-row items-start justify-center"
    @click="handleHelpClose()">
    <div class="w-2/3 bg-white px-12 py-20 relative overflow-y-scroll">
      <button class="absolute top-8 right-8 font-bold text-3xl" @click="handleHelpClose()">X</button>
      <p class="font-medium">
        <span class="font-normal text-2xl">About:</span>
        <br />
        Moving to New York is tricky for anyone, but it’s even more difficult to navigate when you navigate the process
        with children. New York City boasts a diverse range of neighborhoods, and we want to help you find one that’s
        right for you and your family! After searching the address of your potential new home, you will be able to sift
        through a range of child-friendly neighborhood indicators to help you make a better-informed decision.
      </p>
      <p class="mt-4 font-medium">
        <span class="font-normal text-2xl">Directions:</span>
        <br />
        One of the most important aspects of deciding a neighborhood is determining what schooling options are available
        for your children. Use this map to see what schools are nearest to you!
      </p>
      <p class="mt-4 font-medium">
        <span class="font-normal text-2xl">How it works:</span>
        <br />
        Using data from the American Community Survey (ACS), the Community Health Survey (CHS), the NYC Housing and
        Vacancy Survey (HVS), and the NYC Department of Health and Mental Hygiene, different indicators for neighborhood
        child-friendliness have been calculated. These factors include the ratio of parks to the under-18 population of
        the neighborhood, the rate of childhood-obesity, the rate of childhood asthma, the rate of air pollution, the
        number of pedestrian injuries, and the rate of renters experiencing rent burden.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// Components
import Radar from "@/components/Radar.vue";
// Connections
import { geocode } from "@/connections/geocoder";
// d3
import * as d3 from "d3";
import { GeoJSON } from "geojson";
import { selectAll } from "d3";
import chroma from "chroma-js";


type School = {
  lat: number;
  lon: number;
  grade: string;
  name: string;
  districtCode: number;
  pixelX: number;
  pixelY: number;
}



export default defineComponent({
  name: "App",
  setup() {
    const addrInput = ref<string>("");
    const inputWarn = ref<string>("");
    const mapg = d3.create("svg").attr("title", "school map");
    const mapproj = d3.geoMercator();
    const mappath = d3.geoPath(mapproj);
    const grades = ref([{
      name: "Collaborative or multi-graded",
      color: "#a9beaf",
      active: true
    },
    {
      name: "Early childhood",
      color: "#d1bbdf",
      active: true
    },
    {
      name: "elementary",
      color: "#c5dcb0",
      active: true
    },
    {
      name: "High school",
      color: "#aec1e0",
      active: true
    },
    {
      name: "Ungraded",
      color: "#e0c3a8",
      active: true
    },
    {
      name: "Junior High-Intermediate-Middle",
      color: "#98d4e4",
      active: true
    },
    {
      name: "K-12 all grades",
      color: "#e6b7bf",
      active: true
    },
    {
      name: "K-8",
      color: "#8fc4b0",
      active: true
    },
    {
      name: "Secondary School",
      color: "#cdecdb",
      active: true
    }
    ]);
    const cloros = [
      {
        title: "Child to Park Ratio",
        column: "parksperUnder18",
        c1: "#e7e1ef",
        c2: "#dd1c77"
      },
      {
        title: "Obesity Rate",
        column: "childobesity",
        c1: "#f7fcb9",
        c2: "#31a354"
      },
      {
        title: "Asthma Rate",
        column: "childasthma",
        c1: "#edf8b1",
        c2: "#2c7fb8"
      },
      {
        title: "Air Quality",
        column: "airpollution",
        c1: "#fff7bc",
        c2: "#d95f0e"
      },
      {
        title: "Pedestrian Safety",
        column: "pedestrianinjury",
        c1: "#efedf5",
        c2: "#756bb1"
      },
      {
        title: "Rent Burden",
        column: "rentburden",
        c1: "#fee0d2",
        c2: "#de2d26"
      }
    ];
    const schools = ref<{
      name: string,
      grade: string,
      address: string,
      active: boolean
    }[]>([]);
    const activeCloro = ref<number>(0);
    const toolTip = ref({ open: false, label: "", text: "", style: { display: "none" } as any });
    const helpOpen = ref(true);
    const listOpen = ref(false);
    const zoom = d3.zoom<SVGSVGElement, undefined>()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        mapg.attr("transform", event.transform)
      });
    mapg.call(zoom);
    return {
      addrInput,
      inputWarn,
      mapg,
      mapproj,
      mappath,
      grades,
      schools,
      cloros,
      activeCloro,
      toolTip,
      helpOpen,
      listOpen,
      zoom
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.drawMap();
    })
  },
  methods: {
    async handleAddressSubmit() {
      const res = await geocode(this.addrInput);
      if (res !== undefined) {
        if (res.city !== "New York") {
          this.inputWarn = "Hmm... that address isn't in New York City. Please try again."
          setTimeout(() => {
            this.inputWarn = "";
            this.addrInput = "";
          }, 5000)
        }
        this.addrInput = res.matched;
        this.drawAddress(res.lat, res.lon);
      } else {
        this.inputWarn = "Cannot find address. Please try again."
        setTimeout(() => {
          this.inputWarn = "";
          this.addrInput = "";
        }, 5000);
      }
    },
    async drawMap() {
      const container = this.$refs.maparea as HTMLElement;
      const height = container.clientHeight;
      const width = container.clientWidth;
      const data = await d3.json<GeoJSON.FeatureCollection>("/data/nyc.geojson");
      const cityData = await d3.csv("/data/nycstats.csv");
      if (data !== undefined) {
        this.mapproj.fitSize([width, height], data);
        this.mapg.attr("width", width).attr("height", height);
        this.mapg.selectAll('path')
          .data(data.features)
          .join('path')
          .attr('d', this.mappath)
          .attr('stroke', "#000000")
          .attr('stroke-width', 1)
          .on("mouseenter", (event, d) => {
            this.toolTip.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
            this.toolTip.style.display = "";
            const dc = d.properties?.boro_cd;
            const target = cityData.findIndex((di) => {
              return di["id"] == dc;
            });
            if (target > -1) {
              this.toolTip.label = cityData[target]["neighborhood"] || "";
              this.toolTip.text = `${this.cloros[this.activeCloro].title}: ${cityData[target][this.cloros[this.activeCloro].column]}`
            }
          })
          .on("mouseleave", () => {
            this.toolTip.style.display = "none";
            this.toolTip.style.transform = "";
          });;
        const node = this.mapg.node();
        if (node !== null) {
          container.appendChild(node);
        }
      }
      this.drawSchools();
      this.drawCloro(this.activeCloro);
    },
    async drawSchools() {
      const raw = await d3.csv("/data/nycschools.csv");
      const data: School[] = [];
      this.schools.splice(0, this.schools.length);
      raw.forEach((d) => {
        if (d.LONGITUDE && d.LATITUDE && d.location_name && d.id && d.Location_Category_Description) {
          const asPixels = this.mapproj([+d.LONGITUDE, +d.LATITUDE]);
          data.push({
            name: d.location_name,
            lat: +d.LATITUDE,
            lon: +d.LONGITUDE,
            districtCode: +d.id,
            grade: d.Location_Category_Description,
            pixelX: asPixels ? asPixels[0] : 0,
            pixelY: asPixels ? asPixels[1] : 0
          });
          this.schools.push(
            {
              name: d.location_name,
              grade: d.Location_Category_Description,
              address: d.primary_address_line_1 || "not available",
              active: true
            }
          )
        }
      });
      this.mapg.selectAll("circle").data(data).join("circle")
        .attr("cx", (d) => { return d.pixelX })
        .attr("cy", (d) => { return d.pixelY })
        .attr("r", 2)
        .attr("fill", (d) => {
          const match = this.grades.find((g) => {
            return g.name.toLocaleLowerCase() == d.grade.toLocaleLowerCase();
          });
          if (match !== undefined) {
            return match.color;
          } else {
            return "#b2675e";
          }
        })
        .attr("pointer-events", "none")
        .attr("class", (d) => {
          const match = this.grades.find((g) => {
            return g.name.toLocaleLowerCase() == d.grade.toLocaleLowerCase();
          });
          if (match !== undefined) {
            return "c" + match.color.slice(1);
          } else {
            return "na";
          }
        });
    },
    drawAddress(lat: number, lon: number) {
      const asPixels = this.mapproj([lon, lat]);
      if (asPixels !== null) {
        this.mapg.selectAll("circle").data([1]).join("circle")
          .attr("cx", asPixels[0])
          .attr("cy", asPixels[1])
          .attr("r", 6)
          .attr("fill", "#b2675e")
          .attr("stroke", "#b2675e")
          .attr("class", "pulsing");
      }

    },
    async drawCloro(index: number) {
      const cityData = await d3.csv("/data/nycstats.csv");
      this.mapg.selectAll("path").attr("fill", (d: any) => {
        const dc = d.properties.boro_cd;
        const vals = cityData.map((i) => {
          const v = i[this.cloros[index].column];
          if (this.cloros[index].column == "parksperUnder18") {
            return v ? +v.slice(0, -2) : 0;
          }
          return v ? +v : 0;
        });
        const high = Math.max(...vals);
        const low = Math.min(...vals);
        const scale = chroma.scale(["#ffffff", "#000000"]).domain([low, high]);
        const target = cityData.findIndex((di) => {
          return di["id"] == dc;
        });
        if (target > -1) {
          return scale(vals[target]).hex();
        } else {
          return "transparent";
        }
      });
    },
    handleCloroClick(index: number) {
      this.activeCloro = index;
      this.drawCloro(index);
    },
    handleGradeToggle(index: number) {
      const targetClass = "c" + this.grades[index].color.slice(1);
      this.grades[index].active = !this.grades[index].active;
      for (const s of this.schools) {
        if (s.grade.toLowerCase() == this.grades[index].name.toLowerCase()) {
          s.active = this.grades[index].active;
        }
      }
      this.mapg.selectAll(`circle.${targetClass}`).attr("visibility", () => { return this.grades[index].active ? "visible" : "hidden" });

    },
    handleHelpClick() {
      this.helpOpen = true;
    },
    handleHelpClose() {
      this.helpOpen = false;
    },
    handleZoomIn() {
      this.mapg.transition().duration(100).call(this.zoom.scaleBy, 1.1);
    },
    handleZoomOut() {
      this.mapg.transition().duration(100).call(this.zoom.scaleBy, 0.9);
    },
    handleListToggle() {
      this.listOpen = !this.listOpen;
    }
  },
  components: {
    Radar
  },
});
</script>

<style>
@keyframes pulse {
  0% {
    transform: scale(0.5);
  }

  70% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.5);
  }
}

.pulsing {
  transform: scale(1);
  transform-origin: center;
  animation: pulse 2s infinite;
}

circle {
  pointer-events: none;
}
</style>