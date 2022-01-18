<style lang="scss">
.fixedTopLeft {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 99999;
}
</style>

<template>
<div class="fixedTopLeft bgbase fontbase coloraccentmetal w-1/3 h-2/3 overflow-y-auto" v-if="!isEmpty(characterData)">
    <img :src="characterData.image_url" alt="character_of_the_day">
    <span>Name: {{ characterData.name }}</span>
    <span>About: {{ characterData.about }}</span>
    <span>Anime: {{ characterData.animeography[0].name }}</span>
</div>
</template>

<script>
import {
    onMounted,
    reactive,
    ref
} from "vue";
import axios from "axios";
import {
    isEmpty
} from 'lodash'

export default {
    props: {
        currentGenreProp: Array,
        activeGenreProp: Number,
        activeSubFilterProp: String,
        disableFilterProp: Boolean
    },
    emits: ['subFilterAnimeEmit', 'filterAnimeEmit', 'resetFilterEmit'],
    setup() {
        const random = Math.floor(Math.random() * 500);

        const characterData = ref({});

        onMounted(() => {
            axios
                .get(`https://api.jikan.moe/v3/character/${random}`)
                .then((response) => {
                    if (response.status === 200 && response.data) {
                        console.log(response.data);
                        characterData.value = response.data;
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        });

        return {
            characterData,
            isEmpty
        }
    },
};
</script>
