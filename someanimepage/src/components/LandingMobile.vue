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
    <cardMobile v-if="zoomIn" :anime_id="detailId" @zoomOut="zoomIn = false" />

    <div class="bgaccentred h-v1/4 flex justify-center items-center">
        <div class="flex flex-col justify-center items-center">
            <h1 class="fontheading font-semibold text-4xl uppercase colorbase text-center">
                Search Your Favorite Anime
            </h1>
            <div class="h-3 w-1/3 mt-2 bgbase rounded-full"></div>
        </div>
    </div>

    <div class="w-full flex flex-col justify-center items-center bgaccentblack shadow-lg p-4">
        <form @submit.prevent class="flex flex-col justify-center items-center w-full my-4">
            <div class="form-group-mobile w-full">
                <label for="keyword" class="colorbase text-sm">Name</label>
                <input required v-model="keyword" type="text" name="keyword" placeholder="Kimi No Iru Machi" class="p-2 leading-5 bgbase rounded-sm outline-none mr-4 w-2/3">
                <button type="submit" class="accentbtn p-2 leading-5 rounded-sm outline-none border borderaccentred cursor-pointer w-1/4" @click="searchname">suchen</button>
            </div>

        </form>

        <form @submit.prevent class="flex flex-col justify-center items-center w-full my-4">
            <div class="form-group-mobile mb-4 w-full">
                <label for="season-select" class="colorbase text-sm">Season</label>
                <select required v-model="season" name="season-select" id="season-select" class="p-2 leading-5 bgbase rounded-sm outline-none w-2/3">
                    <option value="spring" selected>Spring</option>
                    <option value="summer">Summer</option>
                    <option value="fall">Fall</option>
                    <option value="winter">Winter</option>
                </select>
            </div>

            <div class="form-group-mobile mt-4 w-full">
                <label for="keyword" class="colorbase text-sm">Year</label>
                <input required v-model="year" min="1950" placeholder="2010" type="number" name="year" class="p-2 leading-5 bgbase rounded-sm outline-none mr-4 w-2/3">
                <button type="submit" class="accentbtn p-2 leading-5 rounded-sm outline-none border borderaccentred cursor-pointer w-1/4" @click="searchseason">suchen</button>
            </div>
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
        <div v-if="!disableFilter" class="flex flex-row justify-center items-center my-1">
            <select @change="filterAnime($event)" v-model="activeGenre" name="genre-select" id="genre-select" class="p-2 leading-5 rounded-sm border-2 borderaccentmetal outline-none w-2/3">
                <option value="" disabled selected class="coloraccentmetal">Filter genre</option>
                <option v-for="(genre, index) in currentGenre" :key="genre" :value="index" class="coloraccentmetal p-2 mx-1 rounded-sm border-2 outline-none cursor-pointer font-medium" :class="{'disabledbutton': disableFilter, 'accentbtn': (activeGenre === genre)}">
                    {{ genre.name }}
                </option>
            </select>
            <div @click="resetFilter('all')" class="w-1/3  text-center accentbtn ml-2 p-2 rounded-sm outline-none border-none cursor-pointer font-medium" :class="{'disabledresetbutton': disableFilter}">reset</div>
        </div>
        <div v-if="disableFilter" class="disabledbutton p-2 mx-1 rounded-sm border-2 outline-none cursor-pointer font-medium">No genres available</div>
    </div>

    <div v-if="animedata.length > 0 && !error" class="px-8">
        <ul class="flex flex-row justify-center flex-wrap w-full">
            <li @click="subFilterAnime('start_date')" class="w-full text-center filterbtnVariant p-1 my-1 rounded-sm border-2 outline-none cursor-pointer font-medium" :class="{'accentbtnVariant': (activeSubFilter === 'start_date')}">
                Release Date
            </li>
            <li @click="subFilterAnime('title')" class="w-full text-center filterbtnVariant p-1 my-1 rounded-sm border-2 outline-none cursor-pointer font-medium" :class="{'accentbtnVariant': (activeSubFilter === 'name')}">
                Name
            </li>
            <li @click="resetFilter('sub')" class="w-full text-center accentbtnVariant p-1 my-1 rounded-sm border-2 outline-none cursor-pointer font-medium" :class="{'disabledresetvariantbutton': disableFilter}">reset</li>
        </ul>
    </div>

    <div v-if="!loading && filtered === '' && animedata.length > 0 && !error">
        <div class="flex flex-col flex-wrap justify-start items-center text-sm">
            <div v-for="(item, index) in animedata" :key="item.mal_id" class="relative animatelist w-full max-w-225 max-h-3/4 my-6 mx-10 pb-2 bgbase overflow-y-auto rounded-3xl shadow-lg" @click="detailId = item.mal_id; zoomIn = true">
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
    <div v-else-if="!loading && filtered === 'genre' && animedata.length > 0 && !error">
        <div class="flex flex-col flex-wrap justify-start items-center text-sm">
            <div v-for="(item) in filteredanimedata" :key="item.mal_id" class="animatelist w-full max-w-225 max-h-3/4 my-6 mx-10 pb-2 bgbase overflow-y-auto rounded-3xl shadow-lg" @click="detailId = item.mal_id; zoomIn = true">
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
    <div v-else-if="!loading && filtered === 'sub' && animedata.length > 0 && !error">
        <div class="flex flex-col flex-wrap justify-start items-center text-sm">
            <div v-for="(item) in subfilteredanimedata" :key="item.mal_id" class="animatelist w-full max-w-225 max-h-3/4 my-6 mx-10 pb-2 bgbase overflow-y-auto rounded-3xl shadow-lg" @click="detailId = item.mal_id; zoomIn = true">
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
    <div v-else-if="loading" class="text-sm w-full py-10 h-v1/3">
        <div class="loader m-auto">
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

