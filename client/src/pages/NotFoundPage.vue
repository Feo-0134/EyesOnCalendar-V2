<template>
    <div> 
        <h1> 404 Page Not Found </h1>
        <button class="modal-default-button"><a :href="linkToCalendar" class="linkFontStyle">Back To Calendar</a></button>
    </div>
</template>

<script>
export default {
    computed: {
        linkToCalendar() {
        return "/";
        },
    }
}
</script>

<style>
@import"test.css";

</style>
