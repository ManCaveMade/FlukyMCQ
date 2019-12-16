<template>
  <v-container fluid>
    <v-stepper v-model="step" vertical>
      <v-stepper-step :complete="step > 1" step="1" editable>About Fluky</v-stepper-step>

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

      <v-stepper-step :complete="step > 2" step="2" editable>Setup Mark Model</v-stepper-step>

      <v-stepper-content step="2">
        <h4>Summary</h4>
        <p>
          Create your mark model here by first specifying the number of questions in your test, and the total marks required for 100%.
          Next, fill in the marks that should be allocated to each choice in the "Mark Matrix", as well as the "Maximum Mark" value for each question. Negative and part marks are allowed.
          In essence, Fluky will perform a weighted sum of this matrix with the A to E choices on the MCQ card, subject to some configurable rules and options.
        </p>
        <h4>Explanation of Rules and Options</h4>
        <ul>
          <li>
            The mark for a question will be made zero if the total choices made is greater than the specified "Max. Choices".
            This alleviates the need for naive negative marking used to prevent excess marks by "blanketing" the MCQ card.
          </li>
          <li>The mark for a question will be capped to the maximum specified for that question. If the "Maximum Mark" is left as zero, this rule will not be applied.</li>
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
        <p />

        <v-card class="mx-auto" outlined elevation="1">
          <v-card-title>Test Setup</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model.number="numQuestions"
                  type="number"
                  min="1"
                  label="Number of Questions"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <p></p>

        <v-card class="mx-auto" outlined elevation="1">
          <v-card-title>Mark Matrix</v-card-title>
          <v-card-text>
            <v-row>
              <v-simple-table fixed-header height="400px">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-center">Question</th>
                      <th class="text-center">A</th>
                      <th class="text-center">B</th>
                      <th class="text-center">C</th>
                      <th class="text-center">D</th>
                      <th class="text-center">E</th>
                      <th class="text-center">Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="q in questions" :key="q.number">
                      <td>{{q.number}}</td>
                      <td>{{q.A}}</td>
                      <td>{{q.B}}</td>
                      <td>{{q.C}}</td>
                      <td>{{q.D}}</td>
                      <td>{{q.E}}</td>
                      <td>{{q.marks}}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-row>
          </v-card-text>
        </v-card>

        <div class="pt-4 pb-2">
          <v-btn outlined color="primary" @click="step = 3">Continue</v-btn>
          <v-btn class="ml-2" text @click="step = 1">Back</v-btn>
        </div>
      </v-stepper-content>

      <v-stepper-step :complete="step > 3" step="3" editable>Upload Card Scan</v-stepper-step>

      <v-stepper-content step="3">
        <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
        <v-btn color="primary" @click="step = 4">Continue</v-btn>
        <v-btn text>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-step step="4" editable>View Statistics and Download Results</v-stepper-step>
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
    step: 1,
    numQuestions: 1,
    questions: [{number: 1, A: 0, B: 0, C: 0, D: 0, E: 0, marks: 0}]
  }),
  created() {},
  computed: {
    totalMarks: function() {
      //Return total test marks
      return 1000;
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
            marks: 0
          };
          this.questions.push(tempQuestion);
        }
      } else {
        this.questions.splice(this.numQuestions);
      }
    }
  }
};
</script>