import {
    sortObjectArrayByName,
    sortObjectArrayByStartDate
} from '../services/sortObjectArray.js'

import cardMobile from "./CardMobile.vue";

export default {
    components: {
        cardMobile
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
        var filtered = ref("");
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
            var tempgnr = [];

            animedata.forEach(anime => {
                if (anime.genres.length) {
                    anime.genres.forEach(genre => {
                        tempgnr.push(genre);
                    });
                }

            });

            var seen = {};
            var temp = tempgnr.filter((genre) => {
                return seen.hasOwnProperty(genre.mal_id) ? false : (seen[genre.mal_id] = true);
            });

            currentGenre.value = [];
            currentGenre.value.length = 0;
            currentGenre.value = temp;
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

        const filterAnime = (e) => {
            if (disableFilter.value) {
                return;
            }

            var temp = animedata.value.filter(anime => {
                var temp_l = anime.genres.filter(check_genre => {
                    return check_genre.name === currentGenre.value[e.target.value].name;
                });
                return (temp_l.length > 0);
            })

            filtered.value = "genre";
            activeSubFilter.value = "";
            filteredanimedata.value = temp;
            activeGenre.value = currentGenre.value[e.target.value].mal_id;
        }

        const subFilterAnime = (category) => {
            if (disableFilter.value) {
                return [];
            }
            filtered.value = "sub";

            if (filteredanimedata.value.length > 0 && category === "title") {
                activeSubFilter.value = "name";
                subfilteredanimedata.value = sortObjectArrayByName(filteredanimedata.value, "asc")
            } else if (animedata.value.length > 0 && category === "title") {
                activeSubFilter.value = "name";
                subfilteredanimedata.value = sortObjectArrayByName(animedata.value, "asc")
            }

            if (filteredanimedata.value.length > 0 && category === "start_date") {
                activeSubFilter.value = "start_date";
                subfilteredanimedata.value = sortObjectArrayByStartDate(filteredanimedata.value, "asc")
            } else if (animedata.value.length > 0 && category === "start_date") {
                activeSubFilter.value = "start_date";
                subfilteredanimedata.value = sortObjectArrayByStartDate(animedata.value, "asc")
            }

            console.log(subfilteredanimedata.value);
        }

        const resetFilter = (variant) => {
            if (variant === 'all') {
                filtered.value = "";
                activeGenre.value = "";
                activeSubFilter.value = "";
                filteredanimedata.value = [];
                subfilteredanimedata.value = [];
            } else if (filtered.value === "sub" && filteredanimedata.value.length > 0) {
                subfilteredanimedata.value = [];
                activeSubFilter.value = "";
                filtered.value = "genre";
            } else if (filtered.value === "sub" && animedata.value.length > 0) {
                subfilteredanimedata.value = [];
                activeSubFilter.value = "";
                filtered.value = "";
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
                    var oldlist2 = document.getElementsByClassName("animatelistfiltered");
                    resetFilter("all");

                    if (oldlist.length) {
                        for (let i = 0; i < 25; i++) {
                            if (oldlist[i]) {
                                oldlist[i].classList.add("animateout");
                            }
                        }

                        if (filtered) {
                            oldlist[0].onanimationend = () => {
                                loading.value = true;
                                resolve();
                            }
                        } else if (!filtered) {
                            oldlist2[0].onanimationend = () => {
                                loading.value = true;
                                resolve();
                            }
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
                        });
                })
                .catch(err => {
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
            subfilteredanimedata,
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
