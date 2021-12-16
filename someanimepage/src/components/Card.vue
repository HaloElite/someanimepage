<style lang="scss">

</style>

<template>
<div class="flex w-screen h-screen justify-center items-center bgoverlay fixed z-50 fontbase" @click.self="shutcloseup">
    <div class="w-8/12 h-v3/4 p-8 bgbase rounded-sm">
        <section>
            <h1>{{ anime_id }}</h1>
            <img src="###" alt="">

        </section>

    </div>
</div>
</template>

<script>
export default {
    props: {
        anime_id: Number
    },
    setup(props, context) {
        const shutcloseup = (e) => {
            console.log("Test", e);
            context.emit('lookfurther');
        }

        return {
            shutcloseup
        }
    }

}
</script>
