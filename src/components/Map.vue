<script lang="ts">
import "leaflet/dist/leaflet.css";
import "../assets/bootstrap.css";
import { LMap, LTileLayer, LMarker, LIcon } from "@vue-leaflet/vue-leaflet";
import type { Location } from "@/models/data";
import store from "../store/data";
import locationService from "@/services/location";
import Constants from "@/services/constants";
import { ref } from "vue";
import Utils from "@/services/utils";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
  },
  data() {
    return {
      zoom: 10,
      location: [0, 0],
    };
  },
  mounted() {
    this.location = [store.getters.mapCenter.lat, store.getters.mapCenter.long];
    this.zoom = store.getters.zoom;
  },
  methods: {
    addSpotMarker: async (event: any) => {
      if (event.latlng) {
        let location: Location = {
          lat: event.latlng.lat,
          long: event.latlng.lng,
        };
        let newMarkerPath = await locationService.createSpotMarker(
          location,
          "spottedEnemy"
        );
        setTimeout(async () => {
          await locationService.removeSpotMarker(newMarkerPath);
        }, store.getters.spotDurationMS);
      }
    },
    MarkerDistance: function (lat: number, long: number) {
      let currentLoc = locationService.location;

      let dist = Utils.CoordDistance(
        currentLoc.lat,
        currentLoc.long,
        lat,
        long
      );
      return (dist * 1).toFixed(2) + "km";
    },
  },
  computed: {},
};
</script>

<template>
  <div>
    <l-map
      id="map"
      ref="map"
      :zoom="10"
      :center="[$store.getters.mapCenter.lat, $store.getters.mapCenter.long]"
      :minZoom="3"
      @click="addSpotMarker"
      :maxZoom="20"
      :useGlobalLeaflet="false"
      :options="{
        attributionControl: false,
        zoomControl: false,
      }"
    >
      <l-tile-layer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <!-- <MapIcon
        :lat-lng="[$store.getters.mapCenter.lat, $store.getters.mapCenter.long]"
      ></MapIcon> -->
      <l-marker
        v-for="marker in $store.getters.markers"
        :lat-lng="[marker.lat, marker.long]"
        :key="marker.id"
      >
        <l-icon>
          <div class="icon">
            <img :src="`src/assets/${marker.iconType}.svg`" />
            <span
              v-if="marker.iconType.includes('leader')"
              class="squadNumber"
              >{{ marker.squadNumber }}</span
            >
          </div>
        </l-icon>
      </l-marker>
      <l-marker
        v-for="(marker, markerId) in $store.getters.spotMarkers"
        :lat-lng="[marker.lat, marker.long]"
        :key="markerId"
      >
        <l-icon>
          <div class="icon">
            <img class="enemy-marker" :src="`src/assets/enemy.svg`" />
            <!-- <span class="distance">{{
              MarkerDistance(marker.lat, marker.long)
            }}</span> -->
          </div>
        </l-icon>
      </l-marker>
    </l-map>
  </div>
</template>

<style scoped>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  /* left: 0px !important;
  width: 50% !important; */
}
#debug {
  position: absolute;
  top: 54px;
  bottom: 0;
  left: 50% !important;
  width: 50% !important;
}
.squadNumber {
  font-family: "Impact", Times, serif;
  top: 0px;
  left: 10px;
  color: white;
  text-shadow: 2px 2px black;
  position: absolute;
  font-size: 1.5em;
  text-align: center;
}
.icon {
  background-color: red;
  display: flex;
  justify-content: center; /* align horizontal */
  align-items: center; /* align vertical */
}
img {
  position: absolute;
  width: 3em;
  height: 3em;
}
.enemy-marker {
  width: 2em;
  height: 2em;
}
.distance {
  font-family: "Impact", Times, serif;
  top: 0px;
  left: 10px;
  color: white;
  text-shadow: 2px 2px black;
  position: absolute;
  font-size: 1.5em;
  text-align: center;
}
</style>
