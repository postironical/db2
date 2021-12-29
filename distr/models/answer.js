"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerModel = void 0;
const pool = require('../db.js');
const readline_sync_1 = require("readline-sync");
const reader_js_1 = require("../utils/reader.js");
const printer_js_1 = require("../utils/printer.js");
class AnswerModel {
    static async addDataAnswer() {
        try {
            const text = 'INSERT INTO "Answer" ("aHeader", "aText", "aCreationDate", "a_author_id", "a_question_id") VALUES ($1, $2, $3, $4, $5)';
            const ans = reader_js_1.Reader.prepareDataAnswer();
            const user = await pool.query('SELECT * FROM "Users" WHERE "userId" = $1', [ans.a_author_id]);
            const quest = await pool.query('SELECT * FROM "Questions" WHERE "questionId" = $1', [ans.a_question_id]);
            if (!user.rows.length || !quest.rows.length) {
                console.log(`There is no user with id ${ans.a_author_id} or question with id ${ans.a_question_id} in database`);
            }
            else {
                await pool.query(text, [ans.aHeader, ans.aText, ans.aCreationDate, ans.a_author_id, ans.a_question_id]);
                console.log('Added 1 element to table Answer');
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    static async editDataAnswer() {
        try {
            const id = +readline_sync_1.question('answer id: ');
            const newAns = reader_js_1.Reader.prepareDataAnswer();
            const text = 'UPDATE "Answer" SET "aHeader" = $1, "aText" = $2, "aCreationDate" = $3, "a_author_id" = $4, "a_question_id" = $5 WHERE "answerId" = $6';
            const check = await pool.query('SELECT * FROM "Answer" WHERE "answerId" = $1', [id]);
            if (!check.rows.length) {
                console.log(`There is no answer with id ${id}`);
            }
            else {
                const checkUser = await pool.query('SELECT * FROM "Users" WHERE "userId" = $1', [newAns.a_author_id]);
                const checkQuestion = await pool.query('SELECT * FROM "Questions" WHERE "questionId" = $1', [newAns.a_question_id]);
                if (!checkUser.rows.length || !checkQuestion.rows.length) {
                    console.log(`There is no user with id ${newAns.a_author_id} or question with id ${newAns.a_question_id}`);
                }
                else {
                    await pool.query(text, [newAns.aHeader, newAns.aText, newAns.aCreationDate, newAns.a_author_id, newAns.a_question_id, id]);
                    console.log(`Row with id ${id} has been updated`);
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    static async deleteDataAnswer() {
        try {
            const id = +readline_sync_1.question('answer id: ');
            const text = 'DELETE FROM "Answer" WHERE "answerId" = $1';
            const check = await pool.query('SELECT * FROM "Answer" WHERE "answerId" = $1', [id]);
            if (!check.rows.length) {
                console.log(`There is no answer with id ${id}`);
            }
            else {
                await pool.query(text, [id]);
                console.log(`Row with id ${id} has been deleted`);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    static async showDataAnswer() {
        try {
            const answers = await pool.query('SELECT * FROM "Answer"');
            printer_js_1.Printer.printAnswers(answers.rows);
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.AnswerModel = AnswerModel;
