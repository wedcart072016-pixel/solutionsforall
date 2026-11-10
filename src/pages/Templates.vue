<script setup>
import Replica from '../components/Replica.vue';
import markup from '../site/templates.html?raw';
import css from '../site/templates.css?raw';
import code from '../site/templates.js.txt?raw';
</script>

<template>
    <Replica
        title="Templates | WEDPK Digital Invitations"
        description="Every template is composed with the care of fine stationery and ready to be made your own."
        :markup="markup"
        :css="css"
        :code="code"
    />
</template>
