<script>
import { db } from 'support';

export default {
  name: 'reader-settings-modal',

  props: ['preview'],

  created() {
    db.settings.where('comic_id').equals(this.preview.key).first()
      .then(settings => {
        this.settings = {
          ...this.settings,
          ...settings
        };
      });
  },

  data() {
    return {
      settings: {
        brightness: 100,
        contrast: 100,
        flipped: false,
      },
    };
  },

  methods: {
    async save() {
      await db.settings.insertReplace({
        comic_id: this.preview.key,
        ...this.settings,
      });

      this.close();
    },

    cancel() {
      this.close();
    },

    close() {
      this.$emit('close');
    }
  },
}
</script>

<template>
<div class="reader-settings-modal bg-white fixed pin-t pin-r pin-l pin-b flex
  items-center justify-center p-16 z-10 text-black overflow-y-auto">
  <div class="reader-settings-modal-content w-full h-full mx-auto"
    style="max-width: 960px;">
    <div class="title flex text-ebony items-top">
      <div class="flex-auto">
        <h1 class="flex items-center text-3xl">
          <fi-sliders size="18"></fi-sliders> <span class="ml-2">Settings</span>
        </h1>
        <div class="text-grey-dark mt-2">
          Adjust settings and improve your experience
        </div>
      </div>
      <span @click="close()" class="cursor-pointer hover:text-black rounded-full hover:border">
        <fi-x size="24"></fi-x>
      </span>
    </div>

    <!-- Settings area (content itself) -->
    <div class="flex justify-between mx-auto mt-32" style="margin-bottom: 100px">
      <!-- Controls -->
      <div class="options w-1/3">
        <!-- Brightness -->
        <div>
          <h3 class="flex justify-between">
            Brightness <span class="font-light text-grey text-sm">{{ settings.brightness }}%</span>
          </h3>
          <div class="mt-4">
            <input type="range" class="input-range" :data-value="settings.brightness"
              v-model="settings.brightness" min="30" max="200" step="1">
          </div>
        </div>

        <!-- Contrast -->
        <div class="mt-16">
          <h3 class="flex justify-between">
            Contrast <span class="font-light text-grey text-sm">{{ settings.contrast }}%</span>
          </h3>
          <div class="mt-4">
            <input type="range" class="input-range" :data-value="settings.contrast"
              v-model="settings.contrast" min="30" max="200" step="1">
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div class="preview w-1/2">
        <div>
          <h3>Preview</h3>
          <div class="text-grey-dark mt-2">This is how your changes are looking</div>
        </div>
        <div class="mt-4">
          <img class="shadow" width="260" :src="preview.file"
            :style="`filter:brightness(${settings.brightness / 100}) contrast(${settings.contrast / 100})`">
        </div>
      </div>
    </div>

    <!-- Save or cancel -->
    <div class="buttons text-center fixed pin-b pin-l pin-r p-2 pb-4 bg-white"
      style="box-shadow: 0 -10px 50px #FFF;">
      <button class="rounded py-4 px-8 bg-blue text-white hover:bg-blue-dark"
        @click="save()">
        Save Changes
      </button>
      <button class="rounded py-4 px-8 bg-grey-light text-black hover:bg-grey-dark ml-4"
        @click="cancel()">
        Cancel
      </button>
    </div>
  </div>
</div>
</template>

<style lang="scss">
.input-range {
  -webkit-appearance: none;
  width: 100%;
  padding: 9px 0;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.5);
  }

  &::-webkit-slider-thumb {
    height: 20px;
    width: 6px;
    border-radius: 1px;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -9px;
    background-color: #000;
    position: relative;
  }

  &:focus::-webkit-slider-runnable-track {
    background: rgba(8, 8, 8, 0.5);
  }
}

</style>
