<template>
  <div class="q-px-xl" v-if="!loader">
    <h5>Formulario de {{ acceder ? "Login" : "Registro" }} <q-icon :name="acceder ? 'login' : 'app_registration'" size="md"/></h5>
    <q-form class="q-gutter-md" @submit.prevent="procesarForm">
      <q-input
        label="Email"
        v-model="email"
        type="email"
        clearable
        required
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Por favor escribe algo',
          (val) =>
            /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/.test(
              val
            ) || 'El email debe ser valido',
        ]"
        ><template v-slot:prepend> <q-icon name="email" /> </template
      ></q-input>
      <q-input
        label="Contraseña"
        v-model="password"
        :type="verPassword ? 'text' : 'password'"
        clearable
        required
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Por favor escribe algo']"
        ><template v-slot:prepend> <q-icon name="password" /> </template>
        <template v-slot:append>
          <q-btn
            :icon="!verPassword ? 'visibility' : 'visibility_off'"
            @click="verPassword = !verPassword"
            round
            dense
            flat
          /> </template
      ></q-input>

      <q-btn color="primary" type="submit">{{
        acceder ? "Login" : "Registrarse"
      }}</q-btn>
      <q-btn color="primary" outline v-if="!acceder" @click="acceder = true"
        >¿Ya tienes cuenta?</q-btn
      >
      <q-btn color="negative" outline v-else @click="acceder = false"
        >¿No tienes cuenta?</q-btn
      >
    </q-form>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref, inject } from "vue";
import { auth, firestore } from "src/boot/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";

export default {
  name: "VistaAcceso",
  setup() {
    const $q = useQuasar();
    const email = ref("");
    const password = ref("");
    const acceder = ref(true);
    const uidSeleccionado = inject("uidSeleccionado");
    const loader = inject("loader");
    const verPassword = ref(false);

    const procesarForm = async () => {
      loader.value = true;
      try {
        if (!acceder.value) {
          // Registro
          const user = await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
          );

          const data = user.user;

          // Agregar documento de usuario a la base de datos
          await setDoc(doc(firestore, "usuarios", data.uid), {
            email: data.email,
            estado: true,
            uid: data.uid,
          });

          $q.notify({
            color: "green-10",
            textColor: "white",
            icon: "login",
            message: "Usuario Registrado Correctamente!",
          });
        } else {
          // Login
          const user = await signInWithEmailAndPassword(
            auth,
            email.value,
            password.value
          );

          // Actualizar documento del login de usuario a la base de datos
          await updateDoc(doc(firestore, "usuarios", user.user.uid), {
            estado: true,
          });

          console.log(user.user);

          $q.notify({
            color: "green-10",
            textColor: "white",
            icon: "login",
            message: "Usuario Logeado Correctamente!",
          });
        }

        email.value = "";
        password.value = "";
        uidSeleccionado.value = "";
      } catch (e) {
        console.log(e);
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: e.message,
        });
      }
      loader.value = false;
    };

    return {
      email,
      password,
      procesarForm,
      acceder,
      loader,
      verPassword,
    };
  },
};
</script>
