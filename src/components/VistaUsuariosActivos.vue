<template>
  <q-page-sticky position="top" expand class="tabs-zindex">
    <q-tabs
      v-model="uidSeleccionado"
      inline-label
      outside-arrows
      mobile-arrows
      no-caps
      class="bg-primary text-white shadow-2 full-width"
    >
      <q-tab
        v-for="user in arraySinUser"
        :key="user.uid"
        :name="user.uid"
        icon="account_circle"
        :label="user.email"
        :class="user.estado ? 'text-white' : 'text-grey'"
      />
    </q-tabs>
  </q-page-sticky>
</template>

<script>
import { computed, inject, ref } from "vue";
import { collection, query, onSnapshot } from "firebase/firestore";
import { firestore } from "src/boot/firebase";
import { auth } from "src/boot/firebase";
import { useAuth } from '@vueuse/firebase/useAuth'

export default {
  name: "VistaUsuariosActivos",

  setup() {
    const uidSeleccionado = inject("uidSeleccionado");
    const users = ref([]);
    const { user } = useAuth(auth)

    // Obteniendo los usuarios que se conectan o salen
    const q = query(collection(firestore, "usuarios"));

    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {

        if (change.type === "added") {
          users.value = [...users.value, change.doc.data()];
          users.value = users.value.sort((a, b) => b.estado - a.estado); // ordenar por estado
        }
        if (change.type === "modified") {
          users.value = users.value.map((u) =>
            u.uid == change.doc.data().uid ? { ...u, estado: change.doc.data().estado } : u
          );
          users.value = users.value.sort((a, b) => b.estado - a.estado); // ordenar por estado
        }
        if (change.type === "removed") {
          console.log("Usuario salio: ", change.doc.data());
        }
      });
    });


    const arraySinUser = computed(() => {
        return users.value.filter(u => u.uid !== user.value.uid)
    })

    return {
      uidSeleccionado,
      arraySinUser,
    };
  },
};
</script>

<style scoped>
.tabs-zindex {
  z-index: 2000;
}
</style>

