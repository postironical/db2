"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reader = void 0;
const readline_sync_1 = require("readline-sync");
const format_js_1 = require("./format.js");
class Reader {
    static prepareDataTag() {
        const tag = {};
        tag.tName = readline_sync_1.question('tName: ');
        tag.description = readline_sync_1.question('description: ');
        return tag;
    }
    static prepareDataUser() {
        const user = {};
        user.username = readline_sync_1.question('username: ');
        user.reg_date = format_js_1.Format.formatDate(new Date(Date.now()));
        user.rating = +readline_sync_1.question('rating: ');
        return user;
    }
    static prepareDataGoogleProfile() {
        const googleProfile = {};
        googleProfile.email = readline_sync_1.question('email: ');
        googleProfile.nickname = readline_sync_1.question('nickname: ');
        googleProfile.adIdentifier = +readline_sync_1.question('ad id: ');
        googleProfile.questionUser = +readline_sync_1.question('user id: ');
        return googleProfile;
    }
    static prepareDataQuestion() {
        const quest = {};
        quest.qHeader = readline_sync_1.question('question header: ');
        quest.qText = readline_sync_1.question('question text: ');
        quest.creationDate = format_js_1.Format.formatDate(new Date(Date.now()));
        quest.authorId = +readline_sync_1.question('author id: ');
        return quest;
    }
    static prepareDataQuestionTagsBinding() {
        const qtb = {};
        qtb.qt_question_id = +readline_sync_1.question('question id: ');
        qtb.qt_tag_id = +readline_sync_1.question('tag id: ');
        return qtb;
    }
    static prepareDataAnswer() {
        const answer = {};
        answer.aHeader = readline_sync_1.question('answer header: ');
        answer.aText = readline_sync_1.question('answer text: ');
        answer.aCreationDate = format_js_1.Format.formatDate(new Date(Date.now()));
        answer.a_author_id = +readline_sync_1.question('author id: ');
        answer.a_question_id = +readline_sync_1.question('question id: ');
        return answer;
    }
}
exports.Reader = Reader;
