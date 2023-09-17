<template>
  <q-page padding>
    <VistaAcceso v-if="!isAuthenticated" />
    <div v-else>
      <VistaUsuariosActivos />
      <VistaChat />
    </div>

    <div class="text-center q-mt-xl" v-if="loader">
      <q-spinner-pie color="primary" size="15em" />
    </div>
  </q-page>
</template>

<script>
import { ref, provide, inject } from "vue";
import VistaAcceso from "src/components/VistaAcceso.vue";
import VistaUsuariosActivos from "src/components/VistaUsuariosActivos.vue";
import VistaChat from "src/components/VistaChat.vue";

import { auth } from "src/boot/firebase";
import { useAuth } from "@vueuse/firebase/useAuth";

export default {
  name: "IndexPage",
  components: { VistaAcceso, VistaUsuariosActivos, VistaChat },
  setup() {
    const { isAuthenticated } = useAuth(auth);

    const uidSeleccionado = ref("");
    provide("uidSeleccionado", uidSeleccionado);

    const loader = inject("loader");

    return {
      isAuthenticated,
      loader
    };
  },
};
</script>
