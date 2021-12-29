"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generate = void 0;
const pool = require('../db.js');
const readline_sync_1 = require("readline-sync");
class Generate {
    static async generateUsers() {
        try {
            const num = +readline_sync_1.question('number of records: ');
            const text = `
                insert into "Users" (username, reg_date, rating, confirmed)
                    select substr(characters, (random() * length(characters) + 1)::integer, 10),
                    timestamp '2018-01-10' + random() * (timestamp '2018-01-20' - timestamp '2018-01-10'),
                    trunc(random() * 1000)::int,
                    cast(cast(round(random()) as character varying) as boolean)
                    from (values('qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM')) as symbols(characters), generate_series(1, $1);
            `;
            const start = Date.now();
            await pool.query(text, [num]);
            const queryTime = Date.now() - start;
            console.log(`${num} rows has been generated in table Users`);
            console.log(`query time: ${queryTime}`);
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.Generate = Generate;
