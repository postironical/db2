"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicQueries = void 0;
const pool = require('../db.js');
const readline_sync_1 = require("readline-sync");
const format_js_1 = require("../utils/format.js");
class DynamicQueries {
    static async specDate() {
        const date1 = readline_sync_1.question('first date: ');
        const date2 = readline_sync_1.question('second date: ');
        const text = `
            with confirmedUsers as (
                select * from "Users" where "confirmed" = true 
                and "userId" in (select "questionUser" from "Google_Profile")
            ),
            
            specDate as (
                select * from confirmedUsers where "reg_date" > $1 and "reg_date" < $2
            )
            
            select "username", "reg_date", "confirmed", m."email" from specDate join "Google_Profile" as m on m."questionUser" = specDate."userId";
        `;
        try {
            const start = Date.now();
            const result = await pool.query(text, [date1, date2]);
            const queryTime = Date.now() - start;
            if (!result.rows.length) {
                console.log('No result');
            }
            else {
                console.log('username   |  reg_date  | confirmed | email');
                console.log('_______________________________________________________');
                result.rows.forEach((item) => {
                    let modUName = '';
                    if (item.username.length > 11) {
                        modUName = item.username.substr(0, 8) + '...';
                    }
                    else {
                        modUName = format_js_1.Format.toField(11, item.username);
                    }
                    console.log(`${modUName}|${format_js_1.Format.toField(12, format_js_1.Format.formatDate(item.reg_date))}|${format_js_1.Format.toField(11, item.confirmed.toString())}|${item.email}`);
                    console.log('_______________________________________________________');
                });
                console.log(`query time: ${queryTime}ms`);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    static async specTag() {
        const tag = readline_sync_1.question('tag: ');
        const text = `
            with tagsIds as (
                select "tagId", "tName" from "Tags" where "tName" = $1
            ),
            
            questionIds as (
                select "tagId", "tName", qtb."qt_question_id" from tagsIds join "QuestionTagsBinding" as qtb on "tagId" in (select "qt_tag_id" from "QuestionTagsBinding")
            ),
            
            tagAndQ as (
                select distinct "tName", q."qHeader" 
                from questionIds 
                join "Questions" as q 
                on "qt_question_id" in (select "questionId" from "Questions")
            )
            
            select * from tagAndQ;
        `;
        try {
            const start = Date.now();
            const result = await pool.query(text, [tag]);
            const queryTime = Date.now() - start;
            if (!result.rows.length) {
                console.log('No result');
            }
            else {
                console.log('     tName      |       qHeader');
                console.log('______________________________________');
                result.rows.forEach((item) => {
                    let modTName = '';
                    let modHeader = '';
                    if (item.tName.length > 16) {
                        modTName = item.tName.substr(0, 13) + '...';
                    }
                    else {
                        modTName = format_js_1.Format.toField(16, item.tName);
                    }
                    if (item.qHeader.length > 20) {
                        modHeader = item.qHeader.substr(0, 17) + '...';
                    }
                    else {
                        modHeader = format_js_1.Format.toField(20, item.qHeader);
                    }
                    console.log(`${modTName}|${modHeader}`);
                    console.log('______________________________________');
                });
                console.log(`query time: ${queryTime}ms`);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    static async specQDate() {
        try {
            const date = readline_sync_1.question('date: ');
            const text = `
                select count(*), "creationDate" from "Questions" where "creationDate" > $1
                group by "creationDate"
            `;
            const start = Date.now();
            const result = await pool.query(text, [date]);
            const queryTime = Date.now() - start;
            if (!result.rows.length) {
                console.log('No result');
            }
            else {
                console.log(' count |   creationDate');
                console.log('________________________');
                result.rows.forEach((item) => {
                    console.log(`${format_js_1.Format.toField(7, item.count.toString())}|${format_js_1.Format.formatDate(item.creationDate)}`);
                    console.log('________________________');
                });
                console.log(`query time: ${queryTime}ms`);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.DynamicQueries = DynamicQueries;
