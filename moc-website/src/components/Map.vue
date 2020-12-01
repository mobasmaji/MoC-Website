<template>
  <!-- Add marker burton -->

  <div id="root">
    <v-btn dark color="indigo" block v-on:click="addButtonClickHandler">
      <v-icon dark> mdi-plus </v-icon>
    </v-btn>
    <!-- Leaflet container-->

    <div id="leafletMap"></div>

    <!-- Add marker dialog -->

    <v-dialog v-model="addMarkerDialog" max-width="290">
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
                <v-radio-group v-model="radioButtonValue" column>
                  <v-radio label="Share with everyone" value="yes"></v-radio>
                  <v-radio label="Keep it private" value="no"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="addMarkerDialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveMarkerClickHandler">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- A Login dialog -->

    <v-dialog v-model="loginDialog" max-width="290">
      <v-card>
        <v-card-title>
          <span class="headline">Login</span>
          <v-card-subtitle
            >You need to login in order to add and see your
            places!</v-card-subtitle
          >
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="username"
                  label="Username"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPass ? 'text' : 'password'"
                  hint="Tipp: enter at least 8 characters"
                  counter
                  @click:append="showPass = !showPass"
                  label="Password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="loginDialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="loginCallback">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Alert control -->
    <v-alert v-model="alertToggle" :type="alertType" dismissible>
      {{ alertText }}
    </v-alert>
    <!-- position buttons -->
    <v-btn fixed fab dark large bottom right color="indigo" @click="goToLocation">
      <v-icon dark> mdi-map-marker </v-icon>
    </v-btn>
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
    tileLayer: {} as L.TileLayer,
    myMarkers: {} as L.FeatureGroup,
    sharedMarkers: {} as L.FeatureGroup,
    me: {} as L.Marker,
    addMarkerDialog: false,
    loginDialog: false,
    name: "",
    description: "",
    type: "",
    currentLat: 0,
    currentLng: 0,
    radioButtonValue: "no",
    // auth
    username: "",
    password: "",
    showPass: false,
    // alert
    alertToggle: false,
    alertText: "",
    alertType: "success",
  }),
  mounted() {
    if (!localStorage.getItem("jwt")) {
      this.loginDialog = true;
    }
    this.requests = new Requests("moc-backend.azurewebsites.net", "3000");
    this.initMap();
    this.initLocation();
    this.initMarkers();
    this.initSharedMarkers();
    this.initLayerControl();
    setInterval(() => this.refreshLocation(), 100);
  },
  methods: {
    initMap() {
      this.map = L.map("leafletMap", {
        center: new L.LatLng(40.731253, -73.996139),
        zoom: 12,
      });
      this.tileLayer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
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
      this.myMarkers = new L.FeatureGroup();
      // request then add markers
      const res = await this.requests.getMarkers("mo");
      if (res.status == RequestStatus.ERROR) {
        alert("error");
      }
      for (const marker of res.data) {
        new L.Marker(
          {
            lat: marker.lat,
            lng: marker.lng,
          },
          {
            icon: new L.Icon({
              iconUrl: require("../assets/markerIcon.jpg"),
              iconSize: [30, 30],
            }),
          }
        )
          .addTo(this.myMarkers)
          .on("click", () => {
            alert(marker.username + "'s marker");
          });
      }
    },
    async initSharedMarkers() {
      this.sharedMarkers = new L.FeatureGroup();
      const res = await this.requests.getSharedMarkers("mo");
      for (const marker of res.data) {
        new L.Marker(
          {
            lat: marker.lat,
            lng: marker.lng,
          },
          {
            icon: new L.Icon({
              iconUrl: require("../assets/sharedMarkerIcon.png"),
              iconSize: [30, 30],
            }),
          }
        )
          .addTo(this.sharedMarkers)
          .on("click", () => {
            alert(marker.username + "'s marker");
          });
      }
    },
    initLayerControl() {
      const base: L.Control.LayersObject = {
        Base: this.tileLayer,
      };
      // Layers to show/hide
      const overlayLayers: L.Control.LayersObject = {
        "My Markers": this.myMarkers,
        "Shared Markers": this.sharedMarkers,
      };
      // Create Layer Control with the previous options
      const layerControl = new L.Control.Layers(base, overlayLayers);
      // Add to map
      layerControl.addTo(this.map);
    },

    addButtonClickHandler() {
      if (!this.loggedIn()) {
        alert("You need to login first");
      } else {
        this.addMarkerDialog = true;
      }
    },
    async saveMarkerClickHandler() {
      this.addMarkerDialog = false;
      const resp = await this.requests.addMarker({
        username: localStorage.getItem("username") as string,
        id: this.getUID(),
        name: this.name,
        description: this.description,
        lat: this.currentLat,
        lng: this.currentLng,
        type: this.type,
        share: this.radioButtonValue == "yes" ? true : false,
      });
      if (resp.status == RequestStatus.ERROR) {
        this.alertUser("Error adding marker", "error");
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
          this.currentLat = position.coords.latitude;
          this.currentLng = position.coords.longitude;
          this.me.setLatLng(
            new LatLng(position.coords.latitude, position.coords.longitude)
          );
        });
      }
    },
    loggedIn(): boolean {
      if (localStorage.getItem("jwt")) {
        return true;
      }
      return false;
    },
    async loginCallback() {
      this.loginDialog = false;
      const res = await this.requests.login({
        username: this.username,
        password: this.password,
      });
      if (res.status == RequestStatus.ERROR) {
        this.alertUser("Login failed", "error");
      } else {
        localStorage.setItem("jwt", res.data.token);
        localStorage.setItem("username", this.username);
        this.alertUser("Login successful", "success");
      }
    },
    logoutCallback() {
      localStorage.removeItem("jwt");
      localStorage.removeItem("username");
    },
    alertUser(text: string, type: string) {
      this.alertText = text;
      this.alertType = type;
      this.alertToggle = true;
    },
    goToLocation() {
      this.map.setView(this.me.getLatLng(), this.map.getMaxZoom());
    },
  },
});
</script>
<style scoped>
@import url("https://unpkg.com/leaflet@1.7.1/dist/leaflet.css");
#leafletMap {
  height: 89vh;
  z-index: 0;
}
</style>