<style lang="scss">
.fixedTopLeft {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 99999;
}
</style>

<template>
<div id="characterview" class="fixedTopLeft animatecharacterin bgbase fontbase coloraccentmetal w-1/4 h-1/2 overflow-y-auto rounded-md shadow-lg" v-if="!isEmpty(characterData) && toggledElement">
    <div class="w-full flex flex-row justify-between p-2 mb-2 bgaccentblack">
        <p class="colorbase text-lg">Character of the day</p>
        <button @click="toggleview($event)" class="filterbtn p-1 rounded-md">close</button>
    </div>
    <div class="w-full p-2 h-full overflow-y-auto overflow-hidden">
        <div class="inline-block float-left mr-2">
            <img width="200" height="250" :src="characterData.image_url" alt="character_of_the_day" class="rounded-sm shadow-lg mr-2 w-full h-auto">
        </div>
        <div class="inline-block float-left w-475p text-sm overflow-y-auto h-full">
            <p class="fontheading">{{ characterData.name }}</p>
            <span><span class="fontheading">About:</span> {{ characterData.about }}</span>
            <p><span class="fontheading">Anime:</span> {{ characterData.animeography[0].name }}</p>
        </div>
    </div>
</div>
</template>

<script>
import {
    onMounted,
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
        const toggledElement = ref(true);

        const toggleview = (e) => {
            var parent = document.getElementById("characterview");

            parent.classList.remove('animatecharacterin');
            parent.classList.add('animatecharacterout');
            parent.onanimationend = () => {
                toggledElement.value = false;
            }
        }

        onMounted(() => {
            axios
                .get(`https://api.jikan.moe/v3/character/${random}`)
                .then((response) => {
                    if (response.status === 200 && response.data) {
                        characterData.value = response.data;
                    }
                })
                .catch((error) => {
                    return;
                });
        });

        return {
            characterData,
            isEmpty,
            toggledElement,
            // methods
            toggleview
        }
    },
};
</script>
