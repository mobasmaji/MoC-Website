<template>
  <!-- Add marker burton -->

  <div id="root">
    <!-- Leaflet container-->

    <div id="leafletMap"></div>
    <!-- Floating toolbar -->
    <v-container class="d-flex justify-center">
      <v-toolbar absolute rounded="pill" dense class="ma-4" min-width="">
        <v-app-bar-nav-icon @click="showList = !showList"></v-app-bar-nav-icon>
        <v-divider></v-divider>
        <v-btn color="red darken-1" v-if="logged" @click="logoutCallback" text>
          Logout
        </v-btn>
        <v-divider v-if="logged"></v-divider>

        <v-btn
          color="green darken-1"
          v-if="!logged"
          @click="signUpDialog = true"
          text
        >
          Sign-up
        </v-btn>
        <v-divider v-if="!logged"></v-divider>

        <v-btn
          color="blue darken-1"
          v-if="!logged"
          @click="loginDialog = true"
          text
        >
          Login
        </v-btn>
        <v-divider v-if="!logged"></v-divider>
        <v-divider v-if="!logged"></v-divider>
        <v-btn icon to="/About">
          <v-icon>mdi-information</v-icon>
        </v-btn>
      </v-toolbar>
    </v-container>
    <!-- List of Markers -->
    <v-navigation-drawer absolute v-model="showList">
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              Available Markers
            </v-list-item-title>
            <v-list-item-subtitle>
              You can also click them!
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <!-- List of my markers-->
        <v-subheader>My Markers</v-subheader>
        <template v-if="myMarkersList.length !== 0">
          <v-list-item v-for="item in myMarkersList" :key="item.id">
            <v-list-item-avatar>
              <v-icon color="blue">mdi-map-marker</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>

              <v-list-item-subtitle>Type: {{ item.type }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon @click="goToMarker(item)">
                <v-icon>mdi-arrow-right-thick</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
        <v-list-item-subtitle v-else class="ml-6">
          You don't have markers yet</v-list-item-subtitle
        >

        <!-- List of shared markers-->
        <v-subheader>Shared Markers</v-subheader>
        <template v-if="sharedMarkersList.length !== 0">
          <v-list-item v-for="item in sharedMarkersList" :key="item.id">
            <v-list-item-avatar>
              <v-icon color="orange">mdi-map-marker</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>

              <v-list-item-subtitle>Type: {{ item.type }}</v-list-item-subtitle>
              <v-list-item-subtitle> By: {{ item.owner }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon @click="goToMarker(item)">
                <v-icon>mdi-arrow-right-thick</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
        <v-list-item-subtitle v-else class="pa-2"
          >There are no shared markers</v-list-item-subtitle
        >
      </v-list>
    </v-navigation-drawer>
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
                <v-textarea
                  v-model="description"
                  label="Description"
                ></v-textarea>
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
                  counter
                  @click:append="showPass = !showPass"
                  label="Password"
                  required
                  :error-messages="loginError"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-text>
          <v-card-subtitle>or </v-card-subtitle>
          <v-btn
            color="blue darken-1"
            text
            @click="
              loginDialog = false;
              signUpDialog = true;
            "
          >
            Sign-up
          </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="loginDialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="loginCallback">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- A sign-up dialog -->

    <v-dialog v-model="signUpDialog" max-width="290">
      <v-card>
        <v-card-title>
          <span class="headline">Sign-up</span>
          <v-card-subtitle
            >Sign up for an account to add and see your own
            places!</v-card-subtitle
          >
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="sUsername"
                  label="Username"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="sPass"
                  :append-icon="sShowPass ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="sShowPass ? 'text' : 'password'"
                  hint="Tipp: enter at least 8 characters"
                  counter
                  @click:append="sShowPass = !sShowPass"
                  label="Password"
                  required
                  :rules="[passLength, passContainsNum]"
                ></v-text-field>
                <v-text-field
                  v-model="sConfirmPass"
                  :append-icon="sShowPass ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="sShowPass ? 'text' : 'password'"
                  hint="Enter password again"
                  counter
                  @click:append="sShowPass = !sShowPass"
                  label="Confirm password"
                  required
                  :rules="[passMatch]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="signUpDialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="signUpCallback">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Alert control -->
    <v-alert v-model="alertToggle" :type="alertType" dismissible>
      {{ alertText }}
    </v-alert>
    <!-- position button -->
    <v-btn fixed fab small bottom left @click="goToLocation" class="ml-12 mb-2">
      <v-icon dark> mdi-crosshairs-gps </v-icon>
    </v-btn>
    <!-- zoom buttons -->
    <v-btn
      fixed
      fab
      small
      bottom
      left
      @click="map.zoomOut()"
      dense
      class="mb-2"
    >
      <v-icon dark> mdi-minus </v-icon>
    </v-btn>
    <v-btn
      fixed
      fab
      small
      bottom
      left
      @click="map.zoomIn()"
      dense
      class="mb-14"
    >
      <v-icon dark> mdi-plus </v-icon>
    </v-btn>
    <!-- button to add markers -->
    <v-btn
      fixed
      small
      dark
      bottom
      right
      color="indigo"
      @click="addButtonClickHandler"
      dense
      class="mb-13"
    >
      Add marker
    </v-btn>
    <!-- button to toggle shared markers -->
    <v-btn
      fixed
      small
      dark
      bottom
      right
      color="orange darken-3"
      @click="toggleSharedMarkers()"
      dense
      class="mb-4"
    >
      Toggle shared markers
    </v-btn>

    <!-- Popup when clicked on me -->
    <!-- Popup when clicked on markers -->
    <v-dialog max-width="290" v-model="showMarkerDialog">
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <h1>{{ clickedMarker.title }}</h1>
            </v-list-item-title>
            <v-list-item-subtitle>
              Owned by: {{ clickedMarker.owner }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-subheader>Description</v-subheader>
        <v-list-item>
          {{ clickedMarker.description }}
        </v-list-item>
        <v-divider></v-divider>
        <v-subheader>Coordinates</v-subheader>
        <v-list-item dense> Latitude: {{ clickedMarker.lat }} </v-list-item>
        <v-list-item dense> Longitude: {{ clickedMarker.lng }} </v-list-item>
        <v-divider></v-divider>
        <v-subheader>Type</v-subheader>
        <v-list-item dense>
          {{ clickedMarker.type }}
        </v-list-item>
        <v-divider></v-divider>
        <v-btn @click="showMarkerDialog = false" color="blue darken-1" text>
          Ok
        </v-btn>
        <v-btn @click="showMarkerDialog = false" color="blue darken-1" text>
          Update
        </v-btn>
        <v-btn @click="deleteClickedMarker" color="red darken-1" text>
          Delete
        </v-btn>
      </v-list>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import L from "leaflet";
import { Requests, RequestStatus } from "./helpers/Requests";
export default Vue.extend({
  name: "Map",
  data: () => ({
    requests: {} as Requests,
    map: {} as L.Map,
    tileLayer: {} as L.TileLayer,
    myMarkers: {} as L.FeatureGroup,
    sharedMarkers: {} as L.FeatureGroup,
    sharedMarkersActive: true,
    me: {} as L.Marker,
    addMarkerDialog: false,
    loginDialog: false,
    signUpDialog: false,
    name: "",
    description: "",
    type: "",
    currentLat: 0,
    currentLng: 0,
    radioButtonValue: "no",
    zooming: false,
    showList: false,
    // login
    username: "",
    password: "",
    showPass: false,
    loginError: "",
    logged: false,
    // alert
    alertToggle: false,
    alertText: "",
    alertType: "success",
    // sign-up
    sUsername: "",
    sPass: "",
    sConfirmPass: "",
    sError: false,
    sShowPass: false,
    // Fab
    accountFab: false,
    myMarkersList: [] as {
      type: string;
      id: string;
      title: string;
      lat: number;
      lng: number;
    }[],
    sharedMarkersList: [] as {
      type: string;
      owner: string;
      id: string;
      title: string;
      lat: number;
      lng: number;
    }[],
    showMePopup: false,
    showMyMarkerPopup: false,
    showSharedMarkerPopup: false,
    // marker args to show in dialog
    showMarkerDialog: false,
    clickedMarker: {
      id: "",
      title: "",
      description: "",
      owner: "",
      type: "",
      lat: 0,
      lng: 0,
    },
  }),
  mounted() {
    if (!localStorage.getItem("jwt")) {
      this.loginDialog = true;
    }
    this.logged = this.loggedIn();
    this.requests = new Requests("moc-backend.azurewebsites.net", "3000");
    this.initMap();
    this.initLocation();
    this.initMarkers();
    this.initSharedMarkers();
  },
  watch: {
    password: function () {
      this.loginError = "";
    },
  },
  methods: {
    initMap() {
      this.map = L.map("leafletMap", {
        center: new L.LatLng(40.731253, -73.996139),
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });
      this.tileLayer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
        zIndex: 1,
      }).addTo(this.map);
      this.map.on("zoomstart", () => {
        this.zooming = true;
      });
      this.map.on("zoomend", () => {
        this.zooming = false;
      });
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
                iconSize: [55, 50],
              }),
            }
          )
            .addTo(this.map)
            .on("click", () => {
              this.showMePopup = true;
            })
            .bindPopup("your Location");
          this.map.setView(
            new L.LatLng(position.coords.latitude, position.coords.longitude),
            this.map.getMaxZoom()
          );
        });
        setInterval(() => this.refreshLocation(), 300);
      } else {
        alert("no geoss location");
      }
    },
    async initMarkers() {
      this.myMarkers = new L.FeatureGroup();
      this.myMarkers.addTo(this.map);
      // request then add markers
      const username = localStorage.getItem("username") as string;
      const res = await this.requests.getMarkers(username);
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
            customId: marker.id,
            type: marker.type,
            description: marker.description,
            title: marker.name,
            icon: new L.Icon({
              iconUrl: require("../assets/markerIcon.png"),
              iconSize: [50, 50],
            }),
          }
        )
          .addTo(this.myMarkers)
          .on("click", () => {
            this.clickedMarker = {
              id: marker.id,
              title: marker.name,
              type: marker.type,
              description: marker.description,
              owner: marker.username,
              lat: marker.lat,
              lng: marker.lng,
            };
            this.showMarkerDialog = true;
          });
        this.myMarkersList.push({
          type: marker.type,
          id: marker.id,
          title: marker.name,
          lat: marker.lat,
          lng: marker.lng,
        });
      }
    },
    async initSharedMarkers() {
      this.sharedMarkers = new L.FeatureGroup();
      this.sharedMarkers.addTo(this.map);
      const res = await this.requests.getSharedMarkers();
      for (const marker of res.data) {
        if (marker.username == localStorage.getItem("username")) {
          continue;
        }
        new L.Marker(
          {
            lat: marker.lat,
            lng: marker.lng,
          },
          {
            customId: marker.id,
            type: marker.type,
            description: marker.description,
            title: marker.name,
            icon: new L.Icon({
              iconUrl: require("../assets/sharedMarkerIcon.png"),
              iconSize: [50, 50],
            }),
          }
        )
          .addTo(this.sharedMarkers)
          .on("click", () => {
            this.clickedMarker = {
              id: marker.id,
              title: marker.name,
              type: marker.type,
              description: marker.description,
              owner: marker.username,
              lat: marker.lat,
              lng: marker.lng,
            };
            this.showMarkerDialog = true;
          });
        this.sharedMarkersList.push({
          type: marker.type,
          owner: marker.username,
          id: marker.id,
          title: marker.name,
          lat: marker.lat,
          lng: marker.lng,
        });
      }
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
      const uid = this.getUID();
      const resp = await this.requests.addMarker({
        username: localStorage.getItem("username") as string,
        id: uid,
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
      new L.Marker(
        {
          lat: this.currentLat,
          lng: this.currentLng,
        },
        {
          customId: uid,
          type: this.type,
          description: this.description,
          shared: this.radioButtonValue == "yes" ? true : false,
          title: this.name,
          icon: new L.Icon({
            iconUrl: require("../assets/markerIcon.png"),
            iconSize: [55, 50],
          }),
        }
      )
        .addTo(this.myMarkers)
        .on("click", () => {
          this.clickedMarker = {
            id: uid,
            title: this.name,
            type: this.type,
            description: this.description,
            owner: localStorage.getItem("username") as string,
            lat: this.currentLat,
            lng: this.currentLng,
          };
          this.showMarkerDialog = true;
        });
      this.myMarkersList.push({
        type: this.type,
        id: uid,
        title: this.name,
        lat: this.currentLat,
        lng: this.currentLng,
      });
      // Reset variables
      this.name = "";
      this.description = "";
      this.currentLat = 0;
      this.currentLng = 0;
      this.type = "";
      this.radioButtonValue = "no";
    },
    async deleteClickedMarker() {
      const resp = await this.requests.deleteMarker(this.clickedMarker.id);
      if (resp.status == RequestStatus.ERROR) {
        this.alertUser("Error deleting marker", "error");
        return;
      }
      for (const marker of this.myMarkers.getLayers() as L.Marker[]) {
        if (this.clickedMarker.id == marker.options.customId) {
          this.myMarkers.removeLayer(marker);
        }
      }
      for (const marker of this.myMarkersList) {
        if (this.clickedMarker.id == marker.id) {
          const index = this.myMarkersList.indexOf(marker);
          if (index > -1) {
            this.myMarkersList.splice(index, 1);
          }
        }
      }
      this.alertUser("deleted marker", "success");
      this.showMarkerDialog = false;
    },
    getUID() {
      return new Date().valueOf().toString();
    },
    refreshLocation() {
      if (navigator.geolocation && !this.zooming) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.currentLat = position.coords.latitude;
          this.currentLng = position.coords.longitude;
          this.me.setLatLng(
            new L.LatLng(position.coords.latitude, position.coords.longitude)
          );
        });
      }
    },
    loggedIn(): boolean {
      if (localStorage.getItem("jwt") == undefined) {
        return false;
      }
      return true;
    },
    async loginCallback() {
      const res = await this.requests.login({
        username: this.username,
        password: this.password,
      });
      if (res.status == RequestStatus.ERROR) {
        this.alertUser("Login failed", "error");
        this.loginError = "Could not login";
      } else {
        localStorage.setItem("jwt", res.data.token);
        localStorage.setItem("username", this.username);
        this.loginDialog = false;
        this.logged = true;
        window.location.reload();
        this.alertUser("Login successful", "success");
      }
      this.username = "";
      this.password = "";
    },
    async signUpCallback() {
      const res = await this.requests.register({
        name: this.sUsername,
        password: this.sPass,
      });
      if (res.status == RequestStatus.ERROR) {
        this.alertUser("Sign-up failed", "error");
      } else {
        this.signUpDialog = false;
        this.loginDialog = true;
        this.alertUser("Login successful", "success");
      }
      this.sUsername = "";
      this.sPass = "";
      this.sConfirmPass = "";
    },
    logoutCallback() {
      localStorage.removeItem("jwt");
      localStorage.removeItem("username");
      window.location.reload();
    },
    alertUser(text: string, type: string) {
      this.alertText = text;
      this.alertType = type;
      this.alertToggle = true;
    },
    goToLocation() {
      this.map.setView(this.me.getLatLng(), this.map.getMaxZoom());
    },
    passMatch() {
      if (this.sPass == this.sConfirmPass) {
        return true;
      } else {
        return "Passwords don't match!";
      }
    },
    passLength() {
      if (this.sPass.length >= 8) {
        return true;
      } else {
        return "Password must at least have 8 characters";
      }
    },
    passContainsNum() {
      if (/\d/.test(this.sPass)) {
        return true;
      } else {
        return "Password must include a number";
      }
    },
    goToMarker(item: { title: string; lat: number; lng: number }) {
      this.showList = false;
      this.map.setView(new L.LatLng(item.lat, item.lng), this.map.getMaxZoom());
    },
    toggleSharedMarkers() {
      if (this.sharedMarkersActive) {
        this.map.removeLayer(this.sharedMarkers);
        this.sharedMarkersActive = false;
      } else {
        this.map.addLayer(this.sharedMarkers);
        this.sharedMarkersActive = true;
      }
    },
  },
});
</script>
<style scoped>
@import url("https://unpkg.com/leaflet@1.7.1/dist/leaflet.css");
#leafletMap {
  height: 99vh;
  z-index: 0;
}
</style>