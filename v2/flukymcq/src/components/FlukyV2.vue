<template>
  <v-container fluid>
    <v-stepper v-model="step" vertical dense>
      <v-stepper-step :complete="step > 1" step="1" :edit-icon="'mdi-help'" editable>About Fluky</v-stepper-step>

      <v-stepper-content step="1" class="body-2">
        <h4>Welcome to Fluky v2.0!</h4>
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

        <h4>Notes and "Pro Tips"</h4>
        <ul>
          <li>Since the original Fluky, several enhancements have been made, but existing functionality has been maintained.</li>
          <li>Please log issues, feature requests, etc. on the GitHub page. Please remember that Fluky is open source, has no warranty and is developed in my spare time - mostly so that I can spend more time on my research... ;)</li>
          <li>Feel free to add to the wiki linked above, but if you prefer, please email me your "Pro Tips" and I'll add them somewhere.</li>
        </ul>
        <p />
        <h4>Acknowledgements</h4>
        <p>
          Thank you to everyone who has given me feedback and ideas for Fluky. In particular, I'd like to acknowledge Doug Clerk from Physics for our long discussions on good MCQ testing. Also, thank
          <i>you</i> for using Fluky - it motivates me to continue development!
        </p>

        <div class="pt-4 pb-2">
          <v-btn outlined color="primary" @click="step = 2">Continue</v-btn>
        </div>
      </v-stepper-content>

      <v-stepper-step
        :complete="step > 2"
        step="2"
        :edit-icon="'mdi-check-bold'"
        editable
      >Setup Mark Model</v-stepper-step>

      <v-stepper-content step="2">
        <div class="pb-4">
          <v-dialog v-model="dialog.stepTwo" scrollable max-width="700px">
            <template v-slot:activator="{ on }">
              <v-btn color="warning" small outlined v-on="on">Show Description and Tips</v-btn>
              <v-btn class="ml-2" outlined small>Restore Mark Model</v-btn>
            </template>
            <v-card>
              <v-card-title>
                Setup Mark Model: Description and Tips
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog.stepTwo = false">Close</v-btn>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text style="height: 500px;">
                <p />
                <h4>Summary</h4>
                <ol>
                  <li>Create your mark model here by first specifying the number of questions in your test as well as any other information in the "Test Setup" section.</li>
                  <li>Next, fill in the marks that should be allocated to each choice in the "Mark Matrix", as well as the "Maximum Mark" value for each question. Negative and part marks are allowed.</li>
                  <li>Continue to the next step... In essence, Fluky will perform a weighted sum of this matrix with the A to E choices on the MCQ card, subject to some configurable rules and options.</li>
                </ol>
                <p />
                <h4>Explanation of Rules and Options</h4>
                <ul>
                  <li>
                    The mark for a question will be made zero if the total choices made is greater than the specified "Allowed Choices".
                    This alleviates the need for näive negative marking used to prevent excess marks by "blanketing" the MCQ card.
                  </li>
                  <li>The mark for a question will be capped / floored to the maximum / minimum specified for that question. Click the <v-icon small>mdi-refresh</v-icon> next to the input fields to auto-calculate. </li>
                  <li>
                    In the case of negative marking, the mark for a question will be floored to the minimum specified for that question. If left as the default value of zero, a negative question mark will not be carried into the test total, preventing student panic. This is useful for questions which require multiple "correct" selections, where some
                    <i>very</i> wrong options are made negative.
                  </li>
                  <li>"Knowledge Areas" are an optional feature where Fluky will save you time by summing specified groups of questions.</li>
                </ul>
                <p />
                <h4>Pro Tips</h4>
                <ul>
                  <li>
                    The Wits scanner is
                    <strong>very</strong> sensitive and will detect even erased cells on a card. Do not allow students to erase. Rather get them to fill out a fresh MCQ card.
                  </li>
                  <li>A trade-off to consider is making each question allow two answers, to compensate for extreme scanner sensitivity. Some students may get lucky - evaluate your options.</li>
                  <li>To prevent card-wastage, tell the students to do working and record their selections in their answer books, and only hand out the MCQ cards towards the end of the test (or upon request).</li>
                </ul>
              </v-card-text>
            </v-card>
          </v-dialog>
        </div>

        <h4>Test Setup</h4>
        <v-row>
          <v-col cols="6" sm="4" md="2" lg="2" xl="2">
            <v-text-field
              v-model.number="numQuestions"
              type="number"
              min="1"
              label="Number of Questions"
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="4" md="2" lg="2" xl="2">
            <v-text-field
              v-model.number="numKnowledgeAreas"
              type="number"
              min="0"
              label="Knowledge Areas"
            ></v-text-field>
          </v-col>
        </v-row>

        <h4>Mark Matrix</h4>
        <v-row>
          <v-col cols="12" sm="12" md="12" lg="7" xl="6">
            <v-simple-table fixed-header height="550px">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center">Question</th>
                    <th class="text-center">A</th>
                    <th class="text-center">B</th>
                    <th class="text-center">C</th>
                    <th class="text-center">D</th>
                    <th class="text-center">E</th>
                    <th class="text-center">Allowed Choices</th>
                    <th class="text-center">Minimum Mark</th>
                    <th class="text-center">Maximum Mark</th>
                    <th class="text-center" v-if="numKnowledgeAreas">Knowledge Area</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="q in questions" :key="q.number">
                    <td
                      class="text-center font-weight-bold"
                      style="border-right:1px solid #dddddd;"
                    >{{q.number}}</td>
                    <td class="pt-4">
                      <v-text-field dense v-model.number="q.A" type="number" height="20px"></v-text-field>
                    </td>
                    <td class="pt-4">
                      <v-text-field dense v-model.number="q.B" type="number" height="20px"></v-text-field>
                    </td>
                    <td class="pt-4">
                      <v-text-field dense v-model.number="q.C" type="number" height="20px"></v-text-field>
                    </td>
                    <td class="pt-4">
                      <v-text-field dense v-model.number="q.D" type="number" height="20px"></v-text-field>
                    </td>
                    <td class="pt-4" style="border-right:1px solid #dddddd;">
                      <v-text-field dense v-model.number="q.E" type="number" height="20px"></v-text-field>
                    </td>
                    <td class="pt-4">
                      <v-text-field dense v-model.number="q.maxChoices" type="number" height="20px"></v-text-field>
                    </td>
                    <td class="pt-4">
                      <v-text-field dense v-model.number="q.minMark" type="number" height="20px" append-icon="mdi-refresh" @click:append="updateMinMark(q.number)"></v-text-field>
                    </td>
                    <td class="pt-4">
                      <v-text-field dense v-model.number="q.maxMark" type="number" height="20px" append-icon="mdi-refresh" @click:append="updateMaxMark(q.number)"></v-text-field>
                    </td>
                    <td class="pt-4" style="border-left:1px solid #dddddd;" v-if="numKnowledgeAreas">
                      <v-text-field dense v-model.number="q.knowledgeArea" min="0" type="number" height="20px"></v-text-field>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>

        <div class="pt-4 pb-2">
          <v-btn outlined>Download Mark Model</v-btn>
          <v-btn class="ml-2" outlined color="primary" @click="step = 3">Continue</v-btn>
          <v-btn class="ml-2" text @click="step = 1">Back</v-btn>
        </div>
      </v-stepper-content>

      <v-stepper-step
        :complete="step > 3"
        step="3"
        :edit-icon="'mdi-check-bold'"
        editable
      >Upload Card Scan</v-stepper-step>

      <v-stepper-content step="3">
        <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
        <v-btn color="primary" @click="step = 4">Continue</v-btn>
        <v-btn text>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-step
        step="4"
        :edit-icon="'mdi-check-bold'"
        editable
      >View Statistics and Download Results</v-stepper-step>
      <v-stepper-content step="4">
        <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
        <v-btn color="primary" @click="step = 1">Continue</v-btn>
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
    step: 2,
    dialog: { stepTwo: false },
    numQuestions: 1,
    numKnowledgeAreas: 0,
    questions: [
      {
        number: 1,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        minMark: 0,
        maxMark: 0,
        maxChoices: 1,
        knowledgeArea: 0
      }
    ]
  }),
  created() {},
  computed: {
    maxMarkTotal: function() {
      //Return highest possible test mark
      let total = 0;
      for (let q = 0; q < this.questions.length; ++q) {
        total += this.questions[q].maxMark;
      }
      return total;
    },
    minMarkTotal: function() {
      //Return worst case test mark
      let total = 0;
      for (let q = 0; q < this.questions.length; ++q) {
        total += this.questions[q].minMark;
      }
      return total;
    }
  },
  watch: {
    // whenever question changes, this function will run
    numQuestions: function() {
      this.updateNumberOfQuestions();
    }
  },
  methods: {
    updateNumberOfQuestions: function() {
      //Resize the questions array to the number of questions

      if (this.questions.length < this.numQuestions) {
        for (let q = this.questions.length + 1; q <= this.numQuestions; ++q) {
          let tempQuestion = {
            number: q,
            A: 0,
            B: 0,
            C: 0,
            D: 0,
            E: 0,
            minMark: 0,
            maxMark: 0,
            maxChoices: 1,
            knowledgeArea: 0
          };
          this.questions.push(tempQuestion);
        }
      } else {
        this.questions.splice(this.numQuestions);
      }
    },
    updateMinMark: function(questionNumber) {
      //Calculate the min and max possible marks for a question, given the choice values and max choices and update
      if (this.questions.length < questionNumber) {
        this.console.error(
          "Trying to updateMinMaxMark for impossible questionNumber!"
        );
        return;
      }

      let tempChoices = [
        this.questions[questionNumber - 1].A,
        this.questions[questionNumber - 1].B,
        this.questions[questionNumber - 1].C,
        this.questions[questionNumber - 1].D,
        this.questions[questionNumber - 1].E
      ];
      tempChoices = tempChoices.sort(function(a,b){return a - b}); //sort ascending

      let minMark = 0;
      for (let i = 0; i < this.questions[questionNumber - 1].maxChoices; ++i) {
        minMark += tempChoices[i];
      }

      this.questions[questionNumber - 1].minMark = minMark;
    },
    updateMaxMark: function(questionNumber) {
      //Calculate the min and max possible marks for a question, given the choice values and max choices and update
      if (this.questions.length < questionNumber) {
        this.console.error(
          "Trying to updateMinMaxMark for impossible questionNumber!"
        );
        return;
      }

      let tempChoices = [
        this.questions[questionNumber - 1].A,
        this.questions[questionNumber - 1].B,
        this.questions[questionNumber - 1].C,
        this.questions[questionNumber - 1].D,
        this.questions[questionNumber - 1].E
      ];
      tempChoices = tempChoices.sort(function(a,b){return a - b}); //sort ascending

      let maxMark = 0;
      for (let i = 0; i < this.questions[questionNumber - 1].maxChoices; ++i) {
        maxMark += tempChoices[tempChoices.length - 1 - i];
      }

      this.questions[questionNumber - 1].maxMark = maxMark;
    }
  }
};
</script>

<style>
.v-stepper--vertical .v-stepper__step {
  padding: 10px 25px 10px !important;
}
.v-input__append-inner {
  margin-top: -4px !important;
}
.theme--light.v-icon:hover {
  color: #111111;
}
</style>
