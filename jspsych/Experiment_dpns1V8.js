// LICENCE -----------------------------------------------------------------------------

// Copyright 2024 - Maude Tagand & Dominique Muller

// New study with the goal to test delta p with our measure but now exposing participants
// to all the patients

// Initialize jsPsych -----------------------------------------------------------------
var jsPsych = initJsPsych({
});

// Browser exclusion ------------------------------------------------------------------
var browser_check = {
  type: jsPsychBrowserCheck,
  inclusion_function: (data) => {
    return data.browser === 'firefox'|| data.browser === 'chrome' && data.mobile === false
  },
  exclusion_message: (data) => {
    if(data.mobile){
      return "p>You must use a desktop/laptop computer to participate in this experiment.</p>";
    } else if (data.browser !== 'firefox' && data.browser !== 'chrome'){
      return "<p>You must use Chrome or Firefox to complete this experiment.</p>"+
             "<p>If you would like to take part in our study, please copy and paste the experiment link into one of the compatible browsers.</p>";
    }
  }
}

// Create Timeline --------------------------------------------------------------------------
var timeline = [];

// Welcome
var welcome = {
  type: jsPsychHtmlButtonResponse,
  stimulus:
    "<h1 class ='custom-title'>Welcome</h1>" +
    "<p class='instructions'>Thank you for taking part in this survey. <b> Please note that you can only participate from a computer.</b> </p>" +
    "<p class='instructions'>We are going to ask you to imagine you are a medical researcher who wants to test the effectiveness of a medicine against a fictitious disease. " +
    "Your task will be to give your opinion on the effectiveness of this medicine. You will also have to answer some questions about your worldview.</p>" +
    "<p class='instructions'>If you have any question related to this research, please " +
    "send a message on Prolific. </p>" +

    "<p class = 'continue-instructions'>Click <strong>Continue</strong> to start the study.</p>",
  choices: ['Continue']
};

var consent = {
  type: jsPsychHtmlButtonResponse,
  stimulus:
  "<h1 class ='custom-title'> Informed consent </h1>" +
    "<p class='instructions'>By clicking below to start the study, you recognize that:</p>" +
      "<ul class='instructions'>" +
        "<li>You know you can stop your participation at any time, without having to justify yourself. " +
        "However, keep in mind that you have to complete the whole study in order to be paid.</li>" +
        "<li>You know you can contact our team for any questions or dissatisfaction related to your " +
        "participation in the research via Prolific.</li>" +
        "<li>You know the data collected will be strictly confidential and it will be impossible for " +
        "any unauthorized third party to identify you.</li>" +
        "<li>Please note that there will be one or several questions to check that you read instructions carefully. " +
        "If you do not answer this or these (very simple) questions correctly, you might not be paid. " +
        "<li>You must be over 18 to participate. " +
      "</ul>" +
    "<p class='instructions'>By clicking on the \"I confirm\" button, you give your free and informed consent to participate " +
    "in this research.</p>",
  choices: ['I confirm']
};

var consigne = {
  type: jsPsychHtmlButtonResponse,
  stimulus:
  "<p class= 'instructions_questionnary bold'>Please read these instructions very carefully.</p>" +
  "<p class= 'instructions_questionnary'>Imagine you are a medical researcher looking for a cure for a (fictional) disease called the Vonne syndrome. " + 
  "You just found a medicine that you think could work and your role will be to determine whether this medicine is effective or not. " +
  "<p class= 'instructions_questionnary'>To do so, you will see patients suffering from the disease one by one, and depending on the instructions, you will have to give them either the medicine or a placebo, " +
  "that is to say a pill that resembles the medicine but does not contain any substance affecting health (it is generally with this type of pill that a medicine is compared to in order to judge its effectiveness).</p>" + //retour à la ligne
  "<p class= 'instructions_questionnary'>You will test a certain number of patients to determine the effectiveness of medicine.</p>",
  choices: ['I have read carefully and I can start the study']
};

var stim = [
  {pilule: "medicine", correct_button: 0, diagnostic: "recovered", image: "jspsych/img/healthypeople.jpg", med_score: 1, pla_score: 0, pro: "medicine"},
  {pilule: "medicine", correct_button: 0, diagnostic: "recovered", image: "jspsych/img/healthypeople.jpg", med_score: 1, pla_score: 0, pro: "medicine"},
  {pilule: "medicine", correct_button: 0, diagnostic: "recovered", image: "jspsych/img/healthypeople.jpg", med_score: 1, pla_score: 0, pro: "medicine"},
  {pilule: "medicine", correct_button: 0, diagnostic: "not recovered", image: "jspsych/img/sickpeople.jpg", med_score: -1, pla_score: 0, pro: "placebo"},
  {pilule: "placebo", correct_button: 1, diagnostic: "recovered", image: "jspsych/img/healthypeople.jpg", med_score: 0, pla_score: 1, pro: "placebo"},
  {pilule: "placebo", correct_button: 1, diagnostic: "recovered", image: "jspsych/img/healthypeople.jpg", med_score: 0, pla_score: 1, pro: "placebo"},
  {pilule: "placebo", correct_button: 1, diagnostic: "recovered", image: "jspsych/img/healthypeople.jpg", med_score: 0, pla_score: 1, pro: "placebo"},
  {pilule: "placebo", correct_button: 1, diagnostic: "not recovered", image: "jspsych/img/sickpeople.jpg", med_score: 0, pla_score: -1, pro: "medicine"}
]

