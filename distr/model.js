"use strict";
/*namespace TablesDB {
    const { Client } = require('pg');
    const readLineSync = require('readline-sync');

    const client = new Client ({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'anime',
        password: 'qwerty',
        port: 5432,
    });

    client.connect();

    class Model {
        static prepareDataAnime(): Anime {
            let animeRow: Anime = {
                length: 4,
                columns: {
                    a_name: '',
                    description: '',
                    series: 0,
                    genre: 0
                }
            };

            animeRow.columns.a_name = readLineSync.question('anime name: ');
            animeRow.columns.description = readLineSync.question('anime description: ');
            animeRow.columns.series = readLineSync.question('anime series: ');
            animeRow.columns.genre = readLineSync.question('anime genre id: ');
            
            return animeRow;
        }

        static async addDataAnime(animeRow: Anime) {
            const text = 'INSERT INTO anime (a_name, description, series, genre) VALUES ($1, $2, $3, $4)';
            const checkQuerry = 'SELECT genre_id FROM genre where genre_id = $1';
            const values = [animeRow.columns.a_name, animeRow.columns.description, animeRow.columns.series, animeRow.columns.genre];

            try {
                const check = await client.query(checkQuerry, [animeRow.columns.genre]);

                if (check.rows.length === 0) {
                    console.log(`There is no genre_id = ${animeRow.columns.genre} in database`);
                    client.end();
                } else {
                    client.query(text, values)
                        .then((res: any) => {
                            console.log('Added 1 element to table anime');
                            client.end();
                        })
                        .catch((err: {detail: any}) => {
                            console.log(err.detail);
                            client.end();
                        });
                }
            } catch (err) {
                console.log('Something went wrong');
                client.end();
            }
        }

        static async editDataAnime() {
            const aName = readLineSync.question('name of anime for editing: ');
            const checkText = 'SELECT a_name FROM anime where a_name = $1';
            const text = 'UPDATE anime SET a_name = $1, description = $2, series = $3, genre = $4 WHERE a_name = $5';

            try {
                const check = await client.query(checkText, [aName]);

                if (check.rows.length === 0) {
                    console.log(`There is no ${aName} anime in table anime`);
                    await client.end();
                } else {
                    const newRow: Anime = this.prepareDataAnime();
                    const values: Array<any> = [
                        newRow.columns.a_name,
                        newRow.columns.description,
                        newRow.columns.series,
                        newRow.columns.genre,
                        aName
                    ];

                    client.query(text, values)
                        .then((res: any) => {
                            console.log(`Row with a_name = ${aName} has been updated`);
                            client.end();
                        })
                        .catch((err: {detail: any}) => {
                            console.log(err.detail);
                            client.end();
                        });
                }
            } catch (err) {
                console.log(err.detail);
                client.end();
            }
        }

        static async deleteDataAnime() {
            const aID = readLineSync.question('ID of anime for deleting: ');
            const checkQuerry = 'SELECT anime_id FROM anime WHERE anime_id = $1';
            const text = 'DELETE FROM anime WHERE anime_id = $1';

            try {
                const check = await client.query(checkQuerry, [aID]);

                if (check.rows.length === 0) {
                    console.log(`There is no record with anime_id = ${aID} in database`);
                    client.end();
                } else {
                    client.query(text, [aID])
                        .then((res: any) => {
                            console.log(`Row with anime_id = ${aID} has been deleted from table anime`);
                            client.end();
                        })
                        .catch((err: {detail: any}) => {
                            console.log(err.detail);
                            client.end();
                        });
                }
            } catch (err) {
                console.log(err);
                client.end();
            }
        }

        static async showDataAnime() {
            const text = 'SELECT * FROM anime';

            try {
                const res = await client.query(text);

                if (res.rows.length === 0) {
                    console.log('Table anime is empty');
                    client.end();
                } else {
                    console.log('anime_id |     a_name     |          description          | series | genre');
                    console.log('__________________________________________________________________________');

                    res.rows.forEach((item: any) => {
                        let modName: string = '';
                        let modDescr: string = '';

                        if (item.a_name.length > 16) {
                            modName = item.a_name.substr(0, 13) + '...';
                        } else {
                            modName = Model.formatField(16, item.a_name);
                        }

                        if (item.description.length > 31) {
                            modDescr = item.description.substr(0, 28) + '...';
                        } else {
                            modDescr = Model.formatField(31, item.description);
                        }

                        console.log(`${Model.formatField(9, item.anime_id.toString())}|${modName}|${modDescr}|${Model.formatField(8, item.series.toString())}|${item.genre}`);
                        console.log('__________________________________________________________________________');
                    });

                    client.end();
                }
            } catch (err) {
                console.log(err);
                client.end();
            }
        }

        static prepareDataGenre(): Genre {
            let genreRow: Genre = {
                length: 1,
                columns: {
                    g_name: ''
                }
            };

            genreRow.columns.g_name = readLineSync.question('genre name: ');

            return genreRow;
        }

        static async addDataGenre(genreRow: Genre) {
            const text = 'INSERT INTO genre (g_name) VALUES ($1)';
            const values = [genreRow.columns.g_name];

            try {
                await client.query(text, values);
                console.log('Added 1 element to table genre');
                client.end();
            } catch (err) {
                console.log('Something went wrong');
                client.end();
            }
        }

        static async editDataGenre() {
            const gName = readLineSync.question('name of genre for editing: ');
            const checkText = 'SELECT g_name FROM genre where g_name = $1';
            const text = 'UPDATE genre SET g_name = $1 WHERE g_name = $2';

            try {
                const check = await client.query(checkText, [gName]);

                if (check.rows.length === 0) {
                    console.log(`There is no ${gName} genre in table genre`);
                    client.end();
                } else {
                    const newRow: Genre = this.prepareDataGenre();
                    const values: Array<any> = [
                        newRow.columns.g_name,
                        gName
                    ];

                    client.query(text, values)
                        .then((res: any) => {
                            console.log(`Row with g_name = ${gName} has been updated`);
                            client.end();
                        })
                        .catch((err: {detail: any}) => {
                            console.log(err.detail);
                            client.end();
                        });
                }
            } catch (err) {
                console.log(err.detail);
                client.end();
            }
        }

        static async deleteDataGenre() {
            const gID = readLineSync.question('ID of genre for deleting: ');
            const checkQuerry = 'SELECT genre_id FROM genre WHERE genre_id = $1';
            const text = 'DELETE FROM genre WHERE genre_id = $1';

            try {
                const check = await client.query(checkQuerry, [gID]);

                if (check.rows.length === 0) {
                    console.log(`There is no record with genre_id = ${gID} in database`);
                    client.end();
                } else {
                    client.query(text, [gID])
                        .then((res: any) => {
                            console.log(`Row with genre_id = ${gID} has been deleted from table genre`);
                            client.end();
                        })
                        .catch((err: {detail: any}) => {
                            console.log(err.detail);
                            client.end();
                        });
                }
            } catch (err) {
                console.log(err);
                client.end();
            }
        }

        static async showDataGenre() {
            const text = 'SELECT * FROM genre';

            try {
                const res = await client.query(text);

                if (res.rows.length === 0) {
                    console.log('Table genre is empty');
                    client.end();
                } else {
                    console.log('genre_id |        g_name       ');
                    console.log('_______________________________');

                    res.rows.forEach((item: any) => {
                        let modGName: string = '';

                        if (item.g_name.length > 21) {
                            modGName = item.g_name.substr(0, 18) + '...';
                        } else {
                            modGName = Model.formatField(21, item.g_name);
                        }

                        console.log(`${Model.formatField(9, item.genre_id.toString())}|${modGName}`);
                        console.log('_______________________________');
                    });

                    client.end();
                }
            } catch (err) {
                console.log(err);
                client.end();
            }
        }

        static prepareDataPassport(): Passport {
            let passportRow: Passport = {
                length: 3,
                columns: {
                    name: '',
                    surname: '',
                    birth_date: ''
                }
            };

            passportRow.columns.name = readLineSync.question('passport name: ');
            passportRow.columns.surname = readLineSync.question('passport surnamename: ');
            passportRow.columns.birth_date = readLineSync.question('passport birth date: ');

            return passportRow;
        }

        static async addDataPassport(passportRow: Passport) {
            const text = 'INSERT INTO passport (name, surname, birth_date) VALUES ($1, $2, $3)';
            const values = [passportRow.columns.name, passportRow.columns.surname, passportRow.columns.birth_date];

            try {
                await client.query(text, values);
                console.log('Added 1 element to table passport');
                client.end();
            } catch (err) {
                console.log('Something went wrong');
                client.end();
            }
        }

        static async editDataPassport() {
            const pID = readLineSync.question('ID of passport for editing: ');
            const checkText = 'SELECT passport_id FROM passport where passport_id = $1';
            const text = 'UPDATE passport SET name = $1, surname = $2, birth_date = $3 WHERE passport_id = $4';

            try {
                const check = await client.query(checkText, [pID]);

                if (check.rows.length === 0) {
                    console.log(`There is no row with passport_id = ${pID} in table passport`);
                    client.end();
                } else {
                    const newRow: Passport = this.prepareDataPassport();
                    const values: Array<any> = [
                        newRow.columns.name,
                        newRow.columns.surname,
                        newRow.columns.birth_date,
                        pID
                    ];

                    client.query(text, values)
                        .then((res: any) => {
                            console.log(`Row with passport_id = ${pID} has been updated`);
                            client.end();
                        })
                        .catch((err: {detail: any}) => {
                            console.log('Wrong values');
                            client.end();
                        });
                }
            } catch (err) {
                console.log(err.detail);
            }
        }

        static async deleteDataPassport() {
            const pID = readLineSync.question('ID of passport for deleting: ');
            const checkQuerry = 'SELECT passport_id FROM passport WHERE passport_id = $1';
            const text = 'DELETE FROM passport WHERE passport_id = $1';

            try {
                const check = await client.query(checkQuerry, [pID]);

                if (check.rows.length === 0) {
                    console.log(`There is no record with passport_id = ${pID} in database`);
                    client.end();
                } else {
                    client.query(text, [pID])
                        .then((res: any) => {
                            console.log(`Row with passport_id = ${pID} has been deleted from table passport`);
                            client.end();
                        })
                        .catch((err: {detail: any}) => {
                            console.log(err.detail);
                            client.end();
                        });
                }
            } catch (err) {
                console.log(err);
                client.end();
            }
        }

        static async showDataPassport() {
            const text = 'SELECT * FROM passport';

            try {
                const res = await client.query(text);

                if (res.rows.length === 0) {
                    console.log('Table passport is empty');
                    client.end();
                } else {
                    console.log('passport_id |        name       |        surname       |  birth_date ');
                    console.log('_____________________________________________________________________');

                    res.rows.forEach((item: any) => {
                        let modName: string = '';
                        let modSurname: string = '';

                        if (item.name.length > 19) {
                            modName = item.name.substr(0, 16) + '...';
                        } else {
                            modName = Model.formatField(19, item.name);
                        }

                        if (item.surname.length > 22) {
                            modSurname = item.surname.substr(0, 19) + '...';
                        } else {
                            modSurname = Model.formatField(22, item.surname);
                        }
            
                        console.log(`${Model.formatField(12, item.passport_id.toString())}|${modName}|${modSurname}|${Model.formatDate(item.birth_date)}`);
                        console.log('_____________________________________________________________________');
                    });

                    client.end();
                }
            } catch (err) {
                console.log(err);
                client.end();
            }
        }

        static prepareDataReview(): Review {
            let reviewRow: Review = {
                length: 3,
                columns: {
                    r_text: '',
                    rev_user_id: 0,
                    rev_anime_id: 0
                }
            };

            reviewRow.columns.r_text = readLineSync.question('review text: ');
            reviewRow.columns.rev_user_id = readLineSync.question('review author id: ');
            reviewRow.columns.rev_anime_id = readLineSync.question('review anime id: ');

            return reviewRow;
        }

        static async addDataReview(reviewRow: Review) {
            const text = 'INSERT INTO review (r_text, rev_user_id, rev_anime_id) VALUES ($1, $2, $3)';
            const values = [reviewRow.columns.r_text, reviewRow.columns.rev_user_id, reviewRow.columns.rev_anime_id];

            const checkQuerry = 'SELECT uu.user_id, aa.anime_id FROM "user" AS uu JOIN anime AS aa ON uu.user_id = $1 AND aa.anime_id = $2';
            const checkValues = [reviewRow.columns.rev_user_id, reviewRow.columns.rev_anime_id];

            try {
                const check = await client.query(checkQuerry, checkValues);

                if (check.rows.length === 0) {
                    console.log(`There is no user_id = ${reviewRow.columns.rev_user_id} or anime_id = ${reviewRow.columns.rev_anime_id} in database`);
                    client.end();
                } else {
                    client.query(text, values)
                        .then((res: any) => {
                            console.log('Added 1 element to table review');
                            client.end();
                        })
                        .catch((err: {detail: any}) => {
                            console.log(err.detail);
                            client.end();
                        });
                }
            } catch (err) {
                console.log('Something went wrong');
                client.end();
            }
        }

        static async editDataReview() {
            const rID = readLineSync.question('ID of review for editing: ');
            const checkText = 'SELECT review_id FROM review where review_id = $1';
            const text = 'UPDATE review SET r_text = $1, rev_user_id = $2, rev_anime_id = $3 WHERE review_id = $4';

            try {
                const check = await client.query(checkText, [rID]);

                if (check.rows.length === 0) {
                    console.log(`There is no ${rID} review_id in table review`);
                    client.end();
                } else {
                    const newRow: Review = this.prepareDataReview();
                    const values: Array<any> = [
                        newRow.columns.r_text,
                        newRow.columns.rev_user_id,
                        newRow.columns.rev_anime_id,
                        rID
                    ];

                    client.query(text, values)
                        .then((res: any) => {
                            console.log(`Row with review_id = ${rID} has been updated`);
                            client.end();
                        })
                        .catch((err: {detail: any}) => {
                            console.log(err.detail);
                            client.end();
                        });
                }
            } catch (err) {
                console.log(err.detail);
            }
        }

        static async deleteDataReview() {
            const rID = readLineSync.question('ID of review for deleting: ');
            const checkQuerry = 'SELECT review_id FROM review WHERE review_id = $1';
            const text = 'DELETE FROM review WHERE review_id = $1';

            try {
                const check = await client.query(checkQuerry, [rID]);

                if (check.rows.length === 0) {
                    console.log(`There is no record with review_id = ${rID} in database`);
                    client.end();
                } else {
                    client.query(text, [rID])
                        .then((res: any) => {
                            console.log(`Row with review_id = ${rID} has been deleted from table review`);
                            client.end();
                        })
                        .catch((err: {detail: any}) => {
                            console.log(err.detail);
                            client.end();
                        });
                }
            } catch (err) {
                console.log(err);
                client.end();
            }
        }

        static async showDataReview() {
            const text = 'SELECT * FROM review';

            try {
                const res = await client.query(text);

                if (res.rows.length === 0) {
                    console.log('Table review is empty');
                    client.end();
                } else {
                    console.log('review_id |        r_text       |    rev_user_id    |  rev_anime_id ');
                    console.log('____________________________________________________________');

                    res.rows.forEach((item: any) => {
                        let modRText: string = '';

                        if (item.r_text.length > 21) {
                            modRText = item.r_text.substr(0, 18) + '...';
                        } else {
                            modRText = Model.formatField(21, item.r_text);
                        }
            
                        console.log(`${Model.formatField(10, item.review_id.toString())}|${modRText}|${Model.formatField(19, item.rev_user_id.toString())}|${item.rev_anime_id}`);
                        console.log('____________________________________________________________');
                    });

                    client.end();
                }
            } catch (err) {
                console.log(err);
                client.end();
            }
        }

        static prepareDataUser(): User {
            let userRow: User = {
                length: 2,
                columns: {
                    username: '',
                    registry_date: '',
                }
            };

            userRow.columns.username = readLineSync.question('user nickname: ');
            userRow.columns.registry_date = this.formatDate(new Date(Date.now()));

            return userRow;
        }

        static async addDataUser(userRow: User) {
            const text = 'INSERT INTO "user" (username, registry_date) VALUES ($1, $2)';
            const values = [userRow.columns.username, userRow.columns.registry_date];

            try {
                await client.query(text, values);
                console.log('Added 1 element to table user');
                client.end();
            } catch (err) {
                console.log('Something went wrong');
                client.end();
            }
        }

        static async editDataUser() {
            const uID = readLineSync.question('ID of user for editing: ');
            const checkText = 'SELECT user_id FROM "user" where user_id = $1';
            const text = 'UPDATE "user" SET username = $1, registry_date = $2 WHERE user_id = $3';

            try {
                const check = await client.query(checkText, [uID]);

                if (check.rows.length === 0) {
                    console.log(`There is no record with user_id = ${uID} in table user`);
                    client.end();
                } else {
                    const newRow: User = this.prepareDataUser();
                    const values: Array<any> = [
                        newRow.columns.username,
                        newRow.columns.registry_date,
                        uID
                    ];

                    client.query(text, values)
                        .then((res: any) => {
                            console.log(`Row with user_id = ${uID} has been updated`);
                            client.end();
                        })
                        .catch((err: {detail: any}) => {
                            console.log('Something went wrong');
                            client.end();
                        });
                }
            } catch (err) {
                console.log('Something went wrong');
                client.end();
            }
        }

        static async deleteDataUser() {
            const rID = readLineSync.question('ID of user for deleting: ');
            const checkQuerry = 'SELECT user_id FROM "user" WHERE user_id = $1';
            const text = 'DELETE FROM "user" WHERE user_id = $1';

            try {
                const check = await client.query(checkQuerry, [rID]);

                if (check.rows.length === 0) {
                    console.log(`There is no record with user_id = ${rID} in database`);
                    client.end();
                } else {
                    client.query(text, [rID])
                        .then((res: any) => {
                            console.log(`Row with user_id = ${rID} has been deleted from table user`);
                            client.end();
                        })
                        .catch((err: {detail: any}) => {
                            console.log(err.detail);
                            client.end();
                        });
                }
            } catch (err) {
                console.log(err);
                client.end();
            }
        }

        static async showDataUser() {
            const text = 'SELECT * FROM "user"';

            try {
                const res = await client.query(text);

                if (res.rows.length === 0) {
                    console.log('Table user is empty');
                    client.end();
                } else {
                    console.log('user_id |        username       |  registry_date  | confirmed');
                    console.log('_____________________________________________________________');

                    res.rows.forEach((item: any) => {
                        let modUName: string = '';

                        if (item.username.length > 23) {
                            modUName = item.username.substr(0, 20) + '...';
                        } else {
                            modUName = Model.formatField(23, item.username);
                        }
            
                        console.log(`${Model.formatField(8, item.user_id.toString())}|${modUName}|${Model.formatField(17, Model.formatDate(item.registry_date))}|${item.confirmed}`);
                        console.log('_____________________________________________________________');
                    });

                    client.end();
                }
            } catch (err) {
                console.log(err);
                client.end();
            }
        }

        static prepareDataUserPassport(): User_Passport {
            let userPassportRow: User_Passport = {
                length: 2,
                columns: {
                    up_passport_id: 0,
                    up_user_id: 0
                }
            };

            userPassportRow.columns.up_passport_id = readLineSync.question('user passport id: ');
            userPassportRow.columns.up_user_id = readLineSync.question('user id: ');

            return userPassportRow;
        }

        static async addDataUserPassport(usPasRow: User_Passport) {
            const text = 'INSERT INTO user_passport (up_user_id, up_passport_id) VALUES ($1, $2)';
            const values = [usPasRow.columns.up_user_id, usPasRow.columns.up_passport_id];

            const checkQuerry = 'SELECT uu.user_id, pp.passport_id FROM "user" AS uu JOIN passport AS pp ON uu.user_id = $1 AND pp.passport_id = $2';
            const checkValues = [usPasRow.columns.up_user_id, usPasRow.columns.up_passport_id];

            const uniqueCheck = 'SELECT up_user_id, up_passport_id FROM user_passport AS up WHERE up.up_user_id = $1 AND up.up_passport_id = $2;';

            try {
                const uniq = await client.query(uniqueCheck, checkValues);

                if (uniq.rows.length !== 0) {
                    console.log(`Row with up_user_id = ${usPasRow.columns.up_user_id} and up_passport_id = ${usPasRow.columns.up_passport_id} already exists in table user_passport`);
                    client.end();
                } else {
                    const check = await client.query(checkQuerry, checkValues);

                    if (check.rows.length === 0) {
                        console.log(`There is no up_user_id = ${usPasRow.columns.up_user_id} or up_passport_id = ${usPasRow.columns.up_passport_id} in database`);
                        client.end();
                    } else {
                        client.query(text, values)
                            .then((res: any) => {
                                console.log('Added 1 element to table user_passport');
                                client.end();
                            })
                            .catch((err: {detail: any}) => {
                                console.log(err.detail);
                                client.end();
                            });
                    }
                }
            } catch (err) {
                console.log('Something went wrong');
                client.end();
            }
        }

        static async editDataUserPassport() {
            const upID = readLineSync.question('ID of user_passport record for editing: ');
            const checkText = 'SELECT user_passport_id FROM user_passport where user_passport_id = $1';
            const text = 'UPDATE user_passport SET up_user_id = $1, up_passport_id = $2 WHERE user_passport_id = $3';

            try {
                const check = await client.query(checkText, [upID]);

                if (check.rows.length === 0) {
                    console.log(`There is no record with user_passport_id = ${upID} in table user_passport`);
                    client.end();
                } else {
                    const newRow: User_Passport = this.prepareDataUserPassport();
                    const values: Array<any> = [
                        newRow.columns.up_user_id,
                        newRow.columns.up_passport_id,
                        upID
                    ];

                    client.query(text, values)
                        .then((res: any) => {
                            console.log(`Row with user_passport_id = ${upID} has been updated`);
                            client.end();
                        })
                        .catch((err: {detail: any}) => {
                            console.log(err.detail);
                            client.end();
                        });
                }
            } catch (err) {
                console.log('Something went wrong');
                client.end();
            }
        }

        static async deleteDataUserPassport() {
            const rID = readLineSync.question('ID of user_passport record for deleting: ');
            const checkQuerry = 'SELECT user_passport_id FROM user_passport WHERE user_passport_id = $1';
            const text = 'DELETE FROM user_passport WHERE user_passport_id = $1';

            try {
                const check = await client.query(checkQuerry, [rID]);

                if (check.rows.length === 0) {
                    console.log(`There is no record with user_passport_id = ${rID} in database`);
                    client.end();
                } else {
                    client.query(text, [rID])
                        .then((res: any) => {
                            console.log(`Row with user_passport_id = ${rID} has been deleted from table user_passport`);
                            client.end();
                        })
                        .catch((err: {detail: any}) => {
                            console.log(err.detail);
                            client.end();
                        });
                }
            } catch (err) {
                console.log(err);
                client.end();
            }
        }

        static async showDataUserPassport() {
            const text = 'SELECT * FROM user_passport';

            try {
                const res = await client.query(text);

                if (res.rows.length === 0) {
                    console.log('Table user_passport is empty');
                    client.end();
                } else {
                    console.log('user_passport_id |  up_user_id  |  up_passport_id');
                    console.log('_________________________________________________');

                    res.rows.forEach((item: any) => {
                        console.log(`${Model.formatField(17, item.user_id.toString())}|${Model.formatField(14, item.user_id.toString())}|${item.passport_id}`);
                        console.log('_________________________________________________');
                    });

                    client.end();
                }
            } catch (err) {
                console.log(err);
                client.end();
            }
        }

        static prepareDataWatched(): Watched {
            let watchRow: Watched = {
                length: 2,
                columns: {
                    watch_anime_id: 0,
                    watch_user_id: 0
                }
            };

            watchRow.columns.watch_anime_id = readLineSync.question('anime id: ');
            watchRow.columns.watch_user_id = readLineSync.question('user id: ');

            return watchRow;
        }

        static async addDataWatched(watchRow: Watched) {
            const text = 'INSERT INTO watched (watch_anime_id, watch_user_id) VALUES ($1, $2)';
            const values = [watchRow.columns.watch_anime_id, watchRow.columns.watch_user_id];
            const checkQuerry = 'SELECT uu.user_id, aa.anime_id FROM "user" AS uu JOIN anime AS aa ON aa.anime_id = $1 AND uu.user_id = $2';
            const uniqueCheck = 'SELECT watch_user_id, watch_anime_id FROM watched AS up WHERE up.watch_anime_id = $1 AND up.watch_user_id = $2;';

            try {
                const checkRes = await client.query(checkQuerry, values);

                if (checkRes.rows.length === 0) {
                    console.log(`There is no user_id = ${watchRow.columns.watch_user_id} or anime_id = ${watchRow.columns.watch_anime_id} in DB`);
                    client.end();
                } else {
                    const uniq = await client.query(uniqueCheck, values);

                    if (uniq.rows.length) {
                        console.log(`Row with user_id = ${watchRow.columns.watch_user_id} and anime_id = ${watchRow.columns.watch_anime_id} already exists in table watched`);
                        client.end();
                    } else {
                        client.query(text, values)
                            .then((res: any) => {
                                console.log('Added 1 element to table watched');
                                client.end();
                            })
                            .catch((err: {detail: any}) => {
                                console.log(err.detail);
                                client.end();
                            });
                    }
                }
            } catch (err) {
                console.log('Something went wrong');
                client.end();
            }
        }

        static async editDataWatched() {
            const wID = readLineSync.question('ID of watching for editing: ');
            const checkText = 'SELECT a_watched_id FROM watched where a_watched_id = $1';
            const text = 'UPDATE watched SET watch_anime_id = $1, watch_user_id = $2 WHERE a_watched_id = $3';

            try {
                const check = await client.query(checkText, [wID]);

                if (check.rows.length === 0) {
                    console.log(`There is no watch with a_watched_id = ${wID} in table watched`);
                    client.end();
                } else {
                    const newRow: Watched = this.prepareDataWatched();
                    const values: Array<any> = [
                        newRow.columns.watch_anime_id,
                        newRow.columns.watch_user_id,
                        wID
                    ];

                    client.query(text, values)
                        .then((res: any) => {
                            console.log(`Row with a_watched_id = ${wID} has been updated`);
                            client.end();
                        })
                        .catch((err: {detail: any}) => {
                            console.log(err.detail);
                            client.end();
                        });
                }
            } catch (err) {
                console.log('Something went wrong');
                client.end();
            }
        }

        static async deleteDataWatched() {
            const wID = readLineSync.question('ID of watch record for deleting: ');
            const checkQuerry = 'SELECT a_watched_id FROM watched WHERE a_watched_id = $1';
            const text = 'DELETE FROM watched WHERE a_watched_id = $1';

            try {
                const check = await client.query(checkQuerry, [wID]);

                if (check.rows.length === 0) {
                    console.log(`There is no record with a_watched_id = ${wID} in database`);
                    client.end();
                } else {
                    client.query(text, [wID])
                        .then((res: any) => {
                            console.log(`Row with a_watched_id = ${wID} has been deleted from table watched`);
                            client.end();
                        })
                        .catch((err: {detail: any}) => {
                            console.log(err.detail);
                            client.end();
                        });
                }
            } catch (err) {
                console.log(err);
                client.end();
            }
        }

        static async showDataWatched() {
            const text = 'SELECT * FROM watched';

            try {
                const res = await client.query(text);

                if (res.rows.length === 0) {
                    console.log('Table watched is empty');
                    client.end();
                } else {
                    console.log('a_watched_id | watch_anime_id | watch_user_id');
                    console.log('_____________________________________________');

                    res.rows.forEach((item: any) => {
                        console.log(`${Model.formatField(13, item.a_watched_id.toString())}|${Model.formatField(16, item.watch_anime_id.toString())}|${item.watch_user_id}`);
                        console.log('_____________________________________________');
                    });

                    client.end();
                }
            } catch (err) {
                console.log(err);
                client.end();
            }
        }

        static generateRows() {
            const text = `
                insert into "user" (username, registry_date, confirmed)
                select substr(characters, (random() * length(characters) + 1)::integer, 10),
                timestamp '2018-01-10' + random() * (timestamp '2018-01-20' - timestamp '2018-01-10'),
                cast(cast(round(random()) as character varying) as boolean)
                from (values('qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM')) as symbols(characters), generate_series(1, $1);
            `;

            const count = readLineSync.question('Number of rows: ');

            const start = Date.now();
            client.query(text, [count])
                .then((res: any) => {
                    console.log(`${count} rows in table user has been generated`);
                    console.log(`query time: ${Date.now() - start}ms`);
                    client.end();
                })
                .catch((err: {detail: any}) => {
                    console.log(err.detail);
                    client.end();
                });
        }

        static async staticConfirmed() {
            const text = `
                with confirmedUsers as (
                    select user_id, username from "user"
                    where confirmed = true and user_id in (select rev_user_id from review where user_id = review.rev_user_id))
                
                select user_id, username from confirmedUsers join review as rv on confirmedUsers.user_id = rv.rev_user_id;
            `;

            try {
                const start = Date.now();
                const res = await client.query(text);
                const queryTime = Date.now() - start;

                if (res.rows.length === 0) {
                    console.log('There is no result for your query');
                    client.end();
                } else {
                    console.log('user_id |    username   ');
                    console.log('________________________');

                    res.rows.forEach((item: any) => {
                        console.log(`${Model.formatField(8, item.user_id.toString())}|${item.username}`);
                        console.log('________________________');
                    });

                    console.log(`query time: ${queryTime}ms`);

                    client.end();
                }
            } catch (err) {
                console.log('Something went wrong');
                client.end();
            }
        }

        static async staticBorn() {
            const text = `
                with up_born as (
                    select up_user_id, up_passport_id from user_passport
                    where up_user_id in (select passport_id from passport where birth_date > '20000101')
                )
                
                select user_id, username from "user"
                where confirmed = true and user_id in (select up_user_id from up_born)
            `;

            try {
                const start = Date.now();
                const res = await client.query(text);
                const queryTime = Date.now() - start;

                if (res.rows.length === 0) {
                    console.log('There is no result for your query');
                    client.end();
                } else {
                    console.log('user_id |    username   ');
                    console.log('________________________');

                    res.rows.forEach((item: any) => {
                        console.log(`${Model.formatField(8, item.user_id.toString())}|${item.username}`);
                        console.log('________________________');
                    });

                    console.log(`query time: ${queryTime}ms`);

                    client.end();
                }
            } catch (err) {
                console.log('Something went wrong');
                client.end();
            }
        }

        static async mostPopularAnime() {
            const text = `
                with count_views as (
                    select watch_anime_id, count(*) as cnt from watched
                    group by watch_anime_id
                ),
                
                max_views as (
                    select * from count_views
                    where cnt in (select max(cnt) as mx from count_views)
                )
                
                select an.anime_id, an.a_name, cnt from anime an
                join max_views on an.anime_id = max_views.watch_anime_id
            `;

            try {
                const start = Date.now();
                const res = await client.query(text);
                const queryTime = Date.now() - start;

                if (res.rows.length === 0) {
                    console.log('There is no result for your query');
                    client.end();
                } else {
                    console.log('anime_id |       a_name       |  views');
                    console.log('______________________________________');

                    res.rows.forEach((item: any) => {
                        let modAName: string = '';

                        if (item.a_name.length > 20) {
                            modAName = item.a_name.substr(0, 17) + '...';
                        } else {
                            modAName = Model.formatField(20, item.a_name);
                        }

                        console.log(`${Model.formatField(9, item.anime_id.toString())}|${modAName}|${item.cnt}`);
                        console.log('______________________________________');
                    });

                    console.log(`query time: ${queryTime}ms`);

                    client.end();
                }
            } catch (err) {
                console.log('Something went wrong');
                client.end();
            }
        }

        static async specDateReg() {
            const text = `
                with confUsers as (
                    select * from "user" where confirmed = true
                ),
                
                specDate as (
                    select * from confUsers where registry_date > $1 and registry_date < $2
                )
                
                select * from specDate
            `;

            const fromDate = readLineSync.question('from date: ');
            const toDate = readLineSync.question('to date: ');

            try {
                const start = Date.now();
                const res = await client.query(text, [fromDate, toDate]);
                const queryTime = Date.now() - start;

                if (res.rows.length === 0) {
                    console.log('There is no result for your query');
                    client.end();
                } else {
                    console.log('user_id |    username   | registry_date');
                    console.log('_______________________________________');

                    res.rows.forEach((item: any) => {
                        console.log(`${Model.formatField(8, item.user_id.toString())}|${Model.formatField(15, item.username)}|${Model.formatDate(item.registry_date)}`);
                        console.log('_______________________________________');
                    });

                    console.log(`query time: ${queryTime}ms`);

                    client.end();
                }

                client.end();
            } catch (err) {
                console.log(err);
                client.end();
            }
        }

        static async specGenreAnime() {
            const text = `
                select * from anime where genre in (select genre_id from genre where g_name = $1)
            `;

            const genreName = readLineSync.question('genre name: ');

            try {
                const start = Date.now();
                const res = await client.query(text, [genreName]);
                const queryTime = Date.now() - start;

                if (res.rows.length === 0) {
                    console.log(`There is no anime with genre ${genreName} in database`);
                    client.end();
                } else {
                    console.log('anime_id |     a_name     |          description          | series |  genre');
                    console.log('_______________________________________________________________________________');

                    res.rows.forEach((item: any) => {
                        let modName: string = '';
                        let modDescr: string = '';

                        if (item.a_name.length > 16) {
                            modName = item.a_name.substr(0, 13) + '...';
                        } else {
                            modName = Model.formatField(16, item.a_name);
                        }

                        if (item.description.length > 31) {
                            modDescr = item.description.substr(0, 28) + '...';
                        } else {
                            modDescr = Model.formatField(31, item.description);
                        }

                        console.log(`${Model.formatField(9, item.anime_id.toString())}|${modName}|${modDescr}|${Model.formatField(8, item.series.toString())}|${genreName}`);
                        console.log('_______________________________________________________________________________');
                    });

                    console.log(`query time: ${queryTime}ms`);

                    client.end();
                }
            } catch (err) {
                console.log('Something went wrong');
                client.end();
            }
        }

        static async specSeriesAnime() {
            const text = `
                with specSer as (
                    select * from anime where series > $1 and series < $2
                )
                
                select an.anime_id, an.a_name, an.series, g_name from specSer an join genre on genre.genre_id = an.genre
            `;

            const minSer = readLineSync.question('min series: ');
            const maxSer = readLineSync.question('max series: ');

            try {
                const start = Date.now();
                const res = await client.query(text, [minSer, maxSer]);
                const queryTime = Date.now() - start;

                if (res.rows.length === 0) {
                    console.log('There is no result for your query');
                    client.end();
                } else {
                    console.log('anime_id |     a_name     | series |      genre');
                    console.log('_____________________________________________________');

                    res.rows.forEach((item: any) => {
                        let modName: string = '';
                        let modDescr: string = '';

                        if (item.a_name.length > 16) {
                            modName = item.a_name.substr(0, 13) + '...';
                        } else {
                            modName = Model.formatField(16, item.a_name);
                        }

                        console.log(`${Model.formatField(9, item.anime_id.toString())}|${modName}|${Model.formatField(8, item.series.toString())}|${item.g_name}`);
                        console.log('_____________________________________________________');
                    });

                    console.log(`query time: ${queryTime}ms`);

                    client.end();
                }
            } catch (err) {
                console.log('Something went wrong');
                client.end();
            }
        }

        static formatDate(date: Date): string {
            let dd: string = date.getDate().toString();
            let mm: string = (date.getMonth() + 1).toString();
            let yy: string = (date.getFullYear() % 100).toString();

            if (+dd < 10) {
                dd = '0' + dd;
            }
          
            if (+mm < 10) {
                mm = '0' + mm;
            }
          
            if (+yy < 10) {
               yy = '0' + yy;
            }
          
            return dd + '.' + mm + '.' + yy;
        }

        static formatField(len: number, str: string): string {
            let newStr: string = str;

            while (newStr.length < len) {
                newStr += ' ';
            }

            return newStr;
        }
    }

    module.exports = {Model, client};
}*/ 
