const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    text: {
        en: {
            type: Schema.Types.String,
            default:""
        },
        hn: {
            type: Schema.Types.String,
            default:""
        }
    },
    mode: {
        type: Schema.Types.String,
    },
    images: [
        {
            type: Schema.Types.String,
        },
    ],
    choices: [
        {
            text: {
                en: {
                    type: Schema.Types.String,
                    default:""
                },
                hn: {
                    type: Schema.Types.String,
                    default:""
                }
            },
            image: {
                type: Schema.Types.String,
            },
            answer: {
                type: Schema.Types.Boolean,
            },
        },
    ],
    answer: {
        en: {
            type: Schema.Types.String,
            default:""
        },
        hn: {
            type: Schema.Types.String,
            default:""
        }
    },
    // marks: {
    //     type: Schema.Types.Number,
    //     // required: true,
    // },
    markingRule: {
        positive: {
            type: Schema.Types.String,
            default: "",
            // required: true,
        },
        negative: {
            type: Schema.Types.String,
            default: "",
            // required: true
        },
    },
    solution: {
        text: {
            en: {
                type: Schema.Types.String,
                default: ""
            },
            hn: {
                type: Schema.Types.String,
                default:""
            }
        },
        image: {
            type: Schema.Types.String,
        },
        video: {
            type: Schema.Types.String,
            default: "",
        },
        images: [
            {
                type: Schema.Types.String,
            },
        ],
        userSolution: {
            postedBy: {
                type: Schema.Types.String,
            },
            text: {
                en: {
                    type: Schema.Types.String,
                    default:""
                },
                hn: {
                    type: Schema.Types.String,
                    default:""
                }
            },
            image: {
                type: Schema.Types.String,
            },
            images: [
                {
                    type: Schema.Types.String,
                },
            ],
            upvote: {
                vote: {
                    type: Schema.Types.Boolean,
                    default: false,
                },
                userId: {
                    type: Schema.Types.String,
                },
            },
        },
    },
    publish: {
        type: Schema.Types.Boolean,
        default: true,
    },
    publishedBy: {
        type: Schema.Types.String,
    },
    department: {
        type: Schema.Types.String,
        required: true,
    },
    department_: {
        type: Schema.Types.ObjectId,
        ref: "Department" 
    },
    exam: {
        type: Schema.Types.String,
        required: true,
    },
    exam_: {
        type: Schema.Types.ObjectId,
        ref: "Exam" 
    },
    subject: {
        type: Schema.Types.String,
        required: true,
    },
    subject_: {
        type: Schema.Types.ObjectId,
        ref: "Subject"  
    },
    chapter: {
        type: Schema.Types.String,
        // required: true,
    },
    chapter_: {
        type: Schema.Types.ObjectId,
        ref: "Chapter" 
    },
    topic: {
        type: Schema.Types.String,
        // required: true,
    },
    topic_: {
        type: Schema.Types.ObjectId,
        ref: "Topic" 
    },
    level: {
        type: Schema.Types.String,
        // required: true,
    },
    year: {
        type: Schema.Types.Number,
        required: true,
    },
    set: {
        type: Schema.Types.Number,
    },
    postedBy: {
        type: Schema.Types.String,
        required: true,
    },
    updatedBy: {
        type: Schema.Types.String,
    },
    // reviewedBy: {
    //   type: Schema.Types.String,
    // },
    series: [
        {
            type: Schema.Types.ObjectId,
            ref: "Series",
        },
    ],
    testSeries: [
        {
            type: Schema.Types.ObjectId,
            ref: "testSeries",
        },
    ],
    previousYears: [
        {
            type: Schema.Types.ObjectId,
            ref: "previousYears",
        },
    ],
    quizzes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Quiz",
        },
    ],
    // review: {
    //   type: Schema.Types.Boolean,
    //   default: false,
    // },
},{ collection: 'questions' });

if(mongoose.models.Question) {
    module.exports = mongoose.models.Question;
} else {
    module.exports = mongoose.model('Question', questionSchema);
}