//medicine_high means the "medicine better" button will be above
var button_randomization = jsPsych.randomization.sampleWithoutReplacement(["medicine_high", "medicine_low"], 1)[0]

var medicine = stim.filter(function(s){return s.pilule === "medicine"; }); // keep only medicine trials
var placebo = stim.filter(function(s){return s.pilule === "placebo"; });

var medicine_randomization = jsPsych.randomization.repeat(medicine, 6); // each is repeated 6 times, which gives 4*6 = 24
var placebo_randomization = jsPsych.randomization.repeat(placebo, 6);

// In conjunction, this gives MR = 18, MNR = 6 (p = ,75) and PR = 18, PNR = 6 (p = ,75)

var order_randomization = jsPsych.randomization.sampleWithoutReplacement(["medicine_first", "placebo_first"], 1)[0]
var stim_randomization = [];

for (var i = 0; i < 24; i++) { // 24 times med and pla (or pla and med), so 48 trials in total
  if (order_randomization == "medicine_first"){
    stim_randomization.push(medicine_randomization.pop(), placebo_randomization.pop());
  } else if (order_randomization == "placebo_first"){
    stim_randomization.push(placebo_randomization.pop(), medicine_randomization.pop());
  }
}
console.log(medicine);
console.log(placebo);
console.log(medicine_randomization);
console.log(placebo_randomization);
console.log(order_randomization);
console.log(stim_randomization);

var pilule_given = {
  type : jsPsychImageButtonResponse,
  stimulus: "jspsych/img/sickpeople.jpg",
  stimulus_width: 250,
  choices: [
    `<div class='choice-container'><img style='width: 100px;' src='jspsych/img/pilule.png'><div class='choice-text'>Medicine</div></div>`,
    `<div class='choice-container'><img style='width: 100px;' src='jspsych/img/pilule.png'><div class='choice-text'>Placebo</div></div>`
    ],
  prompt: function() {
  return `<p class='instructions'>You give the ${jsPsych.timelineVariable('pilule')} to the patient.</p>`
  }
}

var loop_pilule = {
  timeline: [pilule_given],
  loop_function: function(){
    var response = jsPsych.data.get().last().values()[0].response;
    var correct_button = jsPsych.timelineVariable('correct_button')
    if (response == correct_button){
      return false;
    } else {
      return true;
    }
  }
}

var feedback = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function(){
    return `
    <img style= 'width: 250px;' src="${jsPsych.timelineVariable('image')}"></img>
    <p class='instructions'>The patient has ${jsPsych.timelineVariable('diagnostic')}!</p>`;
  },
  choices: ['Continue'],
}

var procedure_testing = {
  timeline: [loop_pilule, feedback],
  timeline_variables: stim_randomization,
  data: {
    pilule: jsPsych.timelineVariable('pilule'),
    diagnostic: jsPsych.timelineVariable('diagnostic'),
    med_score: jsPsych.timelineVariable('med_score'),
    pla_score: jsPsych.timelineVariable('pla_score')
  },
}


//question croyances
var question = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      prompt: "<p>On the basis of the information you have gathered, you think that:</p>",
      options: function(){if (button_randomization == "medicine_high"){
        return [
          "Patients are more likely to recover after receiving the medicine",
          "Patients are equally likely to recover after receiving the medicine or the placebo",
          "Patients are more likely to recover after receiving the placebo"
          ];
      } else if (button_randomization == "medicine_low"){
        return [
          "Patients are more likely to recover after receiving the placebo",
          "Patients are equally likely to recover after receiving the medicine or the placebo",
          "Patients are more likely to recover after receiving the medicine"
        ];
      } else {
        return "<p>Erreur : réponse inattendue.</p>";
      }
    },
    required: true // This makes the question required
  }
]
}

var slider = {
  type: jsPsychHtmlSliderResponse,
  slider_start: 1,
  require_movement: true,
  min: 1,
  max: 50,
  step: 1,
  labels: [
    '1<br>More likely', 
    '25<br>Clearly more likely',
    '50<br>Massively more likely'
  ],
  stimulus: function() {
    var response = jsPsych.data.get().last().values()[0].response.Q0;
    var questionText = "";
    if (response == "Patients are more likely to recover after receiving the medicine") {
      questionText = "<p class='instructions'>You just said participants are better off to receive the medicine than the placebo.<br>" +
      "To be more specific, how much more likely do you think patients who received the vaccine (instead of the placebo) are to recover?</p>";
    } else if (response == "Patients are more likely to recover after receiving the placebo") {
      questionText = "<p class='instructions'>You just said participants are better off to receive the placebo than the medicine.<br>" +
      "To be more specific, how much more likely do you think patients who received the placebo (instead of the medicine) are to recover?";
    } else {
      questionText = "Erreur : réponse inattendue.";
    }

    // Only return the question text here
    return `
        <p style="margin-bottom: 1px;">${questionText}</p>
        <p style="text-align: center; margin-top: 0px !important;"><em>(If you want to answer 1, simply click on the handle)</em></p>`;
  },
  slider_width: 350 // Keep this as is to control slider size
};

