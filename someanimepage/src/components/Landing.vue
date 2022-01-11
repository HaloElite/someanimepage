<style lang="scss">
@use '../style/_variables';
@use '../style/base/_layout';
@use '../style/base/_typography';
@use '../style/base/_images';
@use '../style/components/_borders';
@use '../style/components/_forms';
@use '../style/components/_buttons';
@use '../style/animations/_animation';

* {
    box-sizing: border-box;
}

body {
    background-color: variables.$base;
}
</style>

<template>
<div class="bgbase w-screen fontbase max-w-2048 m-auto">
    <card v-if="zoomIn" :anime_id="detailId" @zoomOut="zoomIn = false" />

    <div class="bghero bgbase h-v3/4 min-h-500 flex justify-center items-center">
        <div class="flex flex-col justify-center items-center">
            <h1 class="fontheading font-semibold xl:text-7xl text-4xl uppercase colorbase">
                Search Your Favorite Anime
            </h1>
            <div class="h-3 w-1/3 mt-2 bgbase rounded-full"></div>
        </div>
    </div>

    <div class="w-full flex flex-row justify-center items-center">
        <form @submit.prevent class="flex flex-row justify-center items-center w-1/4 m-auto p-10 rounded-3xl bgbase shadow-lg mb-6">
            <div class="form-group">
                <label for="keyword" class="coloraccentred">Name</label>
                <input required v-model="keyword" type="text" name="keyword" placeholder="Kimi No Iru Machi" class="py-2 px-4 leading-5 bgbase rounded-sm border-2 borderaccentred outline-none">
            </div>

            <button type="submit" class="accentbtn ml-4 py-2 px-4 leading-5 rounded-sm border-2 outline-none cursor-pointer" @click="searchname">suchen</button>
        </form>

        <form @submit.prevent class="flex flex-row justify-center items-center w-1/3 m-auto p-10 rounded-3xl bgbase shadow-lg mb-6">
            <div class="form-group">
                <label for="season-select" class="coloraccentred">Season</label>
                <select required v-model="season" name="season-select" id="season-select" class="py-2 px-4 leading-5 bgbase rounded-sm border-2 borderaccentred outline-none">
                    <option value="spring" selected>Spring</option>
                    <option value="summer">Summer</option>
                    <option value="fall">Fall</option>
                    <option value="winter">Winter</option>
                </select>
            </div>

            <div class="form-group ml-4">
                <label for="keyword" class="coloraccentred">Year</label>
                <input required v-model="year" min="1950" placeholder="2010" type="number" name="year" class="py-2 px-4 leading-5 bgbase rounded-sm border-2 borderaccentred outline-none">
            </div>
            <button type="submit" class="accentbtn ml-4 py-2 px-4 leading-5 rounded-sm border-2 outline-none cursor-pointer" @click="searchseason">suchen</button>
        </form>
    </div>

    <!-- ----------------- ANIME CARDS ----------------- -->

    <div v-if="animedata.length === 0" class="flex flex-row justify-center w-1/2 m-auto mt-4 mb-20 py-4 bgaccentred">
        <p class="text-2xl font-semibold colorbase">Much empty - such wow!</p>
    </div>

    <div v-if="error" class="flex flex-row justify-center w-1/2 m-auto mt-4 mb-20 py-4 bgbase">
        <p class="text-2xl font-semibold coloraccentred">{{ errormsg }}</p>
    </div>

    <div class="h-1 w-full shadow-xl" id="resultunfiltered"></div>

    <div v-if="animedata.length > 0 && !error" class="px-8">
        <ul class="flex flex-row justify-start flex-wrap w-full my-4">
            {{currentGenre}}
            <li @click="filterAnime(genre)" v-for="genre in currentGenre" :key="genre" class="filterbtn p-2 m-1 rounded-sm border-2 outline-none cursor-pointer font-medium" :class="{'disabledbutton': disableFilter, 'accentbtn': (activeGenre === genre)}">
                <!-- {{ genre.name }} -->
            </li>
            <li v-if="disableFilter" class="disabledbutton p-2 m-1 rounded-sm border-2 outline-none cursor-pointer font-medium">No genres available</li>
            <li @click="resetFilter('all')" class="accentbtn p-2 m-1 rounded-sm border-2 outline-none cursor-pointer font-medium" :class="{'disabledresetbutton': disableFilter}">reset</li>
        </ul>

        <ul class="flex flex-row justify-start flex-wrap w-full my-4">
            <li @click="subFilterAnime('date')" class="filterbtnVariant p-2 m-1 rounded-sm border-2 outline-none cursor-pointer font-medium" :class="{'accentbtnVariant': (activeSubFilter === 'date')}">
                Release Date
            </li>
            <li @click="subFilterAnime('name')" class="filterbtnVariant p-2 m-1 rounded-sm border-2 outline-none cursor-pointer font-medium" :class="{'accentbtnVariant': (activeSubFilter === 'name')}">
                Name
            </li>
            <li @click="resetFilter('sub')" class="accentbtnVariant p-2 m-1 rounded-sm border-2 outline-none cursor-pointer font-medium" :class="{'disabledresetvariantbutton': disableFilter}">reset</li>
        </ul>
    </div>

    <div v-if="!loading && !filtered && animedata.length > 0 && !error">
        <div class="flex flex-row flex-wrap justify-center items-start text-sm">
            <div v-for="(item, index) in animedata" :key="item.mal_id" class="animatelist relative w-1/6 max-w-225 max-h-3/4 my-6 mx-10 pb-2 bgbase overflow-y-auto rounded-3xl shadow-lg" @click="detailId = item.mal_id; zoomIn = true">
                <div class="absolute right-0 top-0 rounded-bl-lg p-1 bgbase max-w-50 text-center">
                    <p class="text-xs font-semibold">seit</p>
                    <p class="text-xs font-semibold">{{ datelist[index]?.month }}</p>
                    <p class="text-xs font-semibold">{{ datelist[index]?.year }}</p>
                </div>
                <img v-lazy="{src: item.image_url, loading: 'https://via.placeholder.com/225', error: 'https://via.placeholder.com/225'}" :alt="item.mal_id" class="responsive">
                <div class="p-4 min-h-150 transition">
                    <h1 class="font-semibold text-2xl coloraccentmetal pt-4">
                        {{ item.title }}
                    </h1>
                    <p class="coloraccentmetal font-semibold text-xs leading-5">
                        Rating: {{ item.score }}
                    </p>
                    <p class="coloraccentmetal font-semibold text-xs pb-1 border-b-2 borderaccentmetal-light">
                        Episodes: {{ item.episodes ? item.episodes : "N/A" }}
                    </p>
                    <p class="coloraccentmetal pt-4">
                        <span class="font-semibold">synopsis - </span>
                        {{ item.synopsis }}
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div v-else-if="!loading && filtered && animedata.length > 0 && !error">
        <div class="flex flex-row flex-wrap justify-center items-start text-sm">
            <div v-for="(item) in filteredanimedata" :key="item.mal_id" class="animatelist w-1/6 max-w-225 max-h-3/4 my-6 mx-10 pb-2 bgbase overflow-y-auto rounded-3xl shadow-lg" @click="detailId = item.mal_id; zoomIn = true">
                <img v-lazy="{src: item.image_url, loading: 'https://via.placeholder.com/225', error: 'https://via.placeholder.com/225'}" :alt="item.mal_id" class="responsive">
                <div class="p-4 min-h-150 transition">
                    <h1 class="font-semibold text-2xl coloraccentmetal py-4">
                        {{ item.title }}
                    </h1>
                    <p class="coloraccentmetal">
                        {{ item.synopsis }}
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div v-else-if="loading" class="flex flex-row flex-wrap justify-center items-center text-sm py-10 h-v1/3">
        <div class="loader">
            <div class="bar1"></div>
            <div class="bar2"></div>
            <div class="bar3"></div>
            <div class="bar4"></div>
            <div class="bar5"></div>
            <div class="bar6"></div>
        </div>
    </div>

