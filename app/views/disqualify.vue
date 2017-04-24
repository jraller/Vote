<template>
    <div>
        <h2>Disqualify List</h2>
        <ul>
            <li v-for="candidate in candidates">
                <div class="checkbox">
                    <label>
                        <input type="checkbox" :value="candidate">{{ candidate }}
                    </label>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" src="./disqualify.ts"></script>
