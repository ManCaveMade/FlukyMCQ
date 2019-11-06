<template>
  <v-container fluid>
    <v-stepper v-model="e6" vertical>
      <v-stepper-step :complete="e6 > 1" step="1" editable>About Fluky</v-stepper-step>

      <v-stepper-content step="1" class="body-2">
        <strong>Welcome to Fluky v2.0!</strong>
        <p>
          Everything you need to do is on this one page.
          Nothing is stored by Fluky on the server and all the processing is done by your browser using JavaScript code - this avoids any possible security risks.
          Please manually check the output of Fluky against the cards to ensure accuracy.
          Fluky and its creator(s) cannot be held liable for errors.
          Fluky is designed to be very intuitive and so finding your own way is easy. Just follow the steps!
        </p>
        <p>
          Please check out and contribute to the "official" wiki for additional tips and use cases:
          <a
            href="https://github.com/ManCaveMade/FlukyMCQ/wiki"
            target="_blank"
          >github.com/ManCaveMade/FlukyMCQ/wiki</a>
        </p>
      
        <v-card class="d-inline-flex" outlined tile>
          <v-card-text>
          <p><strong>Pro Tip:</strong> Look out for boxes like this one - they contain "extra" instructions and pro tips...</p>
          <strong>Changes to v2.0:</strong> Since the original Fluky, several enhancements have been made, but existing functionality has been maintained. Please log issues, feature requests, etc. on the GitHub page. Please remember that Fluky is open source, has no warranty and is developed in my spare time. :) 
          </v-card-text>
        </v-card>

        <div class="pt-4 pb-2">
          <v-btn outlined color="primary" @click="e6 = 2">Continue</v-btn>
        </div>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 2" step="2" editable>Setup Mark Model</v-stepper-step>

      <v-stepper-content step="2">
        

        <div class="pt-4 pb-2">
          <v-btn outlined color="primary" @click="e6 = 2">Continue</v-btn>
          <v-btn class="ml-2" text @click="e6 = 1">Back</v-btn>
        </div>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 3" step="3" editable>Select an ad format and name ad unit</v-stepper-step>

      <v-stepper-content step="3">
        <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
        <v-btn color="primary" @click="e6 = 4">Continue</v-btn>
        <v-btn text>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-step step="4" editable>View setup instructions</v-stepper-step>
      <v-stepper-content step="4">
        <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
        <v-btn color="primary" @click="e6 = 1">Continue</v-btn>
        <v-btn text>Cancel</v-btn>
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    e6: 1
  }),
  created() {
    this.$vuetify.theme.dark = false;
  }
};
</script>