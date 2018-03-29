import icons from 'feather-icons/dist/icons.json';

const components = {};

Object.keys(icons).forEach(icon => {
    components[`fi-${icon}`] = {
        name: `fi-${icon}`,

        template: `<svg xmlns="http://www.w3.org/2000/svg" class="fi fi-${icon}"
            width=24 height=24 viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width=2 stroke-linecap="round" stroke-linejoin="round">
            ${icons[icon]}
        </svg>`
    };
});

export default {
    install(Vue) {
        Vue.mixin({
            components,
        });
    }
};
