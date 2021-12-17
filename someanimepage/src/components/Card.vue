<style lang="scss">

</style>

<template>
<div class="flex w-screen h-screen justify-center items-center bgoverlay fixed z-50 fontbase coloraccentblack" @click.self="shutcloseup">
    <div class="w-8/12 h-v3/4 overflow-y-auto bgbase rounded-sm">
        <section>
            <article id="headings" class="border-b w-full borderaccentmetal p-6">
                <p class="fontheading coloraccentred text-2xl">{{ animeCloseUp.title }}</p>
                <p class="fontheading coloraccentmetal text-base">
                    Synonyms: <span v-for="synonym in animeCloseUp.title_synonyms" :key="synonym" class="fontheading coloraccentmetal text-base">{{ synonym }}</span>
                </p>
            </article>
            <article id="details" class="border-b w-full borderaccentmetal p-6">
                <p class="inline-block mr-2"><span class="font-semibold">Aired:</span> {{ dates.from }}</p>
                <p class="inline-block mr-2"><span class="font-semibold">To:</span> {{ dates.to }}</p>

                <p class="inline-block"><span class="font-semibold">Genre: </span><span v-for="(genre, index) in animeCloseUp.genres" :key="genre.mal_id" class="text-base mr-1">{{ genre.name }}<span v-if="index !== (animeCloseUp.genres.length - 1)">,</span> </span></p>
            </article>
            <article id="media">
                <div class="w-1/6 max-w-225 rounded-3xl">
                    <img :src="animeCloseUp.image_url" :alt="animeCloseUp.mal_id" onerror="this.src='https://via.placeholder.com/225'" class="responsive">
                </div>
                <iframe width="420" height="315" source :src="animeCloseUp.trailer_url">
                </iframe>
            </article>
            <article id="furtherinformation">
                <p>{{ animeCloseUp.synopsis }}</p>
                <p>{{ animeCloseUp.related }}</p>
            </article>
        </section>

    </div>
</div>
</template>

<script>
import {
    ref,
    onMounted,
    reactive
} from "vue";

import axios from "axios";

export default {
    props: {
        anime_id: Number
    },
    setup(props, context) {
        var animeCloseUp = ref({});
        var dates = reactive({
            from: "",
            to: ""
        });

        const shutcloseup = (e) => {
            context.emit('zoomOut');
        }

        const formatDate = (dateobject) => {
            if (dateobject !== null) {
                if (dateobject.from !== null) {
                    dates.from = new Date(Date.parse(dateobject.from)).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        year: 'numeric',
                        month: 'numeric'
                    });
                } else {
                    dates.from = "N/A";
                }
                if (dateobject.to !== null) {
                    dates.to = new Date(Date.parse(dateobject.to)).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        year: 'numeric',
                        month: 'numeric'
                    });
                } else {
                    dates.to = "N/A";
                }
            }
        }

        onMounted(() => {
            // Search ID
            axios.get(`https://api.jikan.moe/v3/anime/${props.anime_id}`)
                .then((response) => {
                    if (response.status === 200 && response.data) {
                        console.log(response.data)
                        animeCloseUp.value = response.data;

                        formatDate(response.data.aired);
                    }

                })
                .catch(error => {
                    console.log(error);
                })
        });

        return {
            animeCloseUp,
            dates,
            shutcloseup
        }
    }

}
</script>
