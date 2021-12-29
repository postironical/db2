"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const question_js_1 = require("../models/question.js");
const answer_js_1 = require("../models/answer.js");
const questionTagBinding_js_1 = require("../models/questionTagBinding.js");
const user_js_1 = require("../models/user.js");
const googleProfile_js_1 = require("../models/googleProfile.js");
const tag_js_1 = require("../models/tag.js");
const dynamicQueries_js_1 = require("../models/dynamicQueries.js");
const generator_js_1 = require("../models/generator.js");
const view_js_1 = require("../view/view.js");
const readline_sync_1 = require("readline-sync");
class Controller {
    static async start() {
        const tables = [
            'Answer',
            'Google_Profile',
            'QuestionTagsBinding',
            'Questions',
            'Tags',
            'Users'
        ];
        while (true) {
            view_js_1.View.mainMenu();
            let table = +readline_sync_1.question('input: ');
            if (table < 1 || table > 9) {
                return;
            }
            else {
                if (table <= 6) {
                    view_js_1.View.actionWithTable(tables[table - 1]);
                    switch (table) {
                        case 1: {
                            let action = +readline_sync_1.question('input: ');
                            switch (action) {
                                case 1: {
                                    await answer_js_1.AnswerModel.addDataAnswer();
                                    break;
                                }
                                case 2: {
                                    await answer_js_1.AnswerModel.editDataAnswer();
                                    break;
                                }
                                case 3: {
                                    await answer_js_1.AnswerModel.deleteDataAnswer();
                                    break;
                                }
                                case 4: {
                                    await answer_js_1.AnswerModel.showDataAnswer();
                                    break;
                                }
                                default: {
                                    break;
                                }
                            }
                            break;
                        }
                        case 2: {
                            let action = +readline_sync_1.question('input: ');
                            switch (action) {
                                case 1: {
                                    await googleProfile_js_1.GoogleProfileModel.addDataGoogleProfile();
                                    break;
                                }
                                case 2: {
                                    await googleProfile_js_1.GoogleProfileModel.editDataGoogleProfile();
                                    break;
                                }
                                case 3: {
                                    await googleProfile_js_1.GoogleProfileModel.deleteDataGoogleProfile();
                                    break;
                                }
                                case 4: {
                                    await googleProfile_js_1.GoogleProfileModel.showDataGoogleProfile();
                                    break;
                                }
                                default: {
                                    break;
                                }
                            }
                            break;
                        }
                        case 3: {
                            let action = +readline_sync_1.question('input: ');
                            switch (action) {
                                case 1: {
                                    await questionTagBinding_js_1.QuestionTagBindingModel.addDataQTB();
                                    break;
                                }
                                case 2: {
                                    await questionTagBinding_js_1.QuestionTagBindingModel.editDataQTB();
                                    break;
                                }
                                case 3: {
                                    await questionTagBinding_js_1.QuestionTagBindingModel.deleteDataQTB();
                                    break;
                                }
                                case 4: {
                                    await questionTagBinding_js_1.QuestionTagBindingModel.showDataQTB();
                                    break;
                                }
                                default: {
                                    break;
                                }
                            }
                            break;
                        }
                        case 4: {
                            let action = +readline_sync_1.question('input: ');
                            switch (action) {
                                case 1: {
                                    await question_js_1.QuestionModel.addDataQuestion();
                                    break;
                                }
                                case 2: {
                                    await question_js_1.QuestionModel.editDataQuestion();
                                    break;
                                }
                                case 3: {
                                    await question_js_1.QuestionModel.deleteDataQuestion();
                                    break;
                                }
                                case 4: {
                                    await question_js_1.QuestionModel.showDataQuestion();
                                    break;
                                }
                                default: {
                                    break;
                                }
                            }
                            break;
                        }
                        case 5: {
                            let action = +readline_sync_1.question('input: ');
                            switch (action) {
                                case 1: {
                                    await tag_js_1.TagModel.addDataTag();
                                    break;
                                }
                                case 2: {
                                    await tag_js_1.TagModel.editDataTag();
                                    break;
                                }
                                case 3: {
                                    await tag_js_1.TagModel.deleteDataTag();
                                    break;
                                }
                                case 4: {
                                    await tag_js_1.TagModel.showDataTag();
                                    break;
                                }
                                default: {
                                    break;
                                }
                            }
                            break;
                        }
                        case 6: {
                            let action = +readline_sync_1.question('input: ');
                            switch (action) {
                                case 1: {
                                    await user_js_1.UserModel.addDataUser();
                                    break;
                                }
                                case 2: {
                                    await user_js_1.UserModel.editDataUser();
                                    break;
                                }
                                case 3: {
                                    await user_js_1.UserModel.deleteDataUser();
                                    break;
                                }
                                case 4: {
                                    await user_js_1.UserModel.showDataUser();
                                    break;
                                }
                                default: {
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
                else {
                    switch (table) {
                        case 7: {
                            await generator_js_1.Generate.generateUsers();
                            break;
                        }
                        case 8: {
                            view_js_1.View.dynamicSearchMenu();
                            let type = +readline_sync_1.question('input: ');
                            switch (type) {
                                case 1: {
                                    await dynamicQueries_js_1.DynamicQueries.specDate();
                                    break;
                                }
                                case 2: {
                                    await dynamicQueries_js_1.DynamicQueries.specTag();
                                    break;
                                }
                                case 3: {
                                    await dynamicQueries_js_1.DynamicQueries.specQDate();
                                    break;
                                }
                                default: {
                                    break;
                                }
                            }
                        }
                        default: {
                            break;
                        }
                    }
                }
            }
        }
    }
}
exports.Controller = Controller;
