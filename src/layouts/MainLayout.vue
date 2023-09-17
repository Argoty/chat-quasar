<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-img
          alt="Vuetify Logo"
          fit="contain"
          src="../assets/chat.png"
          width="40px"
        />
        <q-toolbar-title class="titulo">
          {{
            isAuthenticated ? user.email : "Chat"
          }}
        </q-toolbar-title>

        <div>
          <q-btn
            color="white"
            outline
            v-if="isAuthenticated"
            @click="salir"
            icon-right="logout"
            label="Salir"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { auth, firestore } from "src/boot/firebase";
import { useAuth } from "@vueuse/firebase/useAuth";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { ref, provide } from "vue";
import { useQuasar } from "quasar";

export default {
  name: "MainLayout",

  components: {},
  setup() {
    const $q = useQuasar();
    const { isAuthenticated, user } = useAuth(auth);
    const loader = ref(false);
    provide("loader", loader);

    const salir = async () => {
      loader.value = true;
      await updateDoc(doc(firestore, "usuarios", user.value.uid), {
        estado: false,
      });
      await signOut(auth);

      $q.notify({
        color: "grey-10",
        textColor: "white",
        icon: "logout",
        message: "Acabas de salir del chat!",
      });
      loader.value = false;
    };
    return {
      isAuthenticated,
      user,
      salir,
    };
  },
};
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Belanosima&family=Rubik&family=Russo+One&display=swap");
.titulo {
  font-family: "Belanosima", sans-serif;
  font-family: "Rubik", sans-serif;
  font-family: "Russo One", sans-serif;
}
</style>
