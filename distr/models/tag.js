"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModel = void 0;
const pool = require('../db.js');
const readline_sync_1 = require("readline-sync");
const reader_js_1 = require("../utils/reader.js");
const printer_js_1 = require("../utils/printer.js");
class TagModel {
    static async addDataTag() {
        try {
            const newTag = reader_js_1.Reader.prepareDataTag();
            const text = 'INSERT INTO "Tags" ("tName", "description") VALUES($1, $2)';
            await pool.query(text, [newTag.tName, newTag.description]);
            console.log('Added 1 row to table Tags');
        }
        catch (err) {
            console.log(err);
        }
    }
    static async editDataTag() {
        try {
            const id = +readline_sync_1.question('tag id: ');
            const updateTag = reader_js_1.Reader.prepareDataTag();
            const text = 'UPDATE "Tags" SET "tName" = $1, "description" = $2 WHERE "tagId" = $3';
            const check = await pool.query('SELECT * FROM "Tags" WHERE "tagId" = $1', [id]);
            if (!check.rows.length) {
                console.log(`There is no tag with id ${id} in database`);
            }
            else {
                await pool.query(text, [updateTag.tName, updateTag.description, id]);
                console.log(`Record with id ${id} has been updated`);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    static async deleteDataTag() {
        try {
            const id = +readline_sync_1.question('tag id: ');
            const text = 'DELETE FROM "Tags" WHERE "tagId" = $1';
            const check = await pool.query('SELECT * FROM "Tags" WHERE "tagId" = $1', [id]);
            if (!check.rows.length) {
                console.log(`There is no tag with id ${id} in database`);
            }
            else {
                await pool.query(text, [id]);
                console.log(`Record with id ${id} has been deleted`);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    static async showDataTag() {
        try {
            const tags = await pool.query('SELECT * FROM "Tags"');
            printer_js_1.Printer.printTags(tags.rows);
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.TagModel = TagModel;
