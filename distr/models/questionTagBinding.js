"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionTagBindingModel = void 0;
const pool = require('../db.js');
const readline_sync_1 = require("readline-sync");
const reader_js_1 = require("../utils/reader.js");
const printer_js_1 = require("../utils/printer.js");
class QuestionTagBindingModel {
    static async addDataQTB() {
        try {
            const qtb = reader_js_1.Reader.prepareDataQuestionTagsBinding();
            const text = 'INSERT INTO "QuestionTagsBinding" ("qt_tag_id", "qt_question_id") VALUES ($1, $2)';
            const checkTag = await pool.query('SELECT * FROM "Tags" WHERE "tagId" = $1', [qtb.qt_tag_id]);
            const checkQuestion = await pool.query('SELECT * FROM "Questions" WHERE "questionId" = $1', [qtb.qt_question_id]);
            if (!checkTag.rows.length || !checkQuestion.rows.length) {
                console.log(`There is no tag with id ${qtb.qt_tag_id} or question with id ${qtb.qt_question_id}`);
            }
            else {
                await pool.query(text, [qtb.qt_tag_id, qtb.qt_question_id]);
                console.log('Added 1 row to table QuestionTagsBinding');
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    static async editDataQTB() {
        try {
            const id = +readline_sync_1.question('QTB id: ');
            const newQtb = reader_js_1.Reader.prepareDataQuestionTagsBinding();
            const text = 'UPDATE "QuestionTagsBinding" SET "qt_tag_id" = $1, "qt_question_id" = $2 WHERE "qtId" = $3';
            const checkQTB = await pool.query('SELECT * FROM "QuestionTagsBinding" WHERE "qtId" = $1', [id]);
            const checkTag = await pool.query('SELECT * FROM "Tags" WHERE "tagId" = $1', [newQtb.qt_tag_id]);
            const checkQuestion = await pool.query('SELECT * FROM "Questions" WHERE "questionId" = $1', [newQtb.qt_question_id]);
            if (!checkQTB.rows.length) {
                console.log(`There is no QTB with id ${id}`);
            }
            else {
                if (!checkTag.rows.length || !checkQuestion.rows.length) {
                    console.log(`There is no tag with id ${newQtb.qt_tag_id} or question with id ${newQtb.qt_question_id}`);
                }
                else {
                    await pool.query(text, [newQtb.qt_tag_id, newQtb.qt_question_id, id]);
                    console.log(`Row with id ${id} has been updated`);
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    static async deleteDataQTB() {
        try {
            const id = +readline_sync_1.question('QTB id: ');
            const text = 'DELETE FROM "QuestionTagsBinding" WHERE "qtId" = $1';
            const checkQTB = await pool.query('SELECT * FROM "QuestionTagsBinding" WHERE "qtId" = $1', [id]);
            if (!checkQTB.rows.length) {
                console.log(`There is no QTB with id ${id}`);
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
    static async showDataQTB() {
        try {
            const qtbs = await pool.query('SELECT * FROM "QuestionTagsBinding"');
            printer_js_1.Printer.printQTBs(qtbs.rows);
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.QuestionTagBindingModel = QuestionTagBindingModel;
