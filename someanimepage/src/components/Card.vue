<style lang="scss">

</style>

<template>
<div class="flex w-screen h-screen justify-center items-center bgoverlay fixed z-50 left-0 top-0 fontbase coloraccentblack" @click.self="shutcloseup">
    <div class="w-8/12 max-w-1536 h-auto max-h-3/4 overflow-y-auto bgbase rounded-md">
        <section>
            <article id="headings" class="border-b w-full borderaccentmetal p-6">
                <p class="fontheading coloraccentred text-2xl">{{ animeCloseUp.title }}</p>
                <p class="fontheading coloraccentmetal text-base">
                    Synonyms: <span v-for="synonym in animeCloseUp.title_synonyms" :key="synonym" class="fontheading coloraccentmetal text-base">{{ synonym }}</span>
                </p>
            </article>
            <article id="details" class="border-b w-full borderaccentmetal p-6">
                <p class="inline-block mr-2"><span class="font-semibold coloraccentred">Aired:</span> {{ dates.from }}</p>
                <p class="inline-block mr-2"><span class="font-semibold coloraccentred">To:</span> {{ dates.to }}</p>

                <p class="inline-block">
                    <span class="font-semibold coloraccentred inline-block">
                        Genre:
                    </span>
                    <span v-for="(genre, index) in animeCloseUp.genres" :key="genre.mal_id" class="text-base mr-1">{{ genre.name }}<span v-if="index !== (animeCloseUp.genres.length - 1)">,</span>
                    </span>
                </p>
            </article>
            <article id="furtherinformation" class="border-b w-full borderaccentmetal p-6 flex flex-row justify-center items-center">
                <div class="w-1/2">
                    <img :src="animeCloseUp.image_url" :alt="animeCloseUp.mal_id" onerror="this.src='https://via.placeholder.com/225'" class="responsive max-w-225 m-auto cardshadow">
                </div>
                <p class="w-1/2 mr-2 h-auto"><span class="font-semibold coloraccentred">Synopsis: </span>
                    <span id="visible">
                        {{ visiblepart }}
                    </span>
                    <span :class="{'hidden': !isHidden}">...</span> <button type="button" :class="{'hidden': !isHidden}" class="m-1 coloraccentred" @click="readmore">read more</button>
                    <span :class="{'hidden': isHidden}">
                        {{ hiddenpart }}
                    </span></p>
            </article>
            <article id="details" class="border-b w-full borderaccentmetal p-6 flex flex-row justify-center items-start">
                <div class="w-1/2">
                    <iframe v-if="animeCloseUp.trailer_url" width="420" height="315" :src="animeCloseUp.trailer_url" frameborder="0" allowfullscreen class="cardshadow">
                    </iframe>
                </div>
                <p class="w-1/2 ml-2">
                    <span class="font-semibold coloraccentred">Related:</span>
                    <template v-if="animeCloseUp.related?.length > 0">
                        <span v-for="(relatedstory, index) in animeCloseUp.related" :key="index" class="text-base mr-1">
                            <p v-for="item in relatedstory" :key="item.mal_id" class="text-base mr-1">
                                <span class="font-semibold">Name:</span> {{ item.name }}
                                <span class="font-semibold">Type:</span> {{ item.type }}
                            </p>
                        </span>
                    </template>
                    <template v-else>
                        <p class="text-base mr-1">Nothing related was found...</p>
                    </template>
                </p>
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
        var hiddenpart = ref("");
        var visiblepart = ref("");

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

        // Display more text
        let isHidden = ref(true);
        const readmore = () => {
            isHidden.value = !isHidden.value;
        }

        onMounted(() => {
            // Search ID
            axios.get(`https://api.jikan.moe/v3/anime/${props.anime_id}`)
                .then((response) => {
                    if (response.status === 200 && response.data) {
                        animeCloseUp.value = response.data;

                        if (response.data.synopsis.length > 800) {
                            let substrings = response.data.synopsis.split(' ');
                            console.log(Math.round(substrings.length / 2));

                            for (let i = 0; i < Math.round(substrings.length / 2); i++) {
                                if (i === Math.round(substrings.length / 2) - 1) {
                                    visiblepart.value += substrings[i];
                                } else {
                                    visiblepart.value += substrings[i] + ' ';
                                }
                            }

                            for (let i = Math.round(substrings.length / 2); i < substrings.length; i++) {
                                if (i === Math.round(substrings.length / 2)) {
                                    hiddenpart.value += '' + substrings[i] + ' ';
                                } else {
                                    hiddenpart.value += substrings[i] + ' ';
                                }
                            }
                        } else {
                            visiblepart.value = response.data.synopsis;
                        }
                        console.log(visiblepart.value);
                        console.log(hiddenpart.value);

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
            shutcloseup,
            hiddenpart,
            visiblepart,
            isHidden,
            // methods
            readmore
        }
    }

}
</script>
