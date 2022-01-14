<template>
<landing v-if="screenwidth > 720" />
<landingMobile v-else />
</template>

<script>
import landing from './components/Landing.vue';
import landingMobile from './components/LandingMobile.vue';
import {
    ref
} from "vue";
export default {
    components: {
        landing,
        landingMobile
    },
    setup() {
        var screenwidth = ref(window.innerWidth);

        window.addEventListener("resize", () => {
            screenwidth.value = window.innerWidth;
        });

        return {
            screenwidth
        }
    }
}
</script>
