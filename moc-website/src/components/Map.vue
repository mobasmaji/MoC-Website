<template>
  <div id="root">
    <div id="leafletMap"></div>
    <v-btn
      class="mx-2"
      dark
      color="indigo"
      block
      v-on:click="addButtonClickHandler"
    >
      <v-icon dark> mdi-plus </v-icon>
    </v-btn>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title>
          <span class="headline">Add a marker</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="name"
                  label="Marker's name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="description"
                  label="Description"
                ></v-text-field>
                <v-select
                  v-model="type"
                  :items="['Nature', 'Building', 'Status', 'I just Like it!']"
                  label="Type"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveMarkerClickHandler">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import L, { geoJSON, LatLng } from "leaflet";
import { Requests, RequestStatus } from "./helpers/Requests";
export default Vue.extend({
  name: "Map",
  data: () => ({
    requests: {} as Requests,
    map: {} as L.Map,
    me: {} as L.Marker,
    dialog: false,
    name: "",
    description: "",
    type: "",
    currentLat: 0,
    currentLng: 0,
  }),
  mounted() {
    this.requests = new Requests("localhost", "3000");
    this.initMap();
    this.initLocation();
    this.initMarkers();
    this.initSharedMarkers();
    setInterval(() => this.refreshLocation(), 100);
  },
  methods: {
    initMap() {
      this.map = L.map("leafletMap", {
        center: new L.LatLng(40.731253, -73.996139),
        zoom: 12,
      });
      L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        zIndex: 1,
      }).addTo(this.map);

    },

    initLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.me = new L.Marker(
            {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            {
              icon: new L.Icon({
                iconUrl: require("../assets/locationIcon.png"),
                iconSize: [30, 30],
              }),
            }
          )
            .addTo(this.map)
            .on("click", () => {
              alert("your location");
            });
          this.map.setView(
            new L.LatLng(position.coords.latitude, position.coords.longitude),
            this.map.getMaxZoom()
          );
        });
      } else {
        alert("no geo location");
      }
    },
    async initMarkers() {
      // request then add markers
      const res = await this.requests.getMarkers("mo");
      if (res.status == RequestStatus.ERROR) {
        alert("error");
      }
      for (const marker of res.data) {
        new L.Marker({
          lat: marker.lat,
          lng: marker.lng,
        })
          .addTo(this.map)
          .on("click", () => {
            alert(marker.username + "'s marker");
          });
      }
    },
    async initSharedMarkers() {
      const res = await this.requests.getSharedMarkers("mo");
      for (const marker of res.data) {
        new L.Marker({
          lat: marker.lat,
          lng: marker.lng,
        })
          .addTo(this.map)
          .on("click", () => {
            alert(marker.username + "'s marker");
          });
      }
    },

    addButtonClickHandler() {
      this.dialog = true;
    },
    async saveMarkerClickHandler() {
      this.dialog = false;
      const resp = await this.requests.addMarker({
        username: "mo",
        id: this.getUID(),
        name: this.name,
        description: this.description,
        lat: this.currentLat,
        lng: this.currentLng,
        type: this.type,
        shareWith: ["aycha"],
      });
      if (resp.status == RequestStatus.ERROR) {
        alert("erorr adding");
        return;
      }
      new L.Marker({
        lat: this.currentLat,
        lng: this.currentLng,
      })
        .addTo(this.map)
        .on("click", () => {
          alert("mo" + "'s marker");
        });
    },
    getUID() {
      return new Date().valueOf().toString();
    },
    refreshLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.me.setLatLng(
            new LatLng(position.coords.latitude, position.coords.longitude)
          );
        });
      }
    },
  },
});
</script>
<style scoped>
@import url("https://unpkg.com/leaflet@1.7.1/dist/leaflet.css");
#leafletMap {
  height: 80vh;
  z-index: 0;
}
</style>