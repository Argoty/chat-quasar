<template>
  <div v-if="uidSeleccionado !== ''" class="q-mt-xl" ref="RefChat">
    <div class="q-pa-md row justify-center">
      <div style="width: 100%; max-width: 100%">
        <q-chat-message
          v-for="chat in chats"
          :key="chat.id"
          :name="chat.user"
          :text="[chat.texto]"
          :sent="chat.uid == user.uid ? true : false"
          :stamp="chat.fecha !== null ? formatFecha(chat.fecha.seconds) : ''"
        />
      </div>
    </div>
    <q-footer>
      <q-form @submit.prevent="enviarMensaje">
        <q-toolbar class="bg-primary text-white row">
          <q-input
            rounded
            outlined
            dense
            class="col-grow q-mr-sm"
            bg-color="white"
            v-model="message"
            placeholder="Escribe un mensaje"
            required
            :loading="loadingInput"
            ref="input"
            clearable
          />
          <q-btn round flat icon="send" type="submit" />
        </q-toolbar>
      </q-form>
    </q-footer>
  </div>
  <div v-else>
    <h5>Selecciona usuario para hablar</h5>
  </div>
</template>

<script>
import { ref, inject, watch } from "vue";
import { useAuth } from "@vueuse/firebase/useAuth";
import { auth, firestore } from "src/boot/firebase";
import {
  collection,
  serverTimestamp,
  addDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
const { format } = require("date-fns");

export default {
  name: "VistaChat",
  setup() {
    const uidSeleccionado = inject("uidSeleccionado");
    const message = ref("");
    const { user } = useAuth(auth);
    const chats = ref([]);
    const RefChat = ref(null);
    const loadingInput = ref(false);
    const input = ref(null);
    const loader = inject("loader");

    let unsubscribe;

    const obtenerData = (uidSeleccionadoRef) => {
      chats.value = [];
      const q = query(
        collection(firestore, "chat", user.value.uid, uidSeleccionadoRef),
        orderBy("fecha")
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            chats.value.push({ ...change.doc.data(), id: change.doc.id });
          }

          if (RefChat.value !== null) {
            setTimeout(
              () => window.scrollTo(0, RefChat.value.scrollHeight),
              100
            );
          }
        });
      });
    };

    // ESTA OBSERVANDO EL USUARIO QUE SE SELECCIONE PARA OBTENER DATA
    watch(
      () => uidSeleccionado.value,
      (newId) => {
        if (unsubscribe) {
          unsubscribe();
          if (newId) {
            obtenerData(newId);
          }
          loader.value = false;
        } else {
          obtenerData(newId);
        }
      }
    );

    const enviarMensaje = async () => {
      loadingInput.value = true;
      try {
        const data = {
          user: user.value.email,
          texto: message.value,
          fecha: serverTimestamp(),
          uid: user.value.uid,
        };
        message.value = "";

        await addDoc(
          collection(firestore, "chat", uidSeleccionado.value, user.value.uid),
          data
        );

        await addDoc(
          collection(firestore, "chat", user.value.uid, uidSeleccionado.value),
          data
        );

        loadingInput.value = false;
        input.value.focus();
      } catch (e) {
        console.log(e);
      }
    };

    const formatFecha = (fechaSegundos) => {
      // Convierte el timestamp a una fecha
      const fecha = new Date(fechaSegundos * 1000);
      const fechaFormateada = format(fecha, "dd/MM/yyyy HH:mm");

      return fechaFormateada;
    };

    return {
      message,
      enviarMensaje,
      uidSeleccionado,
      chats,
      user,
      RefChat,
      loadingInput,
      input,
      formatFecha,
    };
  },
};
</script>
