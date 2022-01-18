<style lang="scss">

</style>

<template>
<div class="px-8">
    <ul class="flex flex-row justify-center flex-wrap w-full my-4">
        <li @click="$emit('filterAnimeEmit', genre.name, genre.mal_id)" v-for="genre in currentGenreProp" :key="genre.mal_id" class="filterbtn p-2 m-1 rounded-sm border-2 outline-none cursor-pointer font-medium" :class="{'disabledbutton': disableFilterProp, 'accentbtn': (activeGenreProp === genre.mal_id)}">
            {{ genre.name }}
        </li>
        <li v-if="disableFilterProp" class="disabledbutton p-2 m-1 rounded-sm border-2 outline-none cursor-pointer font-medium">No genres available</li>
        <li @click="$emit('resetFilterEmit', 'all')" class="accentbtn p-2 m-1 rounded-sm border-2 outline-none cursor-pointer font-medium" :class="{'disabledresetbutton': disableFilterProp}">reset</li>
    </ul>

    <ul class="flex flex-row justify-center flex-wrap w-full my-4">
        <li @click="$emit('subFilterAnimeEmit', 'start_date')" class="filterbtnVariant p-2 m-1 rounded-sm border-2 outline-none cursor-pointer font-medium" :class="{'accentbtnVariant': (activeSubFilterProp === 'start_date')}">
            Release Date
        </li>
        <li @click="$emit('subFilterAnimeEmit', 'title')" class="filterbtnVariant p-2 m-1 rounded-sm border-2 outline-none cursor-pointer font-medium" :class="{'accentbtnVariant': (activeSubFilterProp === 'name')}">
            Name
        </li>
        <li @click="$emit('resetFilterEmit', 'sub')" class="accentbtnVariant p-2 m-1 rounded-sm border-2 outline-none cursor-pointer font-medium" :class="{'disabledresetvariantbutton': disableFilterProp}">reset</li>
    </ul>
</div>
</template>

<script>
export default {
    props: {
        currentGenreProp: Array,
        activeGenreProp: Number,
        activeSubFilterProp: String,
        disableFilterProp: Boolean
    },
    emits: ['subFilterAnimeEmit', 'filterAnimeEmit', 'resetFilterEmit'],
    setup() {},
};
</script>
