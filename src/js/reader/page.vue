<script>
export default {
    name: 'page',

    props: {
        data: Object,
    },

    data() {
        return {
            isLoaded: false,
            src: null,
        };
    },

    beforeMount() {
        const img = new Image();
        img.onload = () => { this.src = img.src };
        img.src = this.data.file;
    },

    mounted() {
        const img = this.$el.querySelector('img');

        img.onload = () => {
            this.isLoaded = true;
        };
    },

    methods: {
        emit(what, $event) {
            const $el = this.$el;

            this.$emit(what, {
                $event,
                $el,
            });
        }
    },

    computed: {
        style() {
            const keys = ['filter', 'transform', 'transformOrigin'];

            let styles = {};

            let output = '';

            keys.forEach(key => {
                styles[key] = {};
            });

            if (this.data.brightness !== 100) {
                styles.filter.brightness = `${Math.min(200, Math.max(0, this.data.brightness))}%`;
            }

            if (this.data.zoom.level !== 1) {
                // styles.transform.translate3D = `${this.data.zoom.x}px, ${this.data.zoom.y}px, 0`;
                styles.transform.scale = this.data.zoom.level;
            }

            keys.forEach(key => {
                const properties = styles[key];

                output += `${key}: `;

                if (typeof properties === 'object') {
                    Object.keys(properties).forEach((property) => {
                        output += `${property}(${properties[property]})`;
                    });
                } else {
                    console.log(properties);
                    output += properties;
                }

                console.log(output);

                output += '; ';
            });

            console.log(output);

            return output;
        }
    }
}
</script>

<template>
    <div class="reader-page" :class="{ visible: isLoaded }"
        @click="emit('click', $event)"
        @mousemove="emit('mousemove', $event)"
        @mousedown="emit('mousedown', $event)"
        @mouseup="emit('mouseup', $event)">
        <img :style="style" :src="src">
    </div>
</template>
