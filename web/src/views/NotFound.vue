<template>
  <div>
    <img class="image" src="https://i.imgur.com/7Dyq483.png" />
    <h1 class="not-found">not found</h1>
    <a class="go-home-link" href="/">
      <svg
        class="arrow"
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M25.608 15.6363L25.608 11.8599L7.24473 11.8599L13.0697 6.03492L10.3914 3.35661L-9.02484e-05 13.7481L10.3914 24.1397L13.0697 21.4614L7.24473 15.6363L25.608 15.6363Z"
          fill="currentColor"
        />
      </svg>
      go home
    </a>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "NotFound",
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=MuseoModerno&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  font-family: "MuseoModerno", cursive, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #262626;
}

.image {
  filter: hue-rotate(80deg) saturate(1);
}

.not-found {
  margin: 1rem 0;
  color: #ffffff;
  font-size: 3rem;
  font-weight: normal;
}

.go-home-link {
  display: flex;
  align-items: center;
  color: #ffffff;
  font-size: 1.5rem;
}

.arrow {
  margin-right: 1rem;
  transition: transform 0.2s ease-in-out;
}

.go-home-link:hover .arrow {
  transform: translateX(10px);
}
</style>