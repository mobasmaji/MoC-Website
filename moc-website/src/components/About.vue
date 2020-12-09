<template>
  <v-container fluid class="ma-4">
    <v-layout row wrap>
      <v-flex xs12 class="text-md-center" mt-5>
        <h2>
          Welcome to <br />
          MarkerShare
        </h2>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-8>
        <blockquote class="text-md-center">
          It's a Single Page application <br />
          made with Vue.js, Leaflet, Typescript <br />
          and deployed with Azure.<br />
        </blockquote>
        <v-flex xs12 sm6 offset-sm3 mt-8>
          <blockquote class="text-md-center">
            You can add markers anywhere,<br />
            but you have to be in that position. <br />
            You can also share markers<br />
            and explore markers from others<br />
          </blockquote>
        </v-flex>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-8>
        <blockquote class="text-md-center">
          The project is a part of <br />
          a course at my university
        </blockquote>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 class="text-sm-center" mt-10>
        <v-btn color="primary" to="/">Back to Map</v-btn>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 class="text-sm-center" mt-10>
        <blockquote class="text-sm-center">Made by</blockquote>
        <blockquote class="text-xl-center">Mohamad Basmaji</blockquote>
      </v-flex>
    </v-layout>
  </v-container>
</template>
