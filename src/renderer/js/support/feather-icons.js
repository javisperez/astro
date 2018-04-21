import icons from 'feather-icons/dist/icons.json';

const components = {};

Object.keys(icons).forEach(icon => {
  components[`fi-${icon}`] = {
    name: `fi-${icon}`,

    props: {
      // Width and height size
      size: {
        default: 24
      },

      // Stroke width
      stroke: {
        default: 2
      },

      spin: {
        type: Boolean,
        default: false
      }
    },

    template: `
    <svg xmlns="http://www.w3.org/2000/svg" class="fi fi-${icon}"
      :class="{'spin': spin}" :width="size" :height="size"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      :stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round"
    >
      ${icons[icon]}
    </svg>
    `
  };
});

export default {
  install(Vue) {
    Vue.mixin({
      components,
    });
  }
};
