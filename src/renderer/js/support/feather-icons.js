import icons from 'feather-icons/dist/icons.json';

// The base component
const fi = {
  name: 'fi',

  props: {
    size: { default: 24 },
    stroke: { default: 2 },
    spin: { type: Boolean, default: false },
    icon: { type: String, required: true }
  },

  template: `<svg :is="'fi-'+icon" :size="size" :stroke="stroke" :spin="spin"></svg>`
};

// All the rest of components
const components = {
  fi,
};

// Same props as the global `fi`
const props = { ...fi.props };
delete props.icon;

// Definition of component per icon
Object.keys(icons).forEach(icon => {
  const name = `fi-${icon}`;

  components[name] = {
    name,
    props,
    template: `
    <svg xmlns="http://www.w3.org/2000/svg" class="fi fi-${icon}"
      :class="{'spin': spin}" :width="size" :height="size"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      :stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round">
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