var conditional_slider = {
  timeline: [slider],
  conditional_function: function() {
    var response = jsPsych.data.get().last().values()[0].response.Q0;
    if (response == "Patients are equally likely to recover after receiving the medicine or the placebo") {
      return false;
    } else {
      return true;
    }
  }
};

//question certi
var confidence = {
  type: jsPsychHtmlSliderResponse,
  slider_start: 0,
  require_movement: true,
  labels: ['0<br>Not at all sure', '100<br>Very sure'],
  stimulus: `<p>Please indicate how sure you are of your answer on a scale from 0 (not at all sure) to 100 (very sure).</p>`
}


//Attention check
var attention_check = {
  type: jsPsychSurveyText,
  questions: [
    {
      prompt: "<p class='instructions_questionnary'>This question is here to check that you read the instructions carefully. On this page, we will ask you only one question, but you will not answer it. Instead, just write the word \u0022baguette\u0022. </p>" +
              "<p class='instructions_questionnary'>What is your favorite color?</p>",
      name: 'attention_check',
      required: true
    }
  ],
  button_label: 'Continue',
}

var instruction_demographic_questionnary = {
  type: jsPsychHtmlButtonResponse,
  stimulus:
    "<p class='instructions_questionnary'>You are nearly at the end of this experiment, please answer this last set of questions about yourself.</p>",
    choices: ['Continue']
};
        
var genre = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      prompt: "<p class='instructions_questionnary'>What gender do you identify as?</p>", 
      options: ["Woman", "Man","Other"],
      name: 'genre',
      required: true,
      horizontal: true
    }
  ],
  required_error: "Please, answer all questions.",
  button_label: 'Continue'
}
          
var age = {
  type: jsPsychSurveyText,
  questions: [
    {
      prompt: "<p class='instructions_questionnary'>How old are you? (in year, just a number, for instance 32)</p>",
      placeholder: 'XX',
      name: 'age',
      required: true
    }
  ],
  required_error: "Please, answer all questions.",
  button_label: 'Continue'
}

var comment = {
  type: jsPsychSurveyText,
  questions: [
    {
      prompt: "<p class='instructions'>Do you have any comments about the study?</p>",
      name: 'comment',
      rows: 5
    }
  ],
  required_error: "Please, answer all questions.",
  button_label: 'Continue'
}

var waiting_demand = {
  type: jsPsychHtmlButtonResponse,
  stimulus:
  "<p class='instructions'>You have now finished answering all the questions. " +
  "After clicking <strong>continue</strong>, the data will be saved while loading. " +
  "<strong>Please wait until the next page appears to exit.</strong> " +
  "Otherwise, we will have no proof that you have completed the study and won't be able to pay you</p>",
  choices: ['Continue']
}
  

//prolific ----------------------------------------------------------------------------------
var prolific = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<p class='instructions'>You have finished the last task. Thanks for participating!</p>"+
  "<p class='instructions'>Please wait a moment, you will automatically be redirected to prolific.</p>",
  trial_duration: 3000,
  choices: "NO_KEYS",
  on_finish: function(){
  window.location.href = "https://app.prolific.com/submissions/complete?cc=C4B65VYL";
  }
}
var prolific_id = jsPsych.data.getURLVariable('PROLIFIC_PID');
var study_id = jsPsych.data.getURLVariable('STUDY_ID');
var session_id = jsPsych.data.getURLVariable('SESSION_ID');

//Save data ---------------------------------------------------------------------------------
const subject_id = jsPsych.randomization.randomID(10);
const filename = `${subject_id}.csv`;
const experiment_id = "G5OQkuIFzWpj";
// Your OSF token
// const osfToken = 'VLFG5mbOACd0fk6jkN1IhAwbdrCi8OSm62rzTqPBreN3asR5QCcIeTBz9YkwJy1WL9CkNp';

jsPsych.data.addProperties({
  subject_id: subject_id,
  prolific_id: prolific_id,
  study_id: study_id,
  session_id: session_id,
  stim_randomization: stim_randomization,
  button_randomization: button_randomization
})

var save_data = {
  type: jsPsychPipe,
  action: "save",
  experiment_id: experiment_id,
  filename: filename,
  data_string: ()=>jsPsych.data.get().csv()
  //token: osfToken
}

//timeline
timeline.push 
  (browser_check,
  welcome,
  consent,
  consigne,
  //procedure_testing,
  question,
  conditional_slider,
  confidence,
  attention_check,
  instruction_demographic_questionnary,
  genre,
  age,
  comment,
  waiting_demand,
  save_data, 
  prolific 
)

jsPsych.run(timeline)