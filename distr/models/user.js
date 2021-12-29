"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const pool = require('../db.js');
const readline_sync_1 = require("readline-sync");
const reader_js_1 = require("../utils/reader.js");
const printer_js_1 = require("../utils/printer.js");
class UserModel {
    static async addDataUser() {
        try {
            const newUser = reader_js_1.Reader.prepareDataUser();
            const text = 'INSERT INTO "Users" (username, reg_date, rating) VALUES($1, $2, $3);';
            await pool.query(text, [newUser.username, newUser.reg_date, newUser.rating]);
            console.log('Added 1 row to table Users');
        }
        catch (err) {
            console.log(err);
        }
    }
    static async editDataUser() {
        try {
            const id = +readline_sync_1.question('user id: ');
            const updateUser = reader_js_1.Reader.prepareDataUser();
            const text = 'UPDATE "Users" SET username = $1, reg_date = $2, rating = $3 WHERE "userId" = $4';
            const check = await pool.query('SELECT * FROM "Users" WHERE "userId" = $1', [id]);
            if (!check.rows.length) {
                console.log(`There is no user with id ${id} in database`);
            }
            else {
                await pool.query(text, [updateUser.username, updateUser.reg_date, updateUser.rating, id]);
                console.log(`Record with id ${id} has been updated`);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    static async deleteDataUser() {
        try {
            const id = +readline_sync_1.question('user id: ');
            const text = 'DELETE FROM "Users" WHERE "userId" = $1';
            const check = await pool.query('SELECT * FROM "Users" WHERE "userId" = $1', [id]);
            if (!check.rows.length) {
                console.log(`There is no user with id ${id} in database`);
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
    static async showDataUser() {
        try {
            const users = await pool.query('SELECT * FROM "Users"');
            printer_js_1.Printer.printUsers(users.rows);
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.UserModel = UserModel;
