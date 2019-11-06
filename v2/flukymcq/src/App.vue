<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      dense
      elevation="2"
    >
    
      <div>
        <v-icon large>mdi-blur-linear</v-icon>
      </div>
      <v-spacer></v-spacer>
      <div class="title font-weight-bold">
        Fluky MCQ Marking System 
      </div>

      <v-spacer></v-spacer>

      <v-btn color="orange darken-1" 
        href="https://www.buymeacoffee.com/UhCeEp6"
        target="_blank" rounded>
        <v-img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" contain height="25"></v-img>
      </v-btn>
    </v-app-bar>

    <v-content>
      <FlukyV2/>
    </v-content>

    <v-footer 
      app
      dark
      >
      <div class="body-2">
        <v-icon small>mdi-settings</v-icon>
        Created by Mitchell A. Cox :: Please double check Fluky's output as the creator(s) cannot be held liable for errors.
      </div>
  
        <v-spacer/>

        <v-btn class="mx-2 white--text" icon small
          href="https://github.com/ManCaveMade/FlukyMCQ"
          target="_blank">
          <v-icon>mdi-github-circle</v-icon>
        </v-btn>
        <v-btn class="mx-2 white--text" icon small
          href="mailto:mitchell.cox@wits.ac.za">
          <v-icon>mdi-email</v-icon>
        </v-btn>
</v-footer>
  </v-app>
</template>

<script>
import FlukyV2 from './components/FlukyV2';

export default {
  name: 'App',

  components: {
    FlukyV2,
  },

  data: () => ({
    //
  }),
};
</script>