</div>
</template>

<script>
import {
    ref,
    reactive,
    computed,
    onMounted
} from "vue";
import axios from "axios";
import {
    useStore
} from "vuex";

import card from "./Card.vue";

export default {
    components: {
        card
    },
    setup() {
        const store = useStore();

        // var animedata = ref();
        var keyword = ref("");
        var season = ref("spring");
        var year = ref(2010);
        var loading = ref(false);
        var errormsg = ref("");
        var error = ref(false);
        var filtered = ref(false);
        var subfiltered = ref(false);
        var datelist = reactive([]);
        var activeGenre = ref("");
        var activeSubFilter = ref("");
        var detailId = ref("");
        var zoomIn = ref(false);

        var animedata = computed({
            get() {
                return store.getters['getres'];
            },
            set(value) {
                store.commit('SET_RES', value);
            }
        });

        var filteredanimedata = computed({
            get() {
                return store.getters['getfilteredres'];
            },
            set(value) {
                store.commit('SET_FILTERED_RES', value);
            }
        });

        var subfilteredanimedata = computed({
            get() {
                return store.getters['getfilteredSubres'];
            },
            set(value) {
                store.commit('SET_FILTERED_SUB_RES', value);
            }
        });

        var disableFilter = computed({
            get() {
                return store.getters['getdisablefilter'];
            },
            set(value) {
                store.commit('SET_DISABLEFILTER', value);
            }
        });

        var currentGenre = computed({
            get() {
                return store.getters['getgenre'];
            },
            set(value) {
                store.commit('SET_GENRE', value);
            }
        });

        // -------------------------------------------------------------------------------------- Methods

        const extractGenres = async (animedata) => {
            store.commit('RESET_GENRE');

            animedata.forEach(anime => {
                if (anime.genres.length) {
                    anime.genres.forEach(genre => {
                        if (currentGenre.value.length === 0) {
                            currentGenre.value.push(genre);
                        } else {
                            currentGenre.value.forEach(element => {
                                console.log(element);
                            //     console.log(element.mal_id, genre.mal_id);
                            //     if (element.mal_id !== genre.mal_id) {
                            //         currentGenre.value.push(genre);
                            //     }
                            });
                        }
                    });
                }
            });
        }

        const extractDates = async (animedata) => {
            animedata.forEach(anime => {
                var month = new Date(Date.parse(anime.airing_start)).toLocaleDateString('de-DE', {
                    month: 'long'
                });

                var year = new Date(Date.parse(anime.airing_start)).toLocaleDateString('de-DE', {
                    year: 'numeric',
                });

                datelist.push({
                    year,
                    month
                });
            });
        }

        const filterAnime = (genre) => {
            if (disableFilter.value) {
                return;
            }

            var temp = animedata.value.filter(anime => {
                var temp_l = anime.genres.filter(check_genre => {
                    return check_genre.name === genre;
                });
                return (temp_l.length > 0);
            })
            filtered.value = true;
            filteredanimedata.value = temp;
            activeGenre.value = genre;
        }

        const subFilterAnime = (category) => {
            if (disableFilter.value) {
                return [];
            }

            if (filteredanimedata.value.length > 0) {
                var sorted = [];
                console.log(`https://api.jikan.moe/v3/search/anime?q=${keyword.value}&genre=${activeGenre.value}&order_by=${category}&sort=desc`);
                axios
                    .get(`https://api.jikan.moe/v3/search/anime?q=${keyword.value}&genre=${activeGenre.value}&order_by=${category}&sort=desc`)
                    .then((response) => {
                        console.log(response.data);
                        if (response.status === 200 && response.data) {
                            error.value = false;
                            setLoadingStatus();
                            subfilteredanimedata.value = response.data.results;
                        }
                    })
                    .catch((error) => {
                        error.value = true;
                        loading.value = false;
                    });

                console.log(sorted);
                filtered.value = true;
                activeSubFilter.value = category;
            }
        }

        const resetFilter = (variant) => {
            if (variant === 'all') {
                filtered.value = false;
                activeGenre.value = '';
                filteredanimedata.value = [];
            } else if (variant === 'sub') {
                subfiltered.value = false;
                activeSubFilter.value = '';
                subfilteredanimedata.value = [];
            }
        }

        const setLoadingStatus = () => {
            if (loading.value) {
                setTimeout(() => {
                    loading.value = false;
                    document.location.hash = "";
                    document.location.hash = "#resultunfiltered";
                }, 250);
            }
        }

        const searchname = () => {
            new Promise((resolve) => {
                    var oldlist = document.getElementsByClassName("animatelist");

                    if (oldlist.length) {
                        for (let i = 0; i < 25; i++) {
                            if (oldlist[i]) {
                                oldlist[i].classList.add("animateout");
                            }
                        }

                        oldlist[0].onanimationend = () => {
                            loading.value = true;
                            resolve();
                        }
                    } else {
                        loading.value = true;
                        resolve();
                    }
                }).then(() => {
                    axios
                        .get(`https://api.jikan.moe/v3/search/anime?q=${keyword.value}`)
                        .then((response) => {
                            if (response.status === 200 && response.data) {
                                error.value = false;
                                setLoadingStatus();
                                disableFilter.value = true;
                                store.commit('RESET_GENRE');
                                animedata.value = response.data.results;
                            }
                        })
                        .catch((error) => {
                            error.value = true;
                            loading.value = false;
                            if (error.response) {
                                // Request made and server responded
                                console.log(error.response.data);
                                console.log(error.response.status);
                                console.log(error.response.headers);
                            } else if (error.request) {
                                // The request was made but no response was received
                                console.log(error.request);
                            } else {
                                // Something happened in setting up the request that triggered an Error
                                console.log('Error', error.message);
                            }
                        });
                })
                .catch(err => {
                    loading.value = false;
                    errormsg = "Ups, da ist etwas schief gelaufen...";
                });
        }

        const searchseason = () => {
            new Promise((resolve) => {
                    var oldlist = document.getElementsByClassName("animatelist");

                    if (oldlist.length) {
                        for (let i = 0; i < 25; i++) {
                            if (oldlist[i]) {
                                oldlist[i].classList.add("animateout");
                            }
                        }

                        oldlist[0].onanimationend = () => {
                            loading.value = true;
                            resolve();
                        }
                    } else {
                        loading.value = true;
                        resolve();
                    }
                }).then(() => {
                    axios
                        .get(`https://api.jikan.moe/v3/season/${year.value}/${season.value}`)
                        .then((response) => {
                            if (response.status === 200 && response.data) {
                                error.value = false;

                                disableFilter.value = false;
                                animedata.value = response.data.anime;
                                extractGenres(response.data.anime);
                                extractDates(response.data.anime);
                                setLoadingStatus();
                            }
                        })
                        .catch((error) => {
                            error.value = true;
                            loading.value = false;
                            errormsg = "Ups, da ist etwas schief gelaufen...";

                            if (error.response) {
                                // Request made and server responded
                                console.log(error.response.data);
                                console.log(error.response.status);
                                console.log(error.response.headers);
                            } else if (error.request) {
                                // The request was made but no response was received
                                console.log(error.request);
                            } else {
                                // Something happened in setting up the request that triggered an Error
                                console.log('Error', error.message);
                            }
                        });
                })
                .catch(err => {
                    console.log(err);
                    loading.value = false;
                });

        }

        onMounted(() => {
            const month = new Date().getMonth();
            year.value = new Date().getFullYear();

            if (month >= 0 && month < 3) {
                season.value = "winter";
            } else if (month >= 3 && month < 8) {
                season.value = "spring";
            } else if (month >= 6 && month < 9) {
                season.value = "summer";
            } else if (month >= 9 && month <= 11) {
                season.value = "fall";
            }

            searchseason();
        });
        return {
            animedata,
            filteredanimedata,
            keyword,
            currentGenre,
            season,
            year,
            loading,
            errormsg,
            error,
            filtered,
            activeGenre,
            activeSubFilter,
            disableFilter,
            detailId,
            zoomIn,
            datelist,
            // Methods
            searchname,
            searchseason,
            filterAnime,
            subFilterAnime,
            resetFilter
        };
    },
};
</script>
