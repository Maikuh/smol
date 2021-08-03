<template>
  <main id="app">
    <header>
      <Logo />
      <h4 id="slogan">Get your URLs <i id="slogan-italic">smoled </i>🐥</h4>
    </header>

    <form class="form" v-if="formVisible" @submit.prevent="createSmol()">
      <div v-if="error" class="error">
        <ul>
          <li v-for="(err, i) in error" :key="i">{{ err }}</li>
        </ul>
      </div>

      <input
        class="input"
        type="text"
        v-model="url"
        name="url"
        id="url"
        placeholder="Enter an URL"
      />

      <button type="submit" class="create">create</button>
    </form>

    <div v-if="!formVisible && created" class="result-container">
      <p class="created">
        Your short url is:
        <a :href="created" target="_blank">{{ created }}</a>
      </p>

      <button class="reset" @click="reset">another one</button>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Logo from "../components/Logo.vue";
import config from "../config";

interface Data {
  url: string;
  error: string | null;
  created: string | null;
  formVisible: boolean;
}

export default defineComponent({
  name: "Home",
  components: {
    Logo
  },
  data: () =>
    ({
      url: "",
      error: null,
      created: null,
      formVisible: true,
    } as Data),
  methods: {
    async createSmol() {
      this.error = null;

      const response = await fetch(`${config.apiBaseUrl}/new`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          url: this.url,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        this.formVisible = false;
        this.created = `${config.apiBaseUrl}/${result.slug}`;
      } else if (response.status === 429) {
        this.error =
          "You are sending too many requests. Try again in 30 seconds.";
      } else {
        const result = await response.json();
        this.error = result.message;
      }
    },
    reset() {
      this.formVisible = true;
      this.created = null;
      this.error = null;
      this.url = "";
    },
  },
});
</script>

<style>
header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 3rem;
}

#slogan {
  color: #fafafa;
  text-align: center;
  padding: 1em 0;
}

#slogan-italic {
  color: rgb(54, 195, 251);
}

.error {
  background: #a63446;
  padding: 0.5rem 3rem;
  color: #ffffff;
  margin-bottom: 1rem;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
}

.input,
.create,
.reset {
  margin: 1rem 0;
  max-width: 100%;
}

.input {
  font-family: inherit;
  padding-bottom: 1rem;
  background: none;
  border: none;
  color: #ffffff;
  border-bottom: 2px solid #ffffff;
  text-align: center;
  font-size: 1.25rem;
  transition: border-bottom-color 0.3s ease-in-out;
  caret-color: rgb(139, 222, 255);
}

.input:focus {
  outline: none;
  border-bottom-color: rgb(139, 222, 255);
}

.input::placeholder {
  color: #ffffff;
  opacity: 0.7;
}

.create {
  cursor: pointer;
  font-family: inherit;
  font-size: 1.15rem;
  color: #262626;
  border: none;
  background-color: rgb(139, 222, 255);
  padding: 0.75em 1.25rem;
  box-shadow: 3px 3px 0 0 #ffffff;
  transition: box-shadow 0.2s ease-in-out;
}

.create:hover {
  box-shadow: 0 0 0 0 #ffffff;
}

.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.reset {
  cursor: pointer;
  color: #262626;
  border: none;
  background-color: rgb(255, 173, 140);
  font-family: inherit;
  padding: 0.75em 1.25rem;
  box-shadow: 3px 3px 0 0 #ffffff;
  transition: box-shadow 0.2s ease-in-out;
}

.reset:hover {
  box-shadow: 0 0 0 0 #ffffff;
}

.created {
  color: #ffffff;
}

.created a {
  color: inherit;
}
</style